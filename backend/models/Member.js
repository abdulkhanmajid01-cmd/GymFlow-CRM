// Import Mongoose
const mongoose = require("mongoose");

// ==========================
// Member Schema
// ==========================
const memberSchema = new mongoose.Schema({
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
    unique: true,
    trim: true,
  },

  // Phone Number
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
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
    unique: true,
    trim: true,
  },

  // Gym Member ID
  memberId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  // ==========================
  // Membership Plan Relation
  // Stores ObjectId of MembershipPlan
  // ==========================
  membershipPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MembershipPlan",
    required: true,
  },

  // Created Date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export Model
module.exports = mongoose.model("Member", memberSchema);