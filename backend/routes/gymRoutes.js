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
  createGym,
  getAllGyms,
  getSingleGym,
  updateGym,
  toggleGymStatus,
} = require("../controllers/gymController");

// ==========================
// Get All Gyms
// GET /api/gyms
// ==========================

router.get(
  "/",
  protect,
  authorize("superAdmin"),
  getAllGyms
);

// ==========================
// Get Single Gym
// GET /api/gyms/:id
// ==========================

router.get(
  "/:id",
  protect,
  authorize("superAdmin"),
  getSingleGym
);

// ==========================
// Create Gym
// POST /api/gyms
// ==========================

router.post(
  "/",
  protect,
  authorize("superAdmin"),
  createGym
);

// ==========================
// Update Gym
// PUT /api/gyms/:id
// ==========================

router.put(
  "/:id",
  protect,
  authorize("superAdmin"),
  updateGym
);

// ==========================
// Toggle Gym Status
// PATCH /api/gyms/:id/status
// ==========================

router.patch(
  "/:id/status",
  protect,
  authorize("superAdmin"),
  toggleGymStatus
);

// ==========================
// Export Router
// ==========================

module.exports = router;