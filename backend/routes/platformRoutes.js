const express = require("express");

// Middleware
const protect = require("../middleware/protect");
const authorize = require("../middleware/authorize");

// Controller
const {
  getPlatformStats,
} = require("../controllers/platformController");

const router = express.Router();

// ==========================================
// Platform Administration
// Super Admin Only
// ==========================================

router.get(
  "/stats",
  protect,
  authorize("superAdmin"),
  getPlatformStats
);

module.exports = router;