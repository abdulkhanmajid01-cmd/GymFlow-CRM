const express = require("express");

const {
  createPayment,
  getAllPayments,
  getMemberPayments,
  getMemberPaymentSummary,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentController");

const protect = require("../middleware/protect");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ========================================
// Payment Routes
// ========================================

// Get all payments
router.get(
  "/",
  protect,
  authorize("admin", "receptionist"),
  getAllPayments
);

// Get member payment history
router.get(
  "/member/:memberId",
  protect,
  authorize("admin", "receptionist"),
  getMemberPayments
);

// Get member payment summary
router.get(
  "/member/:memberId/summary",
  protect,
  authorize("admin", "receptionist"),
  getMemberPaymentSummary
);

// Create payment
router.post(
  "/",
  protect,
  authorize("admin", "receptionist"),
  createPayment
);

// Update payment
router.put(
  "/:paymentId",
  protect,
  authorize("admin", "receptionist"),
  updatePayment
);

// Delete payment
router.delete(
  "/:paymentId",
  protect,
  authorize("admin"),
  deletePayment
);

module.exports = router;