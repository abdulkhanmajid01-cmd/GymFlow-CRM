/**
 * Global Error Handler Middleware
 *
 * Purpose:
 * Handles all application errors from one place.
 * Converts technical database errors into
 * user-friendly API responses.
 */

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // ==========================
  // Default Status Code
  // ==========================

  let statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  let message =
    err.message || "Internal Server Error";

  // ==========================
  // MongoDB Duplicate Key Error
  // ==========================

  if (err.code === 11000) {
    statusCode = 409;

    // Get duplicated field name
    const field = Object.keys(
      err.keyPattern || {}
    )[0];

    const value =
      err.keyValue?.[field];

    // User-friendly messages
    const fieldMessages = {
      memberId: "Member ID",
      email: "Email address",
      phoneNumber: "Phone number",
      cnic: "CNIC",
    };

    const fieldName =
      fieldMessages[field] ||
      field ||
      "Value";

    message = `${fieldName} "${value}" already exists. Please use a different ${fieldName}.`;
  }

  // ==========================
  // Mongoose Validation Error
  // ==========================

  else if (
    err.name === "ValidationError"
  ) {
    statusCode = 400;

    const errors = Object.values(
      err.errors || {}
    ).map(
      (error) => error.message
    );

    message =
      errors.length > 0
        ? errors.join(", ")
        : "Invalid data provided.";
  }

  // ==========================
  // Invalid MongoDB ObjectId
  // ==========================

  else if (
    err.name === "CastError"
  ) {
    statusCode = 400;

    message = `Invalid ${err.path || "ID"} provided.`;
  }

  // ==========================
  // Final Response
  // ==========================

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;