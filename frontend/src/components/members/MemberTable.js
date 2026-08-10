"use client";

import DataTable from "../common/DataTable";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import Button from "../common/Button";

export default function MemberTable({
  members = [],
  membershipPlans = [],
  onView,
  onEdit,
  onDelete,
}) {
  // ==========================
  // Get Membership Plan Name
  // ==========================
  const getMembershipPlanName = (planId) => {
    if (!planId) return "-";

    const id =
      typeof planId === "object"
        ? planId._id
        : planId;

    const plan = membershipPlans.find(
      (plan) => plan._id === id
    );

    return plan ? plan.planName : "-";
  };

  // ==========================
  // Format Date
  // ==========================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================
  // Table Columns
  // ==========================
  const columns = [
    // ==========================
    // Member
    // ==========================
    {
      key: "fullName",
      title: "Member",

      render: (row) => (
        <div>
          <div className="font-medium text-slate-900">
            {row.fullName}
          </div>

          <div className="text-xs text-slate-500 mt-1">
            ID: {row.memberId}
          </div>
        </div>
      ),
    },

    // ==========================
    // Email
    // ==========================
    {
      key: "email",
      title: "Email",
    },

    // ==========================
    // Phone
    // ==========================
    {
      key: "phoneNumber",
      title: "Phone",
    },

    // ==========================
    // CNIC
    // ==========================
    {
      key: "cnic",
      title: "CNIC",
    },

    // ==========================
    // Membership Plan
    // ==========================
    {
      key: "membershipPlan",
      title: "Membership Plan",

      render: (row) => (
        <Badge variant="success">
          {getMembershipPlanName(
            row.membershipPlan
          )}
        </Badge>
      ),
    },

    // ==========================
    // Date Of Birth
    // ==========================
    {
      key: "dateOfBirth",
      title: "Date of Birth",

      render: (row) =>
        formatDate(row.dateOfBirth),
    },

    // ==========================
    // Joining Date
    // ==========================
    {
      key: "joiningDate",
      title: "Joined",

      render: (row) =>
        formatDate(row.joiningDate),
    },

    // ==========================
    // Membership Expiry
    // ==========================
    {
      key: "membershipExpiryDate",
      title: "Expiry",

      render: (row) => (
        <span className="font-medium text-red-600">
          {formatDate(
            row.membershipExpiryDate
          )}
        </span>
      ),
    },

    // ==========================
    // Actions
    // ==========================
    {
      key: "actions",
      title: "Actions",

      render: (row) => (
        <div className="flex gap-2">
          {/* View */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(row)}
          >
            👁️
          </Button>

          {/* Edit */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row)}
          >
            ✏️
          </Button>

          {/* Delete */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(row)}
          >
            🗑️
          </Button>
        </div>
      ),
    },
  ];

  // ==========================
  // Render Table
  // ==========================
  return (
    <DataTable
      columns={columns}
      data={members}
      emptyState={
        <EmptyState
          title="No Members"
          description="Create your first gym member."
        />
      }
    />
  );
}