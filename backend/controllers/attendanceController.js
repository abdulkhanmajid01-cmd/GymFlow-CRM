// Import Async Handler
const asyncHandler = require("../middleware/asyncHandler");

// Import Attendance Model
const Attendance = require("../models/Attendance");

// Import Member Model
const Member = require("../models/Member");

// Import Shared Date Helper
const {
  createDateFromDateString,
} = require("../utils/dateUtils");

// ==========================
// Helper: Get Gym ID
// ==========================

const getGymId = (req) => {
  return req.user?.gymId;
};

// ==========================
// Helper: Date Normalization
// ==========================
//
// Attendance dates are normalized to a
// timezone-stable instant (noon UTC of the
// calendar date) so that every environment
// stores the same "one record per member
// per day per gym" bucket regardless of the
// server's local timezone.
//
// Implemented in the shared utils/dateUtils
// helper used across controllers.
// ==========================

// ==========================
// Create / Mark Attendance
// ==========================

const markAttendance = asyncHandler(async (req, res) => {
  const {
    memberId,
    date,
    status,
    checkIn,
    checkOut,
  } = req.body;

  const gymId = getGymId(req);

  // ==========================
  // Validate Gym
  // ==========================

  if (!gymId) {
    return res.status(400).json({
      success: false,
      message: "User is not assigned to a gym.",
    });
  }

  // ==========================
  // Validate Required Fields
  // ==========================

  if (!memberId || !date || !status) {
    return res.status(400).json({
      success: false,
      message:
        "Member, date and attendance status are required.",
    });
  }

  if (!["present", "absent"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid attendance status.",
    });
  }

  // ==========================
  // Find Member Inside Same Gym
  // ==========================

  const member = await Member.findOne({
    _id: memberId,
    gymId,
  });

  if (!member) {
    return res.status(404).json({
      success: false,
      message: "Member not found in your gym.",
    });
  }

  // ==========================
  // Trainer Restriction
  //
  // Trainer can mark attendance
  // ONLY for assigned members.
  // ==========================

  if (
    req.user.role === "trainer" &&
    String(member.assignedTrainer) !==
      String(req.user._id)
  ) {
    return res.status(403).json({
      success: false,
      message:
        "You can only mark attendance for your assigned members.",
    });
  }

  // ==========================
  // Normalize Date
  // ==========================

  const attendanceDate =
    createDateFromDateString(
      String(date).substring(0, 10)
    );

  if (!attendanceDate) {
    return res.status(400).json({
      success: false,
      message: "Invalid attendance date.",
    });
  }

  // ==========================
  // Check Existing Attendance
  // ==========================

  const existingAttendance =
    await Attendance.findOne({
      gymId,
      memberId,
      date: attendanceDate,
    });

  if (existingAttendance) {
    return res.status(409).json({
      success: false,
      message:
        "Attendance has already been marked for this member on this date.",
    });
  }

  // ==========================
  // Create Attendance
  // ==========================

  const attendance =
    await Attendance.create({
      gymId,
      memberId,
      date: attendanceDate,
      status,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      markedBy: req.user._id,
    });

  // ==========================
  // Success Response
  // ==========================

  res.status(201).json({
    success: true,
    message:
      "Attendance marked successfully.",
    data: attendance,
  });
});

// ==========================
// Get All Attendance
// ==========================

const getAllAttendance = asyncHandler(
  async (req, res) => {
    const gymId = getGymId(req);

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message:
          "User is not assigned to a gym.",
      });
    }

    const query = {
      gymId,
    };

    // ==========================
    // Trainer Restriction
    // ==========================

    if (req.user.role === "trainer") {
      const assignedMembers =
        await Member.find({
          gymId,
          assignedTrainer: req.user._id,
        }).select("_id");

      const memberIds =
        assignedMembers.map(
          (member) => member._id
        );

      query.memberId = {
        $in: memberIds,
      };
    }

    // ==========================
    // Optional Date Filter
    // ==========================

    if (req.query.date) {
      const attendanceDate =
        createDateFromDateString(
          String(req.query.date).substring(0, 10)
        );

      if (!attendanceDate) {
        return res.status(400).json({
          success: false,
          message: "Invalid date.",
        });
      }

      const nextDate =
        new Date(attendanceDate);

      nextDate.setUTCDate(
        nextDate.getUTCDate() + 1
      );

      query.date = {
        $gte: attendanceDate,
        $lt: nextDate,
      };
    }

    // ==========================
    // Get Attendance
    // ==========================

    const attendance =
      await Attendance.find(query)
        .populate(
          "memberId",
          "fullName memberId email phoneNumber"
        )
        .populate(
          "markedBy",
          "fullName email role"
        )
        .sort({
          date: -1,
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  }
);

// ==========================
// Update Attendance
// ==========================

const updateAttendance = asyncHandler(
  async (req, res) => {
    const gymId = getGymId(req);

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message:
          "User is not assigned to a gym.",
      });
    }

    // ==========================
    // Find Attendance
    // ==========================

    const attendance =
      await Attendance.findOne({
        _id: req.params.id,
        gymId,
      });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found.",
      });
    }

    // ==========================
    // Find Member
    // ==========================

    const member =
      await Member.findOne({
        _id: attendance.memberId,
        gymId,
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    // ==========================
    // Trainer Restriction
    // ==========================

    if (
      req.user.role === "trainer" &&
      String(member.assignedTrainer) !==
        String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update attendance for your assigned members.",
      });
    }

    // ==========================
    // Allowed Update Fields
    // ==========================

    const updateData = {};

    if (req.body.status !== undefined) {
      if (
        !["present", "absent"].includes(
          req.body.status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid attendance status.",
        });
      }

      updateData.status =
        req.body.status;
    }

    if (req.body.checkIn !== undefined) {
      updateData.checkIn =
        req.body.checkIn || null;
    }

    if (req.body.checkOut !== undefined) {
      updateData.checkOut =
        req.body.checkOut || null;
    }

    // ==========================
    // Reject Empty Update
    // ==========================

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No valid fields provided to update.",
      });
    }

    // ==========================
    // Update
    // ==========================

    const updatedAttendance =
      await Attendance.findOneAndUpdate(
        {
          _id: req.params.id,
          gymId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "memberId",
          "fullName memberId email phoneNumber"
        )
        .populate(
          "markedBy",
          "fullName email role"
        );

    res.status(200).json({
      success: true,
      message:
        "Attendance updated successfully.",
      data: updatedAttendance,
    });
  }
);

// ==========================
// Delete Attendance
// ==========================

const deleteAttendance = asyncHandler(
  async (req, res) => {
    const gymId = getGymId(req);

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message:
          "User is not assigned to a gym.",
      });
    }

    const attendance =
      await Attendance.findOne({
        _id: req.params.id,
        gymId,
      });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found.",
      });
    }

    // ==========================
    // Trainer Restriction
    // ==========================

    if (req.user.role === "trainer") {
      const member =
        await Member.findOne({
          _id: attendance.memberId,
          gymId,
          assignedTrainer: req.user._id,
        });

      if (!member) {
        return res.status(403).json({
          success: false,
          message:
            "You can only delete attendance for your assigned members.",
        });
      }
    }

    await Attendance.findOneAndDelete({
      _id: req.params.id,
      gymId,
    });

    res.status(200).json({
      success: true,
      message:
        "Attendance deleted successfully.",
    });
  }
);

// ==========================
// Export Controllers
// ==========================

module.exports = {
  markAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
};