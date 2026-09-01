const Payment = require("../models/Payment");
const Member = require("../models/Member");
const MembershipPlan = require("../models/MembershipPlan");
const asyncHandler = require("../middleware/asyncHandler");

// ========================================
// Create Payment
// ========================================

const createPayment = asyncHandler(async (req, res) => {
  const gymId = req.user.gymId;

  const {
    memberId,
    membershipId,
    amount,
    paymentDate,
    paymentMethod,
    transactionId,
    notes,
  } = req.body;

  // Validate required fields
  if (
    !memberId ||
    !membershipId ||
    amount === undefined ||
    !paymentMethod
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Member, membership plan, amount and payment method are required.",
    });
  }

  // Validate amount
  if (!(Number.isFinite(Number(amount)) && Number(amount) > 0)) {
    return res.status(400).json({
      success: false,
      message: "Payment amount must be a valid number greater than 0.",
    });
  }

  // Validate member belongs to this gym
  const member = await Member.findOne({
    _id: memberId,
    gymId,
  });

  if (!member) {
    return res.status(404).json({
      success: false,
      message: "Member not found in this gym.",
    });
  }

  // Validate membership plan belongs to this gym
  const membershipPlan = await MembershipPlan.findOne({
    _id: membershipId,
    gymId,
  });

  if (!membershipPlan) {
    return res.status(404).json({
      success: false,
      message: "Membership plan not found in this gym.",
    });
  }

  // Validate the selected plan matches the member's assigned plan
  if (String(member.membershipPlan) !== String(membershipId)) {
    return res.status(400).json({
      success: false,
      message:
        "Selected plan does not match member's current assigned plan.",
    });
  }

  // Transaction ID required for non-cash payments
  if (
    paymentMethod !== "Cash" &&
    (!transactionId || !transactionId.trim())
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Transaction ID is required for non-cash payments.",
    });
  }

  const totalAmount = Number(amount);
  const collectionDate = paymentDate || Date.now();

  const payment = await Payment.create({
    gymId,
    memberId,
    membershipId,
    amount: totalAmount,
    status: "Pending",
    paymentDate: collectionDate,
    paymentMethod,
    transactionId:
      paymentMethod === "Cash"
        ? null
        : transactionId.trim(),
    notes: notes?.trim() || "",
    recordedBy: req.user._id,
    collections: [
      {
        receivedBy: req.user._id,
        amount: totalAmount,
        date: collectionDate,
      },
    ],
  });

  payment.status = payment.computeStatus(
    membershipPlan.price
  );

  await payment.save();

  const populatedPayment = await Payment.findById(
    payment._id
  )
    .populate("memberId", "fullName email phoneNumber")
    .populate(
      "membershipId",
      "planName price durationInMonths"
    )
    .populate("recordedBy", "fullName email role")
    .populate("collections.receivedBy", "fullName role");

  return res.status(201).json({
    success: true,
    message: "Payment recorded successfully.",
    data: populatedPayment,
  });
});

// ========================================
// Get All Payments
// ========================================

const getAllPayments = asyncHandler(async (req, res) => {
  const gymId = req.user.gymId;

  const payments = await Payment.find({ gymId })
    .populate("memberId", "fullName email phoneNumber")
    .populate(
      "membershipId",
      "planName price durationInMonths"
    )
    .populate("recordedBy", "fullName email role")
    .populate("collections.receivedBy", "fullName role")
    .sort({
      paymentDate: -1,
      createdAt: -1,
    });

  return res.status(200).json({
    success: true,
    message: "Payments retrieved successfully.",
    data: payments,
  });
});

// ========================================
// Get Member Payment History
// ========================================

const getMemberPayments = asyncHandler(async (req, res) => {
  const gymId = req.user.gymId;
  const { memberId } = req.params;

  // Verify member belongs to this gym
  const member = await Member.findOne({
    _id: memberId,
    gymId,
  });

  if (!member) {
    return res.status(404).json({
      success: false,
      message: "Member not found in this gym.",
    });
  }

  const payments = await Payment.find({
    gymId,
    memberId,
  })
    .populate(
      "membershipId",
      "planName price durationInMonths"
    )
    .populate("recordedBy", "fullName email role")
    .populate("collections.receivedBy", "fullName role")
    .sort({
      paymentDate: -1,
      createdAt: -1,
    });

  return res.status(200).json({
    success: true,
    message: "Member payment history retrieved successfully.",
    data: payments,
  });
});

// ========================================
// Get Member Payment Summary
// ========================================

