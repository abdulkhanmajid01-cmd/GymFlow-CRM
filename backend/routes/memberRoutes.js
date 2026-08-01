// Import Express
const express = require("express");

// Create Router
const router = express.Router();

// Import Authentication Middleware
const protect = require("../middleware/protect");

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
// ==========================
router.get("/", protect, getAllMembers);


// ==========================
// Get Single Member
// Protected Route
// GET /api/members/:id
// ==========================
router.get("/:id", protect, getSingleMember);


// ==========================
// Create Member
// Protected Route
// POST /api/members
// ==========================
router.post("/", protect, createMember);


// ==========================
// Update Member
// Protected Route
// PUT /api/members/:id
// ==========================
router.put("/:id", protect, updateMember);


// ==========================
// Delete Member
// Protected Route
// DELETE /api/members/:id
// ==========================
router.delete("/:id", protect, deleteMember);


// Export Router
module.exports = router;