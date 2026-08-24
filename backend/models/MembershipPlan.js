const mongoose = require("mongoose");

const membershipPlanSchema = new mongoose.Schema(
  {
    // ==========================
    // Gym Ownership
    // ==========================
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
      index: true,
    },

    // ==========================
    // Plan Name
    // ==========================
    planName: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
    },

    // ==========================
    // Duration In Months
    // ==========================
    durationInMonths: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 month"],
    },

    // ==========================
    // Plan Price
    // ==========================
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // ==========================
    // Plan Description
    // ==========================
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================
    // Plan Features
    // ==========================
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================
    // Plan Status
    // ==========================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// Same Plan Name Allowed
// Across Different Gyms
// But Not Inside Same Gym
// ==========================

membershipPlanSchema.index(
  { gymId: 1, planName: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "MembershipPlan",
  membershipPlanSchema
);