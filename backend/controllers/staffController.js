const asyncHandler = require("../middleware/asyncHandler");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const checkEmailExists = require("../utils/checkEmailExists");

// ==========================
// Create Staff
// POST /api/staff
// Admin Only
// ==========================
const createStaff = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    role,
  } = req.body;

  // Normalize role
  const normalizedRole = (role || "")
    .trim()
    .toLowerCase();

  // Staff roles only
  const allowedRoles = [
    "receptionist",
    "trainer",
  ];

  // Validate role
  if (!allowedRoles.includes(normalizedRole)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid staff role. Allowed roles are: receptionist, trainer",
    });
  }

  // Check email
  const emailExists = await checkEmailExists({
    email,
    gymId: req.user.gymId,
  });

  if (emailExists) {
    return res.status(409).json({
      success: false,
      message: "Email already exists in the system",
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  // Create staff
  const staff = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: normalizedRole,
    gymId: req.user.gymId,
    isActive: true,

    // Store the Admin who created this staff account
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Staff account created successfully",
    data: {
      id: staff._id,
      fullName: staff.fullName,
      email: staff.email,
      role: staff.role,
      isActive: staff.isActive,
    },
  });
});

// ==========================
// Get All Staff
// GET /api/staff
// Admin Only
// ==========================
const getAllStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({
    role: {
      $in: ["receptionist", "trainer"],
    },

    // Only staff created by logged-in Admin
    createdBy: req.user._id,
  })
    .select("-password")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: staff.length,
    data: staff,
  });
});

// ==========================
// Get All Trainers
// GET /api/staff/trainers
// Admin / Receptionist
// ==========================
const getAllTrainers = asyncHandler(async (req, res) => {
  const trainers = await User.find({
    role: "trainer",
    isActive: true,
    gymId: req.user.gymId,
  })
    .select("_id fullName email role")
    .sort({
      fullName: 1,
    });

  res.status(200).json({
    success: true,
    count: trainers.length,
    data: trainers,
  });
});

// ==========================
// Update Staff
// PUT /api/staff/:id
// Admin Only
// ==========================
const updateStaff = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    role,
    isActive,
  } = req.body;

  const staff = await User.findOne({
    _id: req.params.id,
    gymId: req.user.gymId,
  });

  if (!staff) {
    return res.status(404).json({
      success: false,
      message: "Staff member not found",
    });
  }

  // Prevent managing staff belonging to another Admin
  if (
    !staff.createdBy ||
    staff.createdBy.toString() !==
      req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message:
        "You are not authorized to manage this staff member",
    });
  }

  // Prevent editing an Admin
  if (staff.role === "admin") {
    return res.status(403).json({
      success: false,
      message:
        "Admin accounts cannot be managed as staff",
    });
  }

  // Validate role if provided
  if (role !== undefined) {
    const normalizedRole = role
      .trim()
      .toLowerCase();

    if (
      !["receptionist", "trainer"].includes(
        normalizedRole
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff role",
      });
    }

    staff.role = normalizedRole;
  }

  // Check email change
  if (
    email &&
    email.toLowerCase() !== staff.email
  ) {
    const emailExists =
      await checkEmailExists({
        email,
        gymId: req.user.gymId,
        excludeUserId: staff._id,
      });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message:
          "Email already exists in the system",
      });
    }

    staff.email = email.toLowerCase();
  }

  if (fullName !== undefined) {
    staff.fullName = fullName;
  }

  if (password) {
    staff.password =
      await bcrypt.hash(password, 10);
  }

  if (isActive !== undefined) {
    staff.isActive = isActive;
  }

  await staff.save();

  res.status(200).json({
    success: true,
    message: "Staff updated successfully",
    data: {
      id: staff._id,
      fullName: staff.fullName,
      email: staff.email,
      role: staff.role,
      isActive: staff.isActive,
    },
  });
});

// ==========================
// Delete Staff
// DELETE /api/staff/:id
// Admin Only
// ==========================
const deleteStaff = asyncHandler(async (req, res) => {
  const staff = await User.findOne({
    _id: req.params.id,
    gymId: req.user.gymId,
  });

  if (!staff) {
    return res.status(404).json({
      success: false,
      message: "Staff member not found",
    });
  }

  // Prevent deleting staff belonging to another Admin
  if (
    !staff.createdBy ||
    staff.createdBy.toString() !==
      req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message:
        "You are not authorized to delete this staff member",
    });
  }

  // Never delete Admin through staff route
  if (staff.role === "admin") {
    return res.status(403).json({
      success: false,
      message:
        "Admin accounts cannot be deleted through staff management",
    });
  }

  await User.findOneAndDelete({
    _id: req.params.id,
    gymId: req.user.gymId,
  });

  res.status(200).json({
    success: true,
    message: "Staff deleted successfully",
  });
});

module.exports = {
  createStaff,
  getAllStaff,
  getAllTrainers,
  updateStaff,
  deleteStaff,
};