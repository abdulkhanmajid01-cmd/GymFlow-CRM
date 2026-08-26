// Import Async Handler
const asyncHandler = require("../middleware/asyncHandler");

// Import Models
const Gym = require("../models/Gym");
const User = require("../models/User");
const Member = require("../models/Member");

// ==========================
// Get Platform Statistics
// GET /api/platform/stats
// Super Admin Only
// ==========================

const getPlatformStats = asyncHandler(
  async (req, res) => {
    // ==========================
    // Run All Count Queries In Parallel
    //
    // Same queries, same filters,
    // executed concurrently.
    // ==========================

    const [
      totalGyms,
      activeGyms,
      inactiveGyms,
      totalGymAdmins,
      activeGymAdmins,
      inactiveGymAdmins,
      totalMembers,
      totalTrainers,
      totalReceptionists,
    ] = await Promise.all([
      Gym.countDocuments(),
      Gym.countDocuments({
        isActive: true,
      }),
      Gym.countDocuments({
        isActive: false,
      }),
      User.countDocuments({
        role: "admin",
      }),
      User.countDocuments({
        role: "admin",
        isActive: true,
      }),
      User.countDocuments({
        role: "admin",
        isActive: false,
      }),
      Member.countDocuments(),
      User.countDocuments({
        role: "trainer",
      }),
      User.countDocuments({
        role: "receptionist",
      }),
    ]);

    const totalStaff =
      totalTrainers +
      totalReceptionists;

    // ==========================
    // Response
    // ==========================

    res.status(200).json({
      success: true,

      data: {
        gyms: {
          total: totalGyms,
          active: activeGyms,
          inactive: inactiveGyms,
        },

        gymAdmins: {
          total: totalGymAdmins,
          active: activeGymAdmins,
          inactive: inactiveGymAdmins,
        },

        members: {
          total: totalMembers,
        },

        staff: {
          total: totalStaff,
          trainers: totalTrainers,
          receptionists: totalReceptionists,
        },
      },
    });
  }
);

// ==========================
// Export Controller
// ==========================

module.exports = {
  getPlatformStats,
};