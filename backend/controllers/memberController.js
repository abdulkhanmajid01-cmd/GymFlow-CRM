// Import Member Model
const Member = require("../models/Member");

// Import User Model
const User = require("../models/User");

// Import Membership Plan Model
const MembershipPlan = require("../models/MembershipPlan");

// Import Helper
const checkEmailExists = require("../utils/checkEmailExists");

// Import Shared Date Helper
const {
  createDateFromDateString,
} = require("../utils/dateUtils");

// ==========================
// Date Helpers
// ==========================

const getPakistanDateString = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

const addMonthsToDate = (date, months) => {
  const result = new Date(date);

  const originalDay = result.getUTCDate();

  result.setUTCDate(1);

  result.setUTCMonth(
    result.getUTCMonth() + months
  );

  const lastDay = new Date(
    Date.UTC(
      result.getUTCFullYear(),
      result.getUTCMonth() + 1,
      0
    )
  ).getUTCDate();

  result.setUTCDate(
    Math.min(originalDay, lastDay)
  );

  return result;
};

// ==========================
// Create Member
// ==========================

const createMember = async (req, res, next) => {
  try {
    const {
      email,
      membershipPlan,
      joiningDate,
    } = req.body;

    // ==========================
    // Gym Context
    // ==========================

    const gymId = req.user.gymId;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to a gym",
      });
    }

    // ==========================
    // Check Email
    // ==========================

    const emailExists =
      await checkEmailExists({
        email,
        gymId,
      });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message:
          "Email already exists in this gym",
      });
    }

    // ==========================
    // Check Member ID
    // Same Gym Only
    // ==========================

    const {
      memberId,
      cnic,
      phoneNumber,
    } = req.body;

    const memberIdExists =
      await Member.findOne({
        memberId,
        gymId,
      });

    if (memberIdExists) {
      return res.status(409).json({
        success: false,
        message:
          "Member ID already exists in this gym",
      });
    }

    // ==========================
    // Check CNIC
    // Same Gym Only
    // ==========================

    const cnicExists =
      await Member.findOne({
        cnic,
        gymId,
      });

    if (cnicExists) {
      return res.status(409).json({
        success: false,
        message:
          "CNIC already exists in this gym",
      });
    }

    // ==========================
    // Check Phone Number
    // Same Gym Only
    // ==========================

    const phoneExists =
      await Member.findOne({
        phoneNumber,
        gymId,
      });

    if (phoneExists) {
      return res.status(409).json({
        success: false,
        message:
          "Phone number already exists in this gym",
      });
    }

    // ==========================
    // Find Membership Plan
    // Same Gym Only
    // ==========================

    const plan =
      await MembershipPlan.findOne({
        _id: membershipPlan,
        gymId,
      });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message:
          "Membership plan not found for this gym",
      });
    }

    // ==========================
    // Validate Assigned Trainer
    // Must Be An Active Trainer
    // Inside The Same Gym
    // ==========================

    const assignedTrainer =
      req.body.assignedTrainer;

    if (assignedTrainer) {
      const trainer =
        await User.findOne({
          _id: assignedTrainer,
          role: "trainer",
          isActive: true,
          gymId,
        });

      if (!trainer) {
        return res.status(400).json({
          success: false,
          message:
            "Assigned trainer not found in this gym",
        });
      }
    }

    // ==========================
    // Joining Date
    // ==========================

    const dateString = joiningDate
      ? joiningDate.substring(0, 10)
      : getPakistanDateString();

    const startDate =
      createDateFromDateString(
        dateString
      );

    if (!startDate) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid joining date.",
      });
    }

    // ==========================
    // Calculate Expiry Date
    // ==========================

    const expiryDate =
      addMonthsToDate(
        startDate,
        plan.durationInMonths
      );

    // ==========================
    // Create Member
    // ==========================

    const member = await Member.create({
      ...req.body,

      // IMPORTANT:
      // Never trust gymId from frontend
      gymId,

      joiningDate: startDate,

      membershipExpiryDate:
        expiryDate,
    });

    // ==========================
    // Success Response
    // ==========================

    res.status(201).json({
      success: true,
      message:
        "Member created successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Get All Members
// ==========================

const getAllMembers = async (
  req,
  res,
  next
) => {
  try {
    // ==========================
    // Gym Context
    // ==========================

    const gymId = req.user.gymId;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to a gym",
      });
    }

    // ==========================
    // Base Gym Filter
    // ==========================

    const filter = {
      gymId,
    };

    // ==========================
    // Trainer → Only Assigned Members
    // Admin / Receptionist → All
    // ==========================

    if (req.user.role === "trainer") {
      filter.assignedTrainer =
        req.user._id;
    }

    // ==========================
    // Get Members
    // ==========================

    const members =
      await Member.find(filter).populate(
        "membershipPlan"
      );

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Get Single Member
// ==========================

const getSingleMember = async (
  req,
  res,
  next
) => {
  try {
    // ==========================
    // Gym Context
    // ==========================

    const gymId = req.user.gymId;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to a gym",
      });
    }

    // ==========================
    // Build Access Filter
    // ==========================

    const filter = {
      _id: req.params.id,
      gymId,
    };

    // ==========================
    // Trainer → Assigned Members Only
    // ==========================

    if (req.user.role === "trainer") {
      filter.assignedTrainer =
        req.user._id;
    }

    // ==========================
    // Find Member
    // ==========================

    const member =
      await Member.findOne(filter).populate(
        "membershipPlan"
      );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Update Member
// ==========================

