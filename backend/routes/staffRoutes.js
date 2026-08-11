// Import Express
const express = require("express");

// Create Router
const router = express.Router();

// Import Authentication Middleware
const protect = require("../middleware/protect");

// Import Role-Based Authorization Middleware
const authorize = require("../middleware/authorize");

// Import Staff Controllers
const {
  createStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");

// ==========================
// Staff Management
// ==========================
//
// All staff management routes:
// Admin Only
//
// protect → verifies JWT
// authorize("admin") → verifies Admin role
// ==========================

// Get All Staff
// GET /api/staff
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllStaff
);

// Create Staff
// POST /api/staff
router.post(
  "/",
  protect,
  authorize("admin"),
  createStaff
);

// Update Staff
// PUT /api/staff/:id
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateStaff
);

// Delete Staff
// DELETE /api/staff/:id
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteStaff
);

// Export Router
module.exports = router;