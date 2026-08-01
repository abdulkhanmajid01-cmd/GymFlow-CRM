/**
 * Global Error Handler Middleware
 *
 * Purpose:
 * Handles all application errors from one place.
 * Any error passed with next(error) will come here.
 */

const errorHandler = (err, req, res, next) => {

  // Default Status Code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Send Error Response
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });

};

module.exports = errorHandler;