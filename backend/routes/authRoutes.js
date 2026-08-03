// Import Express
const express = require("express");

// Create Router
const router = express.Router();

// Import Controllers
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/authController");

// Import Authentication Middleware
const protect = require("../middleware/protect");

// Import Role-Based Authorization Middleware
const authorize = require("../middleware/authorize");

// ==========================
// Register New User
// POST /api/auth/register
//
// Allowed Roles:
// admin
// ==========================
router.post(
  "/register",
  protect,
  authorize("admin"),
  registerUser
);

// ==========================
// Login User
// POST /api/auth/login
//
// Public Route
// ==========================
router.post("/login", loginUser);

// ==========================
// Get All Users
// GET /api/auth/users
//
// Allowed Roles:
// admin
// ==========================
router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

// Export Router
module.exports = router;