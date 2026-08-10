// Import Member Model
const Member = require("../models/Member");

// ==========================
// Get Membership Expiry Alerts
// ==========================
const getMembershipExpiryAlerts = async (req, res) => {
  try {
    // Get all members
    const members = await Member.find().populate(
      "membershipPlan"
    );

    const today = new Date();

    // Remove time for accurate day calculation
    today.setHours(0, 0, 0, 0);

    // Create expiry alerts
    const alerts = members
      .filter((member) => member.membershipExpiryDate)
      .map((member) => {
        const expiryDate = new Date(
          member.membershipExpiryDate
        );

        expiryDate.setHours(0, 0, 0, 0);

        const difference =
          expiryDate.getTime() - today.getTime();

        const daysRemaining = Math.ceil(
          difference /
            (1000 * 60 * 60 * 24)
        );

        return {
          memberId: member._id,
          memberName: member.fullName,
          email: member.email,
          phoneNumber: member.phoneNumber,

          membershipPlan:
            member.membershipPlan?.planName || null,

          expiryDate:
            member.membershipExpiryDate,

          daysRemaining,

          // Alert type
          type:
            daysRemaining < 0
              ? "expired"
              : daysRemaining <= 3
              ? "urgent"
              : daysRemaining <= 7
              ? "warning"
              : null,

          message:
            daysRemaining < 0
              ? "Membership has expired."
              : daysRemaining === 0
              ? "Membership expires today."
              : daysRemaining === 1
              ? "Membership expires tomorrow."
              : daysRemaining <= 7
              ? `Membership expires in ${daysRemaining} days.`
              : null,
        };
      })
      // Only return members whose expiry
      // is within 7 days or already expired
      .filter(
        (alert) =>
          alert.daysRemaining <= 7
      );

    // Success Response
    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error(error);

    // Error Response
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Export Controller
// ==========================

module.exports = {
  getMembershipExpiryAlerts,
};