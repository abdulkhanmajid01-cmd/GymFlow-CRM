// Import Express
const express = require("express");

// Create Router
const router = express.Router();

// Import Authentication Middleware
const protect = require("../middleware/protect");

// Import Role Authorization Middleware
const authorize = require("../middleware/authorize");

// Import Reminder Controller
const {
  getMembershipExpiryAlerts,
} = require("../controllers/membershipReminderController");

// ==========================
// Get Membership Expiry Alerts
// GET /api/membership-reminders/expiry-alerts
// ==========================
// Allowed Roles:
// admin
// receptionist
// ==========================

router.get(
  "/expiry-alerts",
  protect,
  authorize("admin", "receptionist"),
  getMembershipExpiryAlerts
);

// Export Router
module.exports = router;