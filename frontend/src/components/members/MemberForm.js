"use client";

import { useEffect, useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";

import {
  getAllMembershipPlans,
} from "../../services/membershipPlanService";

export default function MemberForm({
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    email: initialData.email || "",
    phoneNumber: initialData.phoneNumber || "",
    dateOfBirth: initialData.dateOfBirth
      ? initialData.dateOfBirth.split("T")[0]
      : "",
    cnic: initialData.cnic || "",
    memberId: initialData.memberId || "",
    membershipPlan:
      typeof initialData.membershipPlan === "object"
        ? initialData.membershipPlan?._id || ""
        : initialData.membershipPlan || "",
  });

  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        setLoadingPlans(true);

        const response = await getAllMembershipPlans();

        setMembershipPlans(response.data || []);
      } catch (error) {
        console.error(
          "Failed to load membership plans:",
          error
        );
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchMembershipPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSubmit({
      ...formData,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ==========================
          Personal Information
      ========================== */}

      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Personal Information
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Enter the member's basic information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
        />

        <Input
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="03XX-XXXXXXX"
          required
        />

        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />

        <Input
          label="CNIC"
          name="cnic"
          value={formData.cnic}
          onChange={handleChange}
          placeholder="XXXXX-XXXXXXX-X"
          required
        />

        <Input
          label="Member ID"
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          placeholder="e.g. GF-001"
          required
        />

      </div>

      {/* ==========================
          Membership
      ========================== */}

      <div className="pt-2">
        <h3 className="text-lg font-semibold text-slate-900">
          Membership
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Select the membership plan for this member.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Membership Plan
        </label>

        <select
          name="membershipPlan"
          value={formData.membershipPlan}
          onChange={handleChange}
          required
          disabled={loadingPlans}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        >
          <option value="">
            {loadingPlans
              ? "Loading membership plans..."
              : "Select membership plan"}
          </option>

          {membershipPlans.map((plan) => (
            <option
              key={plan._id}
              value={plan._id}
            >
              {plan.planName} — PKR{" "}
              {plan.price?.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* ==========================
          Actions
      ========================== */}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">

        <Button
          type="submit"
          variant="primary"
          disabled={loading || loadingPlans}
        >
          {loading
            ? "Saving..."
            : "Save Member"}
        </Button>

      </div>
    </form>
  );
}