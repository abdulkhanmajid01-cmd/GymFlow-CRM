// Import Async Handler
const asyncHandler = require("../middleware/asyncHandler");

// Import bcrypt for password hashing
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
const registerUser = asyncHandler(async (req, res) => {

  // Get data from request body
  const { fullName, email, password, role } = req.body;

  // Check if email already exists in the entire system
  const emailExists = await checkEmailExists({
    email,
  });

  // Stop registration if email already exists
  if (emailExists) {
    res.status(409);
    throw new Error("Email already exists in the system");
  }

  // Hash password before saving into database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
  });

  // Registration Success Response
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    },
  });

});

// ==========================
// Login User
// ==========================
const loginUser = asyncHandler(async (req, res) => {

  // Get email & password from request body
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // If user not found
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Compare entered password with hashed password
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );

  // Wrong password
  if (!isPasswordMatched) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Generate JWT Token
  const token = generateToken(user._id, user.role);

  // Success Response
  res.status(200).json({
    success: true,
    message: "Login successful",

    token,

    data: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });

});

// ==========================
// Get All Users
// ==========================
const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users except password
  const users = await User.find().select("-password");

  // Success Response
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};
