"use client";

import { useEffect, useState } from "react";

import Input from "../common/Input";
import Button from "../common/Button";

import {
  getAllMembershipPlans,
} from "../../services/membershipPlanService";

import {
  getAllTrainers,
} from "../../services/staffService";

export default function MemberForm({
  initialData = {},
  onSubmit,
  loading = false,
}) {
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingTrainers, setLoadingTrainers] = useState(true);

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

    assignedTrainer:
      typeof initialData.assignedTrainer === "object"
        ? initialData.assignedTrainer?._id || ""
        : initialData.assignedTrainer || "",
  });

  // ==========================
  // Load Membership Plans
  // ==========================

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

  // ==========================
  // Load Trainers
  // ==========================

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoadingTrainers(true);

        const response = await getAllTrainers();

        setTrainers(response.data || []);
      } catch (error) {
        console.error(
          "Failed to load trainers:",
          error
        );
      } finally {
        setLoadingTrainers(false);
      }
    };

    fetchTrainers();
  }, []);

  // ==========================
  // Handle Change
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Submit
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSubmit({
      ...formData,
      assignedTrainer:
        formData.assignedTrainer || null,
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
          Select the membership plan and assigned trainer.
        </p>
      </div>

      {/* ==========================
          Membership Plan
      ========================== */}

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
          Assigned Trainer
      ========================== */}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Assigned Trainer
        </label>

        <select
          name="assignedTrainer"
          value={formData.assignedTrainer}
          onChange={handleChange}
          disabled={loadingTrainers}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        >
          <option value="">
            {loadingTrainers
              ? "Loading trainers..."
              : "Select trainer (optional)"}
          </option>

          {trainers.map((trainer) => (
            <option
              key={trainer._id}
              value={trainer._id}
            >
              {trainer.fullName}
            </option>
          ))}
        </select>

        <p className="mt-1 text-xs text-slate-500">
          The selected trainer will only be able to access
          members assigned to them.
        </p>
      </div>

      {/* ==========================
          Actions
      ========================== */}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <Button
          type="submit"
          variant="primary"
          disabled={
            loading ||
            loadingPlans ||
            loadingTrainers
          }
        >
          {loading
            ? "Saving..."
            : "Save Member"}
        </Button>
      </div>
    </form>
  );
}