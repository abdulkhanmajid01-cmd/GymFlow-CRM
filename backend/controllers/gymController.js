// Import Async Handler
const asyncHandler = require("../middleware/asyncHandler");

// Import bcrypt for password hashing
const bcrypt = require("bcryptjs");

// Import Gym Model
const Gym = require("../models/Gym");

// Import User Model
const User = require("../models/User");

// ==========================
// Create Gym + Gym Admin
// ==========================

const createGym = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phoneNumber,
    address,
    adminFullName,
    adminEmail,
    adminPassword,
  } = req.body;

  // ==========================
  // Validate Gym
  // ==========================

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Gym name is required.",
    });
  }

  // ==========================
  // Validate Gym Admin
  // ==========================

  if (!adminFullName || !adminFullName.trim()) {
    return res.status(400).json({
      success: false,
      message: "Gym admin full name is required.",
    });
  }

  if (!adminEmail || !adminEmail.trim()) {
    return res.status(400).json({
      success: false,
      message: "Gym admin email is required.",
    });
  }

  if (!adminPassword) {
    return res.status(400).json({
      success: false,
      message: "Gym admin password is required.",
    });
  }

  if (adminPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message:
        "Gym admin password must be at least 6 characters.",
    });
  }

  const normalizedGymName = name.trim();

  const normalizedAdminEmail =
    adminEmail.trim().toLowerCase();

  // ==========================
  // Check Duplicate Gym
  // ==========================

  const existingGym = await Gym.findOne({
    name: normalizedGymName,
  });

  if (existingGym) {
    return res.status(409).json({
      success: false,
      message: "Gym already exists.",
    });
  }

  // ==========================
  // Check Admin Email
  // ==========================

  const existingUser = await User.findOne({
    email: normalizedAdminEmail,
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message:
        "Gym admin email already exists in the system.",
    });
  }

  // ==========================
  // Create Gym
  // ==========================

  const gym = await Gym.create({
    name: normalizedGymName,
    email: email?.trim().toLowerCase(),
    phoneNumber: phoneNumber?.trim(),
    address: address?.trim(),
  });

  try {
    // ==========================
    // Hash Admin Password
    // ==========================

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    // ==========================
    // Create Gym Admin
    // ==========================

    const gymAdmin = await User.create({
      fullName: adminFullName.trim(),
      email: normalizedAdminEmail,
      password: hashedPassword,
      role: "admin",
      gymId: gym._id,
      createdBy: req.user._id,
      isActive: true,
    });

    // ==========================
    // Success Response
    // ==========================

    return res.status(201).json({
      success: true,
      message:
        "Gym and Gym Admin created successfully.",

      data: {
        gym,
        admin: {
          id: gymAdmin._id,
          fullName: gymAdmin.fullName,
          email: gymAdmin.email,
          role: gymAdmin.role,
          gymId: gymAdmin.gymId,
          isActive: gymAdmin.isActive,
        },
      },
    });
  } catch (error) {
    // Rollback Gym if admin creation fails
    await Gym.findByIdAndDelete(gym._id);

    throw error;
  }
});

// ==========================
// Get All Gyms
// ==========================

const getAllGyms = asyncHandler(async (req, res) => {
  const gyms = await Gym.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: gyms.length,
    data: gyms,
  });
});

// ==========================
// Get Single Gym
// ==========================
// Returns:
// {
//   gym: {...},
//   admin: {...}
// }
// ==========================

const getSingleGym = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.params.id);

  if (!gym) {
    return res.status(404).json({
      success: false,
      message: "Gym not found.",
    });
  }

  // Find Gym Admin
  const gymAdmin = await User.findOne({
    gymId: gym._id,
    role: "admin",
  }).select(
    "_id fullName email role gymId isActive createdAt"
  );

  res.status(200).json({
    success: true,

    data: {
      gym,

      admin: gymAdmin
        ? {
            id: gymAdmin._id,
            fullName: gymAdmin.fullName,
            email: gymAdmin.email,
            role: gymAdmin.role,
            gymId: gymAdmin.gymId,
            isActive: gymAdmin.isActive,
            createdAt: gymAdmin.createdAt,
          }
        : null,
    },
  });
});

// ==========================
// Update Gym
// ==========================

const updateGym = asyncHandler(async (req, res) => {
  const gym = await Gym.findById(req.params.id);

  if (!gym) {
    return res.status(404).json({
      success: false,
      message: "Gym not found.",
    });
  }

  const updateData = {
    ...req.body,
  };

  // Prevent empty gym name
  if (
    updateData.name !== undefined &&
    !updateData.name.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Gym name cannot be empty.",
    });
  }

  // Normalize fields
  if (updateData.name) {
    updateData.name = updateData.name.trim();
  }

  if (updateData.email) {
    updateData.email =
      updateData.email.trim().toLowerCase();
  }

  if (updateData.phoneNumber) {
    updateData.phoneNumber =
      updateData.phoneNumber.trim();
  }

  if (updateData.address) {
    updateData.address =
      updateData.address.trim();
  }

  const updatedGym =
    await Gym.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

  res.status(200).json({
    success: true,
    message: "Gym updated successfully.",
    data: updatedGym,
  });
});

// ==========================
// Toggle Gym Status
// PATCH /api/gyms/:id/status
// ==========================

const toggleGymStatus = asyncHandler(
  async (req, res) => {
    const gym = await Gym.findById(
      req.params.id
    );

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found.",
      });
    }

    // Toggle current status
    gym.isActive = !gym.isActive;

    // Save to MongoDB
    await gym.save();

    // Return fresh saved document
    const updatedGym = await Gym.findById(
      gym._id
    );

    res.status(200).json({
      success: true,

      message: `Gym ${
        updatedGym.isActive
          ? "activated"
          : "deactivated"
      } successfully.`,

      data: updatedGym,
    });
  }
);

// ==========================
// Export Controllers
// ==========================

module.exports = {
  createGym,
  getAllGyms,
  getSingleGym,
  updateGym,
  toggleGymStatus,
};