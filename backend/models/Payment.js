const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Received by user is required"],
    },

    amount: {
      type: Number,
      required: [true, "Collection amount is required"],
      min: [0.01, "Collection amount must be greater than 0"],
    },

    date: {
      type: Date,
      required: [true, "Collection date is required"],
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const paymentSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: [true, "Gym is required"],
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Member is required"],
      index: true,
    },

    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: [true, "Membership plan is required"],
      index: true,
    },

    // Total amount collected so far (sum of collections)
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0.01, "Payment amount must be greater than 0"],
    },

    status: {
      type: String,
      enum: {
        values: ["Pending", "Partial", "Paid"],
        message: "Invalid payment status",
      },
      default: "Pending",
    },

    paymentDate: {
      type: Date,
      required: [true, "Payment date is required"],
      default: Date.now,
    },

    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["Cash", "Bank Transfer", "JazzCash", "Easypaisa"],
        message: "Invalid payment method",
      },
    },

    transactionId: {
      type: String,
      trim: true,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recorded by user is required"],
    },

    // Individual collection entries (multi-staff partial payments)
    collections: {
      type: [collectionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// General gym payment queries
paymentSchema.index({
  gymId: 1,
});

// Member payment history
paymentSchema.index({
  gymId: 1,
  memberId: 1,
});

// Membership payment lookup
paymentSchema.index({
  gymId: 1,
  membershipId: 1,
});

// Prevent duplicate transaction IDs within the same gym
paymentSchema.index(
  {
    gymId: 1,
    transactionId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      transactionId: {
        $type: "string",
        $ne: "",
      },
    },
  }
);

// Helper to derive status from total vs plan price (set by controllers)
paymentSchema.methods.computeStatus = function computeStatus(
  requiredAmount
) {
  if (this.amount <= 0) {
    return "Pending";
  }

  if (this.amount >= requiredAmount) {
    return "Paid";
  }

  return "Partial";
};

module.exports = mongoose.model("Payment", paymentSchema);
