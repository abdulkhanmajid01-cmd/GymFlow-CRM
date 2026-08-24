// Import Models
const User = require("../models/User");
const Member = require("../models/Member");

/**
 * Check if an email already exists inside a specific gym.
 *
 * Email uniqueness is gym-specific because GymFlow CRM
 * follows a multi-tenant SaaS architecture.
 *
 * @param {Object} options
 * @param {string} options.email
 * @param {string} options.gymId
 * @param {string|null} options.excludeMemberId
 * @param {string|null} options.excludeUserId
 *
 * @returns {boolean}
 */
const checkEmailExists = async ({
  email,
  gymId,
  excludeMemberId = null,
  excludeUserId = null,
}) => {
  if (!email || !gymId) {
    return false;
  }

  // Normalize email
  const normalizedEmail =
    email.toLowerCase().trim();

  // ==========================
  // Check Users Collection
  // ==========================

  const user = await User.findOne({
    email: normalizedEmail,
    gymId,
  });

  if (user) {
    // Ignore current user while updating
    if (
      !excludeUserId ||
      user._id.toString() !==
        excludeUserId.toString()
    ) {
      return true;
    }
  }

  // ==========================
  // Check Members Collection
  // ==========================

  const member = await Member.findOne({
    email: normalizedEmail,
    gymId,
  });

  if (member) {
    // Ignore current member while updating
    if (
      !excludeMemberId ||
      member._id.toString() !==
        excludeMemberId.toString()
    ) {
      return true;
    }
  }

  // ==========================
  // Email Available
  // ==========================

  return false;
};

module.exports = checkEmailExists;