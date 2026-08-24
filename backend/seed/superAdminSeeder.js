const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    // Check if Super Admin already exists
    const existingSuperAdmin = await User.findOne({
      role: "superAdmin",
    });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists.");
      process.exit(0);
    }

    // Create Super Admin password
    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      10
    );

    // Create Super Admin
    const superAdmin = await User.create({
      fullName: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      role: "superAdmin",
      gymId: null,
      createdBy: null,
      isActive: true,
    });

    console.log(
      `Super Admin created: ${superAdmin.email}`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Super Admin seeding failed:",
      error.message
    );

    process.exit(1);
  }
};

seedSuperAdmin();