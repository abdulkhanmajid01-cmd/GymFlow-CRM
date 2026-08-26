// Import JWT
const jwt = require("jsonwebtoken");

// Import Async Handler
const asyncHandler = require("./asyncHandler");

// Import User Model
const User = require("../models/User");

// Import Gym Model
const Gym = require("../models/Gym");

// ==========================
// Protect Middleware
// ==========================
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // ==========================
  // Check Authorization Header
  // ==========================

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract Token
    token = req.headers.authorization.split(" ")[1];

    try {
      // ==========================
      // Verify JWT Token
      // ==========================

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // ==========================
      // Get User Details
      // Exclude Password
      // ==========================

      const user = await User.findById(
        decoded.id
      ).select("-password");

      // ==========================
      // User Not Found
      // ==========================

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User account not found",
        });
      }

      // ==========================
      // Check Active Status
      // ==========================

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "User account is inactive",
        });
      }

      // ==========================
      // Check Gym Active Status
      // ==========================
      // Non-superAdmin users must belong to
      // an active gym to access any endpoint.
      // ==========================

      if (
        user.role !== "superAdmin" &&
        user.gymId
      ) {
        const gym = await Gym.findById(user.gymId);

        if (!gym || !gym.isActive) {
          return res.status(401).json({
            success: false,
            message:
              "Your gym is currently inactive. Please contact support.",
          });
        }
      }

      // ==========================
      // Attach User To Request
      // ==========================

      req.user = user;

      // Now controllers can access:
      // req.user._id
      // req.user.role
      // req.user.gymId

      // ==========================
      // Continue
      // ==========================

      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  }

  // ==========================
  // No Token Found
  // ==========================

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }
});

// ==========================
// Export Middleware
// ==========================

module.exports = protect;