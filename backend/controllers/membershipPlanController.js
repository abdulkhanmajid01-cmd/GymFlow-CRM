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

  // ==========================
  // Get Gym From Logged-in User
  // ==========================

  const gymId = req.user.gymId;

  if (!gymId) {
    return res.status(400).json({
      success: false,
      message: "User is not assigned to a gym.",
    });
  }

  // ==========================
  // Validate Plan Name
  // ==========================

  if (!planName || !planName.trim()) {
    return res.status(400).json({
      success: false,
      message: "Plan name is required.",
    });
  }

  // ==========================
  // Check Duplicate Plan
  // Inside Same Gym Only
  // ==========================

  const existingPlan = await MembershipPlan.findOne({
    gymId,
    planName: planName.trim(),
  });

  if (existingPlan) {
    return res.status(409).json({
      success: false,
      message: "Membership plan already exists in this gym.",
    });
  }

  // ==========================
  // Create Plan
  // ==========================

  const plan = await MembershipPlan.create({
    gymId,
    planName: planName.trim(),
    durationInMonths,
    price,
    description,
    features,
  });

  // ==========================
  // Success Response
  // ==========================

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
  const gymId = req.user.gymId;

  if (!gymId) {
    return res.status(400).json({
      success: false,
      message: "User is not assigned to a gym.",
    });
  }

  const plans = await MembershipPlan.find({
    gymId,
  }).sort({
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
const getSingleMembershipPlan = asyncHandler(
  async (req, res) => {
    const gymId = req.user.gymId;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to a gym.",
      });
    }

    const plan = await MembershipPlan.findOne({
      _id: req.params.id,
      gymId,
    });

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
  }
);

// ==========================
// Update Membership Plan
// ==========================
const updateMembershipPlan = asyncHandler(
  async (req, res) => {
    const gymId = req.user.gymId;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to a gym.",
      });
    }

    // ==========================
    // Find Plan Inside Same Gym
    // ==========================

    const plan = await MembershipPlan.findOne({
      _id: req.params.id,
      gymId,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found.",
      });
    }

    // ==========================
    // Check Duplicate Name
    // ==========================

    if (
      req.body.planName &&
      req.body.planName.trim() !== plan.planName
    ) {
      const existingPlan = await MembershipPlan.findOne({
        gymId,
        planName: req.body.planName.trim(),
        _id: {
          $ne: req.params.id,
        },
      });

      if (existingPlan) {
        return res.status(409).json({
          success: false,
          message:
            "Membership plan with this name already exists in this gym.",
        });
      }
    }

    // ==========================
    // Prepare Update Data
    // ==========================

    const updateData = {
      ...req.body,
    };

    // Never allow gymId to be changed
    delete updateData.gymId;

    if (updateData.planName) {
      updateData.planName =
        updateData.planName.trim();
    }

    // ==========================
    // Update Plan
    // ==========================

    const updatedPlan =
      await MembershipPlan.findOneAndUpdate(
        {
          _id: req.params.id,
          gymId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Membership plan updated successfully.",
      data: updatedPlan,
    });
  }
);

// ==========================
// Delete Membership Plan
// ==========================
const deleteMembershipPlan = asyncHandler(
  async (req, res) => {
    const gymId = req.user.gymId;

    if (!gymId) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to a gym.",
      });
    }

    // ==========================
    // Find Plan Inside Same Gym
    // ==========================

    const plan = await MembershipPlan.findOne({
      _id: req.params.id,
      gymId,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found.",
      });
    }

    // ==========================
    // Delete Plan
    // ==========================

    await plan.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Membership plan deleted successfully.",
    });
  }
);

// ==========================
// Export Controllers
// ==========================

module.exports = {
  createMembershipPlan,
  getAllMembershipPlans,
  getSingleMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
};