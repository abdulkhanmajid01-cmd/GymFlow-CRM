// ==========================
// Date Utilities
// ==========================
//
// Shared strict date validation for all
// backend controllers.
//
// Dates are normalized to a timezone-stable
// instant (noon UTC of the calendar date) so
// that every environment stores the same
// "one record per day" bucket regardless of
// the server's local timezone.
// ==========================

// Strict date format: exactly YYYY-MM-DD.
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse and strictly validate a YYYY-MM-DD date string.
 *
 * Rejects:
 * - Non-numeric or wrongly formatted input.
 * - Any input that is not exactly 10 characters
 *   (extra trailing characters or malformed suffixes
 *   such as "2026-08-31extra" are rejected, not
 *   truncated).
 * - Out-of-range month (01-12) and day (01-31).
 * - Roll-over dates such as "2026-02-31" or
 *   "2026-13-45" that Date.UTC would silently
 *   normalize into a different calendar day.
 *
 * @param {string} dateString Date part only, exactly YYYY-MM-DD.
 * @returns {Date|null} UTC noon Date instance, or null if invalid.
 */
const createDateFromDateString = (dateString) => {
  // Strict format AND length validation. Only exactly
  // ten-character YYYY-MM-DD strings are accepted;
  // anything with extra trailing characters or a
  // malformed suffix is rejected instead of being
  // truncated or silently normalized.
  if (
    !dateString ||
    dateString.length !== 10 ||
    !DATE_REGEX.test(dateString)
  ) {
    return null;
  }

  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  // Reject out-of-range month (01-12) and
  // day (01-31) before constructing.
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      12,
      0,
      0,
      0
    )
  );

  // Guard month-specific roll-overs such as
  // "2026-02-31" which Date.UTC would normalize
  // to a different calendar day.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

module.exports = {
  createDateFromDateString,
};