const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  // Gym Ownership
  gymId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gym",
    required: true,
    index: true,
  },

  // Full Name
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  // Email
  email: {
    type: String,
    required: true,
    trim: true,
  },

  // Phone Number
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },

  // Date Of Birth
  dateOfBirth: {
    type: Date,
    required: true,
  },

  // CNIC
  cnic: {
    type: String,
    required: true,
    trim: true,
  },

  // Gym Member ID
  memberId: {
    type: String,
    required: true,
    trim: true,
  },

  // Membership Plan
  membershipPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MembershipPlan",
    required: true,
  },

  // Assigned Trainer
  assignedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // Joining Date
  joiningDate: {
    type: Date,
    default: Date.now,
  },

  // Membership Expiry Date
  membershipExpiryDate: {
    type: Date,
  },

  // Created Date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ==========================
// Gym-Scoped Uniqueness
// Same value allowed across
// different gyms, but NOT
// inside the same gym.
// ==========================

memberSchema.index(
  { gymId: 1, memberId: 1 },
  { unique: true }
);

memberSchema.index(
  { gymId: 1, cnic: 1 },
  { unique: true }
);

memberSchema.index(
  { gymId: 1, email: 1 },
  { unique: true }
);

memberSchema.index(
  { gymId: 1, phoneNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Member", memberSchema);