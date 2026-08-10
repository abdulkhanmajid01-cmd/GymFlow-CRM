// Import Member Model
const Member = require("../models/Member");

// Import Membership Plan Model
const MembershipPlan = require("../models/MembershipPlan");

// Import Helper
const checkEmailExists = require("../utils/checkEmailExists");

// ==========================
// Date Helpers
// ==========================

// Get today's date according to Pakistan timezone
const getPakistanDateString = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

// Convert YYYY-MM-DD into a stable UTC date
// Noon UTC prevents the date from shifting when displayed
// in Pakistan timezone or MongoDB tools.
const createDateFromDateString = (dateString) => {
  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  return new Date(
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
};

// Add months while keeping the calendar date stable
const addMonthsToDate = (date, months) => {
  const result = new Date(date);

  const originalDay = result.getUTCDate();

  // Move to first day of target month
  result.setUTCDate(1);

  result.setUTCMonth(
    result.getUTCMonth() + months
  );

  // Find last day of target month
  const lastDay = new Date(
    Date.UTC(
      result.getUTCFullYear(),
      result.getUTCMonth() + 1,
      0
    )
  ).getUTCDate();

  result.setUTCDate(
    Math.min(originalDay, lastDay)
  );

  return result;
};

// ==========================
// Create Member
// ==========================

const createMember = async (req, res, next) => {
  try {
    // Get required data
    const {
      email,
      membershipPlan,
      joiningDate,
    } = req.body;

    // ==========================
    // Check Email
    // ==========================

    const emailExists =
      await checkEmailExists({
        email,
      });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message:
          "Email already exists in the system",
      });
    }

    // ==========================
    // Find Membership Plan
    // ==========================

    const plan =
      await MembershipPlan.findById(
        membershipPlan
      );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message:
          "Membership plan not found",
      });
    }

    // ==========================
    // Joining Date
    // ==========================

    const dateString = joiningDate
      ? joiningDate.substring(0, 10)
      : getPakistanDateString();

    const startDate =
      createDateFromDateString(
        dateString
      );

    // ==========================
    // Calculate Expiry Date
    // ==========================

    const expiryDate =
      addMonthsToDate(
        startDate,
        plan.durationInMonths
      );

    // ==========================
    // Create Member
    // ==========================

    const member = await Member.create({
      ...req.body,

      joiningDate: startDate,

      membershipExpiryDate:
        expiryDate,
    });

    // ==========================
    // Success Response
    // ==========================

    res.status(201).json({
      success: true,
      message:
        "Member created successfully",
      data: member,
    });
  } catch (error) {
    // Send error to global error handler
    next(error);
  }
};

// ==========================
// Get All Members
// ==========================

const getAllMembers = async (
  req,
  res,
  next
) => {
  try {
    const members =
      await Member.find().populate(
        "membershipPlan"
      );

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    // Send error to global error handler
    next(error);
  }
};

// ==========================
// Get Single Member
// ==========================

const getSingleMember = async (
  req,
  res,
  next
) => {
  try {
    const member =
      await Member.findById(
        req.params.id
      ).populate("membershipPlan");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    // Send error to global error handler
    next(error);
  }
};

// ==========================
// Update Member
// ==========================

const updateMember = async (
  req,
  res,
  next
) => {
  try {
    // ==========================
    // Find Current Member
    // ==========================

    const currentMember =
      await Member.findById(
        req.params.id
      );

    if (!currentMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // ==========================
    // Check Email
    // ==========================

    if (
      req.body.email &&
      req.body.email !==
        currentMember.email
    ) {
      const emailExists =
        await checkEmailExists({
          email: req.body.email,
          excludeMemberId:
            req.params.id,
        });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message:
            "Email already exists in the system",
        });
      }
    }

    // ==========================
    // Prepare Update Data
    // ==========================

    const updateData = {
      ...req.body,
    };

    // ==========================
    // Check Membership Changes
    // ==========================

    const membershipPlanChanged =
      req.body.membershipPlan &&
      req.body.membershipPlan !==
        currentMember.membershipPlan.toString();

    const joiningDateChanged =
      req.body.joiningDate &&
      req.body.joiningDate.substring(0, 10) !==
        currentMember.joiningDate
          .toISOString()
          .substring(0, 10);

    // Recalculate expiry if:
    // 1. Membership plan changed
    // OR
    // 2. Joining date changed

    if (
      membershipPlanChanged ||
      joiningDateChanged
    ) {
      // ==========================
      // Get Plan
      // ==========================

      const planId =
        req.body.membershipPlan ||
        currentMember.membershipPlan;

      const plan =
        await MembershipPlan.findById(
          planId
        );

      if (!plan) {
        return res.status(404).json({
          success: false,
          message:
            "Membership plan not found",
        });
      }

      // ==========================
      // Determine Start Date
      // ==========================

      const dateString =
        req.body.joiningDate
          ? req.body.joiningDate.substring(
              0,
              10
            )
          : currentMember.joiningDate
              .toISOString()
              .substring(0, 10);

      const startDate =
        createDateFromDateString(
          dateString
        );

      // ==========================
      // Calculate New Expiry
      // ==========================

      const expiryDate =
        addMonthsToDate(
          startDate,
          plan.durationInMonths
        );

      updateData.joiningDate =
        startDate;

      updateData.membershipExpiryDate =
        expiryDate;
    }

    // ==========================
    // Update Member
    // ==========================

    const updatedMember =
      await Member.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).populate("membershipPlan");

    // ==========================
    // Success Response
    // ==========================

    res.status(200).json({
      success: true,
      message:
        "Member updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    // Send error to global error handler
    next(error);
  }
};

// ==========================
// Delete Member
// ==========================

const deleteMember = async (
  req,
  res,
  next
) => {
  try {
    const member =
      await Member.findByIdAndDelete(
        req.params.id
      );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Member deleted successfully",
    });
  } catch (error) {
    // Send error to global error handler
    next(error);
  }
};

// ==========================
// Export Controllers
// ==========================

module.exports = {
  createMember,
  getAllMembers,
  getSingleMember,
  updateMember,
  deleteMember,
};