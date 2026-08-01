/**
 * Async Handler Middleware
 *
 * Purpose:
 * Automatically catches errors from async controllers
 * and forwards them to the global error handler.
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;