// Import Mongoose
const mongoose = require("mongoose");

// ==========================
// Membership Plan Schema
// ==========================
const membershipPlanSchema = new mongoose.Schema(
  {
    // Plan Name
    planName: {
      type: String,
      required: [true, "Plan name is required"],
      trim: true,
      unique: true,
    },

    // Duration In Months
    durationInMonths: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 month"],
    },

    // Plan Price
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // Plan Description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Plan Features
    features: [
      {
        type: String,
        trim: true,
      },
    ],

    // Plan Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },

  // Automatically Create
  // createdAt & updatedAt
  {
    timestamps: true,
  }
);

// Export Model
module.exports = mongoose.model(
  "MembershipPlan",
  membershipPlanSchema
);