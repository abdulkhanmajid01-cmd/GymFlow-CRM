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
// Public Route
//
// NOTE:
// During development this route is public.
// In SaaS Phase this route will be protected
// so only Admin/Super Admin can create users.
// ==========================
router.post("/register", registerUser);


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