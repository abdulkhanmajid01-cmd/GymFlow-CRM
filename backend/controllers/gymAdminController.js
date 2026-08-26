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
  const filter = { role: "admin" };

  // Non-superAdmin users see only their gym's admin
  if (
    req.user.role !== "superAdmin" &&
    req.user.gymId
  ) {
    filter.gymId = req.user.gymId;
  }

  const admins = await User.find(filter)
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
  const filter = {
    _id: req.params.id,
    role: "admin",
  };

  // Non-superAdmin users can only view their gym's admin
  if (
    req.user.role !== "superAdmin" &&
    req.user.gymId
  ) {
    filter.gymId = req.user.gymId;
  }

  const admin = await User.findOne(filter)
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

  // ==========================
  // Activation Guard
  //
  // An administrator assigned to an
  // INACTIVE gym cannot be activated.
  //
  // The gym must be activated first.
  //
  // Deactivation is ALWAYS allowed and
  // never affects the gym itself.
  // ==========================

  const isActivating =
    admin.isActive === false;

  if (isActivating && admin.gymId) {
    const gym = await Gym.findById(
      admin.gymId
    ).select("isActive");

    if (gym && gym.isActive === false) {
      return res.status(409).json({
        success: false,
        message:
          "Cannot activate this administrator because their gym is currently inactive. Activate the gym first.",
      });
    }
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