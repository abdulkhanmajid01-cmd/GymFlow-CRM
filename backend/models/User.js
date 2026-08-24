const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================
    // Full Name
    // ==========================
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    // ==========================
    // Email
    // ==========================
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ==========================
    // Password
    // ==========================
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // ==========================
    // Role
    // ==========================
    role: {
      type: String,
      enum: [
        "superAdmin",
        "admin",
        "receptionist",
        "trainer",
      ],
      default: "receptionist",
    },

    // ==========================
    // Gym Ownership
    // ==========================
    // Super Admin:
    // gymId = null
    //
    // Gym Admin / Receptionist / Trainer:
    // gymId = their gym's _id
    // ==========================
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      default: null,
      index: true,
    },

    // ==========================
    // Admin Who Created This User
    // ==========================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==========================
    // Account Status
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

module.exports = mongoose.model("User", userSchema);