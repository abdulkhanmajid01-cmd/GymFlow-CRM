// Import Async Handler
const asyncHandler = require("../middleware/asyncHandler");

// Import Membership Plan Model
const MembershipPlan = require("../models/MembershipPlan");


// ==========================
// Create Membership Plan
// ==========================
const createMembershipPlan = asyncHandler(async (req, res) => {

  const {
    planName,
    durationInMonths,
    price,
    description,
    features,
  } = req.body;

  // Check duplicate plan name
  const existingPlan = await MembershipPlan.findOne({
    planName: planName.trim(),
  });

  if (existingPlan) {
    return res.status(409).json({
      success: false,
      message: "Membership plan already exists.",
    });
  }

  // Create plan
  const plan = await MembershipPlan.create({
    planName: planName.trim(),
    durationInMonths,
    price,
    description,
    features,
  });

  res.status(201).json({
    success: true,
    message: "Membership plan created successfully.",
    data: plan,
  });

});


// ==========================
// Get All Membership Plans
// ==========================
const getAllMembershipPlans = asyncHandler(async (req, res) => {

  const plans = await MembershipPlan.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: plans.length,
    data: plans,
  });

});


// ==========================
// Get Single Membership Plan
// ==========================
const getSingleMembershipPlan = asyncHandler(async (req, res) => {

  const plan = await MembershipPlan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: "Membership plan not found.",
    });
  }

  res.status(200).json({
    success: true,
    data: plan,
  });

});


// ==========================
// Update Membership Plan
// ==========================
const updateMembershipPlan = asyncHandler(async (req, res) => {

  const plan = await MembershipPlan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: "Membership plan not found.",
    });
  }

  const updatedPlan = await MembershipPlan.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Membership plan updated successfully.",
    data: updatedPlan,
  });

});


// ==========================
// Delete Membership Plan
// ==========================
const deleteMembershipPlan = asyncHandler(async (req, res) => {

  const plan = await MembershipPlan.findById(req.params.id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: "Membership plan not found.",
    });
  }

  await plan.deleteOne();

  res.status(200).json({
    success: true,
    message: "Membership plan deleted successfully.",
  });

});


module.exports = {
  createMembershipPlan,
  getAllMembershipPlans,
  getSingleMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
};