"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Layout
import DashboardLayout from "../../components/layout/DashboardLayout";

// Components
import MemberToolbar from "../../components/members/MemberToolbar";
import MemberTable from "../../components/members/MemberTable";
import MemberForm from "../../components/members/MemberForm";

import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

// Services
import {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../../services/memberService";

import { getAllMembershipPlans } from "../../services/membershipPlanService";

export default function MembersPage() {
  // ===========================
  // Search Params
  // ===========================

  const searchParams = useSearchParams();

  // ===========================
  // States
  // ===========================

  const [members, setMembers] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Page-level error
  const [error, setError] = useState("");

  // Form-level error
  const [formError, setFormError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [deleteMemberData, setDeleteMemberData] = useState(null);

  // ===========================
  // User Friendly Error
  // ===========================

  const getUserFriendlyError = (message) => {
    if (!message) {
      return "Something went wrong. Please check your details and try again.";
    }

    const lowerMessage = message.toLowerCase();

    // ===========================
    // Duplicate Email
    // ===========================

    if (
      lowerMessage.includes("email already exists") ||
      (lowerMessage.includes("email") &&
        lowerMessage.includes("duplicate"))
    ) {
      return "This email is already registered. Please use a different email address.";
    }

    // ===========================
    // Duplicate Member ID
    // ===========================

    if (
      (lowerMessage.includes("member id") ||
        lowerMessage.includes("memberid")) &&
      (lowerMessage.includes("already exists") ||
        lowerMessage.includes("duplicate"))
    ) {
      return "This Member ID is already registered. Please use a different Member ID.";
    }

    // ===========================
    // Duplicate CNIC
    // ===========================

    if (
      lowerMessage.includes("cnic") &&
      (lowerMessage.includes("already exists") ||
        lowerMessage.includes("duplicate"))
    ) {
      return "This CNIC is already registered. Please use a different CNIC.";
    }

    // ===========================
    // Duplicate Phone
    // ===========================

    if (
      (lowerMessage.includes("phone") ||
        lowerMessage.includes("phonenumber")) &&
      (lowerMessage.includes("already exists") ||
        lowerMessage.includes("duplicate"))
    ) {
      return "This phone number is already registered. Please use a different phone number.";
    }

    // ===========================
    // MongoDB Duplicate Key
    // ===========================

    if (
      lowerMessage.includes("e11000") ||
      lowerMessage.includes("duplicate key")
    ) {
      if (
        lowerMessage.includes("memberid") ||
        lowerMessage.includes("member_id")
      ) {
        return "This Member ID is already registered. Please use a different Member ID.";
      }

      if (lowerMessage.includes("email")) {
        return "This email is already registered. Please use a different email address.";
      }

      if (lowerMessage.includes("cnic")) {
        return "This CNIC is already registered. Please use a different CNIC.";
      }

      if (
        lowerMessage.includes("phone") ||
        lowerMessage.includes("phonenumber")
      ) {
        return "This phone number is already registered. Please use a different phone number.";
      }

      return "Some of this member's information is already registered. Please check your details.";
    }

    return message;
  };

  // ===========================
  // Fetch Members
  // ===========================

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await getAllMembers();

      setMembers(response.data || []);

      setError("");
    } catch (err) {
      setError(getUserFriendlyError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Fetch Membership Plans
  // ===========================

  const fetchMembershipPlans = async () => {
    try {
      const response = await getAllMembershipPlans();

      setMembershipPlans(response.data || []);
    } catch (err) {
      console.log(
        "Unable to load membership plans:",
        err?.message
      );
    }
  };

  // ===========================
  // Initial Load
  // ===========================

  useEffect(() => {
    fetchMembers();
    fetchMembershipPlans();
  }, []);

  // ===========================
  // Open Member From Notification
  // ===========================

  useEffect(() => {
    const memberId = searchParams.get("memberId");

    if (!memberId || members.length === 0) {
      return;
    }

    const member = members.find(
      (item) => item._id === memberId
    );

    if (member) {
      setViewingMember(member);
    }
  }, [searchParams, members]);

  // ===========================
  // Open Add Member
  // ===========================

  const handleAddMember = () => {
    setError("");
    setFormError("");
    setEditingMember(null);
    setIsModalOpen(true);
  };

  // ===========================
  // Create / Update Member
  // ===========================

  const handleSaveMember = async (memberData) => {
    try {
      setSaving(true);

      setFormError("");
      setError("");

      // ===========================
      // Update Existing Member
      // ===========================

      if (editingMember) {
        await updateMember(
          editingMember._id,
          memberData
        );
      }

      // ===========================
      // Create New Member
      // ===========================

      else {
        await createMember(memberData);
      }

      // ===========================
      // Refresh Members
      // ===========================

      await fetchMembers();

      // ===========================
      // Close Modal
      // ===========================

      setEditingMember(null);
      setFormError("");
      setIsModalOpen(false);
    } catch (err) {
      const friendlyMessage =
        getUserFriendlyError(err?.message);

      setFormError(friendlyMessage);
      setError("");
    } finally {
      setSaving(false);
    }
  };

  // ===========================
  // Delete Member
  // ===========================

  const handleDeleteMember = async () => {
    if (!deleteMemberData) return;

    try {
      setError("");

      await deleteMember(
        deleteMemberData._id
      );

      await fetchMembers();

      setDeleteMemberData(null);
    } catch (err) {
      const friendlyMessage =
        getUserFriendlyError(err?.message);

      setError(friendlyMessage);
    }
  };

  // ===========================
  // Search Filter
  // ===========================

  const filteredMembers =
    members.filter((member) => {
      const searchValue =
        search.toLowerCase();

      return (
        member.fullName
          ?.toLowerCase()
          .includes(searchValue) ||

        member.email
          ?.toLowerCase()
          .includes(searchValue) ||

        member.phoneNumber
          ?.toLowerCase()
          .includes(searchValue) ||

        member.memberId
          ?.toLowerCase()
          .includes(searchValue) ||

        member.cnic
          ?.toLowerCase()
          .includes(searchValue)
      );
    });

  // ===========================
  // Get Membership Plan Name
  // ===========================

  const getMembershipPlanName = (member) => {
    if (!member?.membershipPlan) {
      return "-";
    }

    // Populated membership plan
    if (
      typeof member.membershipPlan ===
      "object"
    ) {
      return (
        member.membershipPlan.planName ||
        "-"
      );
    }

    // ObjectId only
    const plan =
      membershipPlans.find(
        (item) =>
          item._id ===
          member.membershipPlan
      );

    return plan?.planName || "-";
  };

  // ===========================
  // Format Date
  // ===========================

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

  // ===========================
  // Open Edit From View Modal
  // ===========================

  const handleEditFromView = () => {
    if (!viewingMember) return;

    setError("");
    setFormError("");

    // Save selected member for editing
    setEditingMember(viewingMember);

    // Close View modal
    setViewingMember(null);

    // Open Edit modal
    setIsModalOpen(true);
  };

  // ===========================
  // Render
  // ===========================

  return (
    <DashboardLayout>

      {/* ===========================
          Header
      =========================== */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Members
        </h1>

        <p className="text-slate-500 mt-2">
          Manage all gym members.
        </p>
      </div>

      {/* ===========================
          Toolbar
      =========================== */}

      <MemberToolbar
        search={search}
        setSearch={setSearch}
        onAddMember={handleAddMember}
      />

      {/* ===========================
          Page-Level Error
      =========================== */}

      {error && (
        <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <div className="flex items-center gap-2">
            <span className="text-base">
              ⚠️
            </span>

            <span>
              {error}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="ml-4 text-lg font-bold text-red-500 hover:text-red-700"
            aria-label="Close error"
          >
            ×
          </button>

        </div>
      )}

      {/* ===========================
          Content
      =========================== */}

      {loading ? (

        <Loader
          text="Loading Members..."
        />

      ) : filteredMembers.length === 0 ? (

        <EmptyState
          title="No Members Found"
          description={
            search
              ? "No members match your search."
              : "No members have been registered yet."
          }
        />

      ) : (

        <MemberTable
          members={filteredMembers}
          membershipPlans={membershipPlans}

          onView={(member) => {
            setError("");
            setViewingMember(member);
          }}

          onEdit={(member) => {
            setError("");
            setFormError("");
            setEditingMember(member);
            setIsModalOpen(true);
          }}

          onDelete={(member) => {
            setError("");
            setDeleteMemberData(member);
          }}
        />

      )}

      {/* ===========================
          Add / Edit Member Modal
      =========================== */}

      <Modal
        isOpen={isModalOpen}

        onClose={() => {
          if (!saving) {
            setIsModalOpen(false);
            setEditingMember(null);
            setFormError("");
          }
        }}

        title={
          editingMember
            ? "Edit Member"
            : "Add New Member"
        }

        size="lg"
      >

        {/* ===========================
            FORM ERROR
        =========================== */}

        {formError && (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            <div className="flex items-start gap-2">

              <span className="text-base">
                ⚠️
              </span>

              <span>
                {formError}
              </span>

            </div>

            <button
              type="button"
              onClick={() =>
                setFormError("")
              }
              className="text-lg font-bold text-red-500 hover:text-red-700"
              aria-label="Close form error"
            >
              ×
            </button>

          </div>
        )}

        <MemberForm
          initialData={
            editingMember || {}
          }
          onSubmit={handleSaveMember}
          loading={saving}
        />

      </Modal>

      {/* ===========================
          View Member Modal
      =========================== */}

      <Modal
        isOpen={!!viewingMember}

        onClose={() =>
          setViewingMember(null)
        }

        title="Member Details"
        size="lg"
      >

        {viewingMember && (

          <div className="space-y-6">

            {/* Member Header */}

            <div className="rounded-xl bg-slate-50 p-5">

              <h2 className="text-xl font-bold text-slate-800">
                {viewingMember.fullName}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Member ID:{" "}
                {viewingMember.memberId}
              </p>

            </div>

            {/* Member Information */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Full Name */}

              <div>
                <p className="text-sm text-slate-500">
                  Full Name
                </p>

                <p className="font-medium">
                  {viewingMember.fullName}
                </p>
              </div>

              {/* Member ID */}

              <div>
                <p className="text-sm text-slate-500">
                  Member ID
                </p>

                <p className="font-medium">
                  {viewingMember.memberId}
                </p>
              </div>

              {/* Email */}

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-medium break-all">
                  {viewingMember.email}
                </p>
              </div>

              {/* Phone */}

              <div>
                <p className="text-sm text-slate-500">
                  Phone
                </p>

                <p className="font-medium">
                  {viewingMember.phoneNumber}
                </p>
              </div>

              {/* CNIC */}

              <div>
                <p className="text-sm text-slate-500">
                  CNIC
                </p>

                <p className="font-medium">
                  {viewingMember.cnic}
                </p>
              </div>

              {/* Date of Birth */}

              <div>
                <p className="text-sm text-slate-500">
                  Date of Birth
                </p>

                <p className="font-medium">
                  {formatDate(
                    viewingMember.dateOfBirth
                  )}
                </p>
              </div>

              {/* Membership Plan */}

              <div>
                <p className="text-sm text-slate-500">
                  Membership Plan
                </p>

                <p className="font-medium">
                  {getMembershipPlanName(
                    viewingMember
                  )}
                </p>
              </div>

              {/* Joining Date */}

              <div>
                <p className="text-sm text-slate-500">
                  Joining Date
                </p>

                <p className="font-medium">
                  {formatDate(
                    viewingMember.joiningDate
                  )}
                </p>
              </div>

              {/* Membership Expiry */}

              <div>
                <p className="text-sm text-slate-500">
                  Membership Expiry
                </p>

                <p
                  className={`font-medium ${
                    viewingMember.membershipExpiryDate &&
                    new Date(
                      viewingMember.membershipExpiryDate
                    ) < new Date()
                      ? "text-red-600"
                      : "text-slate-800"
                  }`}
                >
                  {formatDate(
                    viewingMember.membershipExpiryDate
                  )}
                </p>
              </div>

              {/* Created At */}

              <div>
                <p className="text-sm text-slate-500">
                  Record Created
                </p>

                <p className="font-medium">
                  {formatDate(
                    viewingMember.createdAt
                  )}
                </p>
              </div>

            </div>

            {/* ===========================
                View Modal Actions
            =========================== */}

            <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">

              <button
                type="button"
                onClick={() =>
                  setViewingMember(null)
                }
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleEditFromView}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Edit Member
              </button>

            </div>

          </div>

        )}

      </Modal>

      {/* ===========================
          Delete Confirmation Modal
      =========================== */}

      <Modal
        isOpen={!!deleteMemberData}

        onClose={() => {
          setDeleteMemberData(null);
          setError("");
        }}

        title="Delete Member"
        size="sm"
      >

        <div className="space-y-5">

          <p className="text-slate-600">

            Are you sure you want to delete{" "}

            <span className="font-semibold text-slate-900">
              {deleteMemberData?.fullName}
            </span>

            ?

          </p>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => {
                setDeleteMemberData(null);
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                handleDeleteMember
              }
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Delete
            </button>

          </div>

        </div>

      </Modal>

    </DashboardLayout>
  );
}