const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");
const authorize = require("../middleware/authorize");

const {
  createMembershipPlan,
  getAllMembershipPlans,
  getSingleMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} = require("../controllers/membershipPlanController");

// ==========================
// Get All Membership Plans
// ==========================
router.get(
  "/",
  protect,
  authorize("admin", "receptionist", "trainer"),
  getAllMembershipPlans
);

// ==========================
// Get Single Membership Plan
// ==========================
router.get(
  "/:id",
  protect,
  authorize("admin", "receptionist", "trainer"),
  getSingleMembershipPlan
);

// ==========================
// Create Membership Plan
// ==========================
router.post(
  "/",
  protect,
  authorize("admin"),
  createMembershipPlan
);

// ==========================
// Update Membership Plan
// ==========================
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateMembershipPlan
);

// ==========================
// Delete Membership Plan
// ==========================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteMembershipPlan
);

module.exports = router;