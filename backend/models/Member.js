const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
},
 phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  dateOfBirth: {
    type: Date,
    required: true,
  },

  cnic: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  memberId: {
    type: String,
    required: true,
    unique: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;