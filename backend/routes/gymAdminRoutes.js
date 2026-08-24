// Import Express
const express = require("express");

// Create Router
const router = express.Router();

// Import Authentication Middleware
const protect = require("../middleware/protect");

// Import Authorization Middleware
const authorize = require("../middleware/authorize");

// Import Controllers
const {
  getAllGymAdmins,
  getSingleGymAdmin,
  toggleGymAdminStatus,
} = require("../controllers/gymAdminController");

// ==========================
// Get All Gym Administrators
// GET /api/gym-admins
// ==========================

router.get(
  "/",
  protect,
  authorize("superAdmin"),
  getAllGymAdmins
);

// ==========================
// Get Single Gym Administrator
// GET /api/gym-admins/:id
// ==========================

router.get(
  "/:id",
  protect,
  authorize("superAdmin"),
  getSingleGymAdmin
);

// ==========================
// Toggle Gym Administrator Status
// PATCH /api/gym-admins/:id/status
// ==========================

router.patch(
  "/:id/status",
  protect,
  authorize("superAdmin"),
  toggleGymAdminStatus
);

// ==========================
// Export Router
// ==========================

module.exports = router;