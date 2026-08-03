// Import Express
const express = require("express");

// Create Router
const router = express.Router();

// Import Authentication Middleware
const protect = require("../middleware/protect");

// Import Role-Based Authorization Middleware
const authorize = require("../middleware/authorize");

// Import Member Controllers
const {
  createMember,
  getAllMembers,
  getSingleMember,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");

// ==========================
// Get All Members
// Protected Route
// GET /api/members
//
// Allowed Roles:
// admin
// receptionist
// trainer
// ==========================
router.get(
  "/",
  protect,
  authorize("admin", "receptionist", "trainer"),
  getAllMembers
);

// ==========================
// Get Single Member
// Protected Route
// GET /api/members/:id
//
// Allowed Roles:
// admin
// receptionist
// trainer
// ==========================
router.get(
  "/:id",
  protect,
  authorize("admin", "receptionist", "trainer"),
  getSingleMember
);

// ==========================
// Create Member
// Protected Route
// POST /api/members
//
// Allowed Roles:
// admin
// receptionist
// ==========================
router.post(
  "/",
  protect,
  authorize("admin", "receptionist"),
  createMember
);

// ==========================
// Update Member
// Protected Route
// PUT /api/members/:id
//
// Allowed Roles:
// admin
// receptionist
// ==========================
router.put(
  "/:id",
  protect,
  authorize("admin", "receptionist"),
  updateMember
);

// ==========================
// Delete Member
// Protected Route
// DELETE /api/members/:id
//
// Allowed Roles:
// admin
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteMember
);

// Export Router
module.exports = router;