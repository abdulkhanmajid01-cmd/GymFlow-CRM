// ==========================
// Authentication Controller
// ==========================

// Import Async Handler
const asyncHandler = require("../middleware/asyncHandler");

// Import bcrypt
const bcrypt = require("bcrypt");

// Import User Model
const User = require("../models/User");

// Import Helper
const checkEmailExists = require("../utils/checkEmailExists");

// Import Gym Model
const Gym = require("../models/Gym");

// Import JWT Generator
const generateToken = require("../utils/generateToken");


// ==========================
// Register New User
// ==========================
//
// Public registration is disabled.
//
// Users must be created through:
// Super Admin → Create Gym → Gym Admin
//
// Gym Admin → Create Staff
// ==========================

const registerUser = asyncHandler(
  async (req, res) => {
    return res.status(403).json({
      success: false,
      message:
        "Public registration is disabled. Users must be created by an authorized administrator.",
    });
  }
);


// ==========================
// Login User
// ==========================

const loginUser = asyncHandler(
  async (req, res) => {

    // Get email and password
    const {
      email,
      password,
    } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated.",
      });
    }

    // ==========================
    // Check Gym Active Status
    // ==========================
    // Non-superAdmin users must belong to
    // an active gym to log in.
    // ==========================

    let gym = null;

    if (
      user.role !== "superAdmin" &&
      user.gymId
    ) {
      gym = await Gym.findById(user.gymId);

      if (!gym || !gym.isActive) {
        return res.status(403).json({
          success: false,
          message:
            "Your gym is currently inactive. Please contact support.",
        });
      }
    }

    // Compare password
    const isPasswordMatched =
      await bcrypt.compare(
        password,
        user.password
      );

    // Wrong password
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = generateToken(
      user._id,
      user.role
    );

    // ==========================
    // Build Response Data
    // ==========================

    const responseData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      gymId: user.gymId,
    };

    // Include gym active status for
    // non-superAdmin users so the frontend
    // can enforce gym-active guards.

    if (
      user.role !== "superAdmin" &&
      user.gymId
    ) {
      responseData.gymIsActive =
        gym ? gym.isActive : false;
    }

    // Login successful
    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token,

      data: responseData,
    });
  }
);


// ==========================
// Get All Users
// ==========================
//
// Temporary admin endpoint.
// Later we will add proper
// gym-level isolation.
// ==========================

const getAllUsers = asyncHandler(
  async (req, res) => {

    const filter = {};

    // Non-superAdmin users see only their gym's users
    if (
      req.user.role !== "superAdmin" &&
      req.user.gymId
    ) {
      filter.gymId = req.user.gymId;
    }

    const users = await User.find(filter)
      .select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  }
);


// ==========================
// Export Controllers
// ==========================

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};