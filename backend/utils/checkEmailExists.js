// Import Models
const User = require("../models/User");
const Member = require("../models/Member");

/**
 * Check if an email already exists in the system.
 *
 * @param {Object} options
 * @param {string} options.email
 * @param {string|null} options.excludeMemberId
 * @param {string|null} options.excludeUserId
 *
 * @returns {boolean}
 */
const checkEmailExists = async ({
  email,
  excludeMemberId = null,
  excludeUserId = null,
}) => {
  // Check Users collection
  const user = await User.findOne({ email });

  if (user) {
    // Ignore current user while updating
    if (!excludeUserId || user._id.toString() !== excludeUserId) {
      return true;
    }
  }

  // Check Members collection
  const member = await Member.findOne({ email });

  if (member) {
    // Ignore current member while updating
    if (!excludeMemberId || member._id.toString() !== excludeMemberId) {
      return true;
    }
  }

  // Email is available
  return false;
};

module.exports = checkEmailExists;