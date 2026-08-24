const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    // Gym / Tenant
    // Every attendance record belongs to one gym.
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
      index: true,
    },

    // Member
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
      index: true,
    },

    // Attendance Date
    date: {
      type: Date,
      required: true,
      index: true,
    },

    // Check-in Time
    checkInTime: {
      type: Date,
      default: Date.now,
    },

    // Attendance Status
    status: {
      type: String,
      enum: ["present", "absent"],
      default: "present",
    },

    // How attendance was marked
    method: {
      type: String,
      enum: ["manual", "qr"],
      default: "manual",
    },

    // Staff member who manually marked attendance
    // Not required for QR attendance.
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance for the same member
// on the same day within the same gym.
attendanceSchema.index(
  {
    gymId: 1,
    member: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);