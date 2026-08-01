// Import JWT
const jwt = require("jsonwebtoken");

// Import Async Handler
const asyncHandler = require("./asyncHandler");

// Import User Model
const User = require("../models/User");

// ==========================
// Protect Middleware
// ==========================
const protect = asyncHandler(async (req, res, next) => {

  let token;

  // Check Authorization Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {

    // Extract Token
    token = req.headers.authorization.split(" ")[1];

    try {

      // Verify JWT Token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Get User Details (Exclude Password)
      req.user = await User.findById(decoded.id).select("-password");

      // Continue to Next Middleware
      next();

    } catch (error) {

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });

    }

  }

  // No Token Found
  if (!token) {

    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });

  }

});

// Export Middleware
module.exports = protect;