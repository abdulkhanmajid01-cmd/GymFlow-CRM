// Import Express
const express = require("express");

// Create Router
const router = express.Router();

// Import Middlewares
const protect = require("../middleware/protect");
const authorize = require("../middleware/authorize");

// Import Controllers
const {
  createMembershipPlan,
  getAllMembershipPlans,
  getSingleMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} = require("../controllers/membershipPlanController");


// ==========================
// Get All Membership Plans
// GET /api/membership-plans
//
// Allowed Roles:
// Admin
// Receptionist
// Trainer
// ==========================
router.get(
  "/",
  protect,
  authorize("admin", "receptionist", "trainer"),
  getAllMembershipPlans
);


// ==========================
// Get Single Membership Plan
// GET /api/membership-plans/:id
//
// Allowed Roles:
// Admin
// Receptionist
// Trainer
// ==========================
router.get(
  "/:id",
  protect,
  authorize("admin", "receptionist", "trainer"),
  getSingleMembershipPlan
);


// ==========================
// Create Membership Plan
// POST /api/membership-plans
//
// Allowed Roles:
// Admin
// ==========================
router.post(
  "/",
  protect,
  authorize("admin"),
  createMembershipPlan
);


// ==========================
// Update Membership Plan
// PUT /api/membership-plans/:id
//
// Allowed Roles:
// Admin
// ==========================
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateMembershipPlan
);


// ==========================
// Delete Membership Plan
// DELETE /api/membership-plans/:id
//
// Allowed Roles:
// Admin
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteMembershipPlan
);


// Export Router
module.exports = router;