const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    // ==========================
    // Gym Ownership
    // ==========================
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },

    // ==========================
    // Member
    // ==========================
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    // ==========================
    // Attendance Date
    // ==========================
    date: {
      type: Date,
      required: true,
    },

    // ==========================
    // Attendance Status
    // ==========================
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },

    // ==========================
    // Check In
    // ==========================
    checkIn: {
      type: Date,
      default: null,
    },

    // ==========================
    // Check Out
    // ==========================
    checkOut: {
      type: Date,
      default: null,
    },

    // ==========================
    // Marked By
    // Admin / Receptionist / Trainer
    // ==========================
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// Gym-Scoped Daily Attendance
//
// Same member cannot have
// multiple attendance records
// for the same date inside
// the same gym.
//
// Different gyms can have
// the same member/date combination.
// ==========================

attendanceSchema.index(
  {
    gymId: 1,
    memberId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

// ==========================
// Daily Gym Attendance Query
//
// Supports the daily list query used by
// the attendance page:
//   Attendance.find({ gymId, date: {$gte,$lt} })
// The unique compound index above cannot
// serve the date range efficiently because
// memberId sits between gymId and date.
// ==========================

attendanceSchema.index({
  gymId: 1,
  date: 1,
});

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);