// ===============================
// Role-Based Authorization Middleware
// ===============================
//
// This middleware checks whether the logged-in user
// has permission to access the requested route.
//
// Examples:
// authorize("admin")
// authorize("admin", "receptionist")
// authorize("admin", "receptionist", "trainer")
//
// protect middleware must run BEFORE authorize middleware.
//

const authorize = (...roles) => {
  return (req, res, next) => {

    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Normalize logged-in user's role
    const userRole = req.user.role.toLowerCase();

    // Normalize allowed roles
    const allowedRoles = roles.map(role => role.toLowerCase());

    // Check permission
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not authorized to perform this action.",
      });
    }

    // User has required permission
    next();
  };
};

// Export Middleware
module.exports = authorize;