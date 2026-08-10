// Import Member Model
const Member = require("../models/Member");

// ==========================
// Get Days Until Expiry
// ==========================
const getDaysUntilExpiry = (expiryDate) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);

  expiry.setHours(0, 0, 0, 0);

  const difference =
    expiry.getTime() - today.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
};

// ==========================
// Get Membership Expiry Alerts
// ==========================
const getMembershipExpiryAlerts = async () => {
  // Get all members
  const members = await Member.find()
    .populate("membershipPlan");

  const alerts = [];

  members.forEach((member) => {
    if (!member.membershipExpiryDate) {
      return;
    }

    const daysRemaining =
      getDaysUntilExpiry(
        member.membershipExpiryDate
      );

    // ==========================
    // Expired
    // ==========================
    if (daysRemaining < 0) {
      alerts.push({
        memberId: member._id,
        memberName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber,

        membershipPlan:
          member.membershipPlan?.planName ||
          null,

        expiryDate:
          member.membershipExpiryDate,

        daysRemaining,

        type: "expired",

        message:
          "Membership has expired.",
      });

      return;
    }

    // ==========================
    // Expires Today
    // ==========================
    if (daysRemaining === 0) {
      alerts.push({
        memberId: member._id,
        memberName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber,

        membershipPlan:
          member.membershipPlan?.planName ||
          null,

        expiryDate:
          member.membershipExpiryDate,

        daysRemaining: 0,

        type: "urgent",

        message:
          "Membership expires today.",
      });

      return;
    }

    // ==========================
    // 1 Day Remaining
    // ==========================
    if (daysRemaining === 1) {
      alerts.push({
        memberId: member._id,
        memberName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber,

        membershipPlan:
          member.membershipPlan?.planName ||
          null,

        expiryDate:
          member.membershipExpiryDate,

        daysRemaining: 1,

        type: "urgent",

        message:
          "Membership expires tomorrow.",
      });

      return;
    }

    // ==========================
    // 3 Days Remaining
    // ==========================
    if (daysRemaining <= 3) {
      alerts.push({
        memberId: member._id,
        memberName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber,

        membershipPlan:
          member.membershipPlan?.planName ||
          null,

        expiryDate:
          member.membershipExpiryDate,

        daysRemaining,

        type: "warning",

        message:
          `Membership expires in ${daysRemaining} days.`,
      });

      return;
    }

    // ==========================
    // 7 Days Remaining
    // ==========================
    if (daysRemaining <= 7) {
      alerts.push({
        memberId: member._id,
        memberName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber,

        membershipPlan:
          member.membershipPlan?.planName ||
          null,

        expiryDate:
          member.membershipExpiryDate,

        daysRemaining,

        type: "warning",

        message:
          `Membership expires in ${daysRemaining} days.`,
      });
    }
  });

  return alerts;
};

// ==========================
// Export Service
// ==========================

module.exports = {
  getMembershipExpiryAlerts,
};