const getMemberPaymentSummary = asyncHandler(async (req, res) => {
  const gymId = req.user.gymId;
  const { memberId } = req.params;

  // Verify member belongs to this gym
  const member = await Member.findOne({
    _id: memberId,
    gymId,
  });

  if (!member) {
    return res.status(404).json({
      success: false,
      message: "Member not found in this gym.",
    });
  }

  // Get member's current membership plan
  const membershipPlan = await MembershipPlan.findOne({
    _id: member.membershipPlan,
    gymId,
  });

  if (!membershipPlan) {
    return res.status(404).json({
      success: false,
      message: "Membership plan not found for this member.",
    });
  }

  // Calculate total amount paid for current membership
  const paymentResult = await Payment.aggregate([
    {
      $match: {
        gymId: member.gymId,
        memberId: member._id,
        membershipId: membershipPlan._id,
      },
    },
    {
      $group: {
        _id: null,
        totalPaid: {
          $sum: "$amount",
        },
      },
    },
  ]);

  const totalPaid = paymentResult[0]?.totalPaid || 0;
  const requiredAmount = membershipPlan.price;

  let status = "Pending";

  if (totalPaid >= requiredAmount) {
    status = "Paid";
  } else if (totalPaid > 0) {
    status = "Partial";
  }

  const remainingAmount = Math.max(
    requiredAmount - totalPaid,
    0
  );

  return res.status(200).json({
    success: true,
    message: "Payment summary retrieved successfully.",
    data: {
      memberId: member._id,
      membershipId: membershipPlan._id,
      membershipPlan: membershipPlan.planName,
      requiredAmount,
      totalPaid,
      remainingAmount,
      status,
    },
  });
});

// ========================================
// Update Payment (record an installment)
// ========================================

const updatePayment = asyncHandler(async (req, res) => {
  const gymId = req.user.gymId;
  const { paymentId } = req.params;

  const { amount } = req.body;

  // Recording an installment requires a positive amount to add
  if (
    amount === undefined ||
    !(Number.isFinite(Number(amount)) && Number(amount) > 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "An installment amount greater than 0 is required.",
    });
  }

  // Find payment within current gym
  const payment = await Payment.findOne({
    _id: paymentId,
    gymId,
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found in this gym.",
    });
  }

  // Get the membership plan to recompute the status
  const membershipPlan = await MembershipPlan.findOne({
    _id: payment.membershipId,
    gymId,
  });

  if (!membershipPlan) {
    return res.status(404).json({
      success: false,
      message: "Membership plan not found for this payment.",
    });
  }

  const newCollectionAmount = Number(amount);

  // Reject installments on an already fully-paid payment
  const currentTotal = payment.collections.reduce(
    (sum, collection) => sum + Number(collection.amount),
    0
  );

  if (currentTotal >= membershipPlan.price) {
    return res.status(400).json({
      success: false,
      message: "This payment is already fully paid.",
    });
  }

  // Reject installments that exceed the remaining balance
  const remainingAmount = membershipPlan.price - currentTotal;

  if (newCollectionAmount > remainingAmount) {
    return res.status(400).json({
      success: false,
      message: `Installment amount exceeds remaining balance of PKR ${remainingAmount}`,
    });
  }

  // Append the new installment to the collections array
  payment.collections.push({
    receivedBy: req.user._id,
    amount: newCollectionAmount,
    date: Date.now(),
  });

  // Update total amount collected so far
  payment.amount = payment.collections.reduce(
    (total, collection) => total + Number(collection.amount),
    0
  );

  // Automatically update status based on the plan price
  payment.status = payment.computeStatus(membershipPlan.price);

  await payment.save();

  const populatedPayment = await Payment.findById(
    payment._id
  )
    .populate("memberId", "fullName email phoneNumber")
    .populate(
      "membershipId",
      "planName price durationInMonths"
    )
    .populate("recordedBy", "fullName email role")
    .populate("collections.receivedBy", "fullName role");

  return res.status(200).json({
    success: true,
    message: "Installment recorded successfully.",
    data: populatedPayment,
  });
});

// ========================================
// Delete Payment
// ========================================

const deletePayment = asyncHandler(async (req, res) => {
  const gymId = req.user.gymId;
  const { paymentId } = req.params;

  // Find payment within current gym
  const payment = await Payment.findOne({
    _id: paymentId,
    gymId,
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found in this gym.",
    });
  }

  await Payment.deleteOne({
    _id: paymentId,
    gymId,
  });

  return res.status(200).json({
    success: true,
    message: "Payment deleted successfully.",
  });
});

// ========================================
// Exports
// ========================================

module.exports = {
  createPayment,
  getAllPayments,
  getMemberPayments,
  getMemberPaymentSummary,
  updatePayment,
  deletePayment,
};
