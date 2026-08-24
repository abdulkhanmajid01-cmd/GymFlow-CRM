// Import Async Handler
const asyncHandler = require("../middleware/asyncHandler");

// Import User Model
const User = require("../models/User");

// Import Gym Model
const Gym = require("../models/Gym");

// ==========================
// Get All Gym Administrators
// GET /api/gym-admins
// ==========================

const getAllGymAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({
    role: "admin",
  })
    .populate("gymId", "name email phoneNumber address isActive")
    .select(
      "_id fullName email role gymId isActive createdBy createdAt updatedAt"
    )
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: admins.length,
    data: admins,
  });
});

// ==========================
// Get Single Gym Administrator
// GET /api/gym-admins/:id
// ==========================

const getSingleGymAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findOne({
    _id: req.params.id,
    role: "admin",
  })
    .populate(
      "gymId",
      "name email phoneNumber address isActive createdAt updatedAt"
    )
    .select(
      "_id fullName email role gymId isActive createdBy createdAt updatedAt"
    );

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Gym administrator not found.",
    });
  }

  res.status(200).json({
    success: true,
    data: admin,
  });
});

// ==========================
// Toggle Gym Administrator Status
// PATCH /api/gym-admins/:id/status
// ==========================

const toggleGymAdminStatus = asyncHandler(async (req, res) => {
  const admin = await User.findOne({
    _id: req.params.id,
    role: "admin",
  });

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Gym administrator not found.",
    });
  }

  admin.isActive = !admin.isActive;

  await admin.save();

  const updatedAdmin = await User.findById(admin._id)
    .populate(
      "gymId",
      "name email phoneNumber address isActive"
    )
    .select(
      "_id fullName email role gymId isActive createdBy createdAt updatedAt"
    );

  res.status(200).json({
    success: true,
    message: `Gym administrator ${
      updatedAdmin.isActive
        ? "activated"
        : "deactivated"
    } successfully.`,
    data: updatedAdmin,
  });
});

// ==========================
// Export Controllers
// ==========================

module.exports = {
  getAllGymAdmins,
  getSingleGymAdmin,
  toggleGymAdminStatus,
};