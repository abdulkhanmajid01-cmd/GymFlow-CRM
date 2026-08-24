// ==========================
// Authentication Controller
// ==========================

// Import Async Handler
const asyncHandler = require("../middleware/asyncHandler");

// Import bcrypt
const bcrypt = require("bcryptjs");

// Import User Model
const User = require("../models/User");

// Import Helper
const checkEmailExists = require("../utils/checkEmailExists");

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

    // Login successful
    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token,

      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        gymId: user.gymId,
      },
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

    const users = await User.find()
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