const updateMember = async (
  req,
  res,
  next
) => {
  try {
    // ==========================
    // Gym Context
    // ==========================

    const gymId = req.user.gymId;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to a gym",
      });
    }

    // ==========================
    // Find Current Member
    // Same Gym Only
    // ==========================

    const currentMember =
      await Member.findOne({
        _id: req.params.id,
        gymId,
      });

    if (!currentMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // ==========================
    // Check Email
    // Same Gym Only
    // ==========================

    if (
      req.body.email &&
      req.body.email !==
        currentMember.email
    ) {
      const emailExists =
        await checkEmailExists({
          email: req.body.email,
          gymId,
          excludeMemberId:
            req.params.id,
        });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message:
            "Email already exists in this gym",
        });
      }
    }

    // ==========================
    // Check Member ID
    // Same Gym Only
    // ==========================

    if (
      req.body.memberId &&
      req.body.memberId !==
        currentMember.memberId
    ) {
      const memberIdExists =
        await Member.findOne({
          memberId: req.body.memberId,
          gymId,
          _id: { $ne: req.params.id },
        });

      if (memberIdExists) {
        return res.status(409).json({
          success: false,
          message:
            "Member ID already exists in this gym",
        });
      }
    }

    // ==========================
    // Check CNIC
    // Same Gym Only
    // ==========================

    if (
      req.body.cnic &&
      req.body.cnic !==
        currentMember.cnic
    ) {
      const cnicExists =
        await Member.findOne({
          cnic: req.body.cnic,
          gymId,
          _id: { $ne: req.params.id },
        });

      if (cnicExists) {
        return res.status(409).json({
          success: false,
          message:
            "CNIC already exists in this gym",
        });
      }
    }

    // ==========================
    // Check Phone Number
    // Same Gym Only
    // ==========================

    if (
      req.body.phoneNumber &&
      req.body.phoneNumber !==
        currentMember.phoneNumber
    ) {
      const phoneExists =
        await Member.findOne({
          phoneNumber:
            req.body.phoneNumber,
          gymId,
          _id: { $ne: req.params.id },
        });

      if (phoneExists) {
        return res.status(409).json({
          success: false,
          message:
            "Phone number already exists in this gym",
        });
      }
    }

    // ==========================
    // Prepare Update Data
    // ==========================

    const updateData = {
      ...req.body,
    };

    // ==========================
    // Protect Gym Ownership
    // ==========================

    // Never allow frontend to change
    // member's gym.
    updateData.gymId = gymId;

    // ==========================
    // Validate Assigned Trainer
    // Must Be An Active Trainer
    // Inside The Same Gym
    // ==========================

    if (
      req.body.assignedTrainer !== undefined
    ) {
      const assignedTrainer =
        req.body.assignedTrainer;

      if (assignedTrainer) {
        const trainer =
          await User.findOne({
            _id: assignedTrainer,
            role: "trainer",
            isActive: true,
            gymId,
          });

        if (!trainer) {
          return res.status(400).json({
            success: false,
            message:
              "Assigned trainer not found in this gym",
          });
        }
      }

      // Normalize empty value to null so a
      // member can be unassigned cleanly.
      updateData.assignedTrainer =
        assignedTrainer || null;
    }

    // ==========================
    // Check Membership Changes
    // ==========================

    const membershipPlanChanged =
      req.body.membershipPlan &&
      req.body.membershipPlan !==
        currentMember.membershipPlan.toString();

    const joiningDateChanged =
      req.body.joiningDate &&
      req.body.joiningDate.substring(0, 10) !==
        currentMember.joiningDate
          .toISOString()
          .substring(0, 10);

    // ==========================
    // Recalculate Expiry
    // ==========================

    if (
      membershipPlanChanged ||
      joiningDateChanged
    ) {
      const planId =
        req.body.membershipPlan ||
        currentMember.membershipPlan;

      // ==========================
      // Find Plan
      // Same Gym Only
      // ==========================

      const plan =
        await MembershipPlan.findOne({
          _id: planId,
          gymId,
        });

      if (!plan) {
        return res.status(404).json({
          success: false,
          message:
            "Membership plan not found for this gym",
        });
      }

      const dateString =
        req.body.joiningDate
          ? req.body.joiningDate.substring(
              0,
              10
            )
          : currentMember.joiningDate
              .toISOString()
              .substring(0, 10);

      const startDate =
        createDateFromDateString(
          dateString
        );

      if (!startDate) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid joining date.",
        });
      }

      const expiryDate =
        addMonthsToDate(
          startDate,
          plan.durationInMonths
        );

      updateData.joiningDate =
        startDate;

      updateData.membershipExpiryDate =
        expiryDate;
    }

    // ==========================
    // If Membership Plan
    // Is Not Changed
    // Still Validate It
    // ==========================

    if (
      req.body.membershipPlan &&
      !membershipPlanChanged
    ) {
      const plan =
        await MembershipPlan.findOne({
          _id: req.body.membershipPlan,
          gymId,
        });

      if (!plan) {
        return res.status(404).json({
          success: false,
          message:
            "Membership plan not found for this gym",
        });
      }
    }

    // ==========================
    // Update Member
    // ==========================

    const updatedMember =
      await Member.findOneAndUpdate(
        {
          _id: req.params.id,
          gymId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).populate("membershipPlan");

    if (!updatedMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Member updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Delete Member
// ==========================

const deleteMember = async (
  req,
  res,
  next
) => {
  try {
    // ==========================
    // Gym Context
    // ==========================

    const gymId = req.user.gymId;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to a gym",
      });
    }

    // ==========================
    // Delete From Current Gym Only
    // ==========================

    const member =
      await Member.findOneAndDelete({
        _id: req.params.id,
        gymId,
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Member deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Export Controllers
// ==========================

module.exports = {
  createMember,
  getAllMembers,
  getSingleMember,
  updateMember,
  deleteMember,
};