"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Building2,
  UserPlus,
  ArrowLeft,
  Save,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

export default function CreateGymPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    gymName: "",
    gymEmail: "",
    gymPhoneNumber: "",
    gymAddress: "",
    adminFullName: "",
    adminEmail: "",
    adminPassword: "",
  });

  // ==========================
  // Auth Guard
  // ==========================

  useEffect(() => {
    if (authLoading) return;

    if (
      !user ||
      user.role?.toLowerCase() !== "superadmin"
    ) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  // ==========================
  // Handle Input Change
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================
  // Submit Form
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ==========================
    // Validation
    // ==========================

    if (
      !formData.gymName.trim() ||
      !formData.adminFullName.trim() ||
      !formData.adminEmail.trim() ||
      !formData.adminPassword
    ) {
      setError(
        "Gym name, admin name, admin email and admin password are required."
      );

      return;
    }

    if (formData.adminPassword.length < 6) {
      setError(
        "Gym Admin password must be at least 6 characters."
      );

      return;
    }

    try {
      setLoading(true);

      // ==========================
      // Get Login Token
      // ==========================

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // ==========================
      // Create Gym + Gym Admin
      // ==========================

      const response = await fetch(
        "http://localhost:5000/api/gyms",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          // IMPORTANT:
          // These names match gymController.js
          body: JSON.stringify({
            name: formData.gymName.trim(),

            email: formData.gymEmail
              .trim()
              .toLowerCase(),

            phoneNumber:
              formData.gymPhoneNumber.trim(),

            address:
              formData.gymAddress.trim(),

            adminFullName:
              formData.adminFullName.trim(),

            adminEmail:
              formData.adminEmail
                .trim()
                .toLowerCase(),

            adminPassword:
              formData.adminPassword,
          }),
        }
      );

      const data = await response.json();

      // ==========================
      // Backend Error
      // ==========================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create gym."
        );
      }

      // ==========================
      // Success
      // ==========================

      setSuccess(
        "Gym and Gym Admin created successfully."
      );

      // Clear form

      setFormData({
        gymName: "",
        gymEmail: "",
        gymPhoneNumber: "",
        gymAddress: "",
        adminFullName: "",
        adminEmail: "",
        adminPassword: "",
      });

      // Redirect to Gym List

      setTimeout(() => {
        router.push("/super-admin/gyms");
      }, 1200);

    } catch (err) {
      console.error(
        "Create Gym Failed:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while creating the gym."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Auth Guard
  // ==========================

  if (
    authLoading ||
    !user ||
    user.role?.toLowerCase() !== "superadmin"
  ) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ==========================
          Header
      ========================== */}

      <div className="flex items-center gap-4">

        <Link
          href="/super-admin/gyms"
          className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Create New Gym
          </h1>

          <p className="text-slate-500 mt-1">
            Create a gym and its Gym Admin account.
          </p>

        </div>

      </div>

      {/* ==========================
          Error Message
      ========================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ==========================
          Success Message
      ========================== */}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* ==========================
          Form
      ========================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ==========================
            Gym Information
        ========================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Building2 size={21} />
            </div>

            <div>

              <h2 className="font-semibold text-slate-900">
                Gym Information
              </h2>

              <p className="text-sm text-slate-500">
                Basic information about the gym.
              </p>

            </div>

          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Gym Name */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gym Name *
              </label>

              <input
                type="text"
                name="gymName"
                value={formData.gymName}
                onChange={handleChange}
                placeholder="Enter gym name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

            </div>

            {/* Gym Email */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gym Email
              </label>

              <input
                type="email"
                name="gymEmail"
                value={formData.gymEmail}
                onChange={handleChange}
                placeholder="gym@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Gym Phone */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>

              <input
                type="text"
                name="gymPhoneNumber"
                value={formData.gymPhoneNumber}
                onChange={handleChange}
                placeholder="03XX-XXXXXXX"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Address */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>

              <textarea
                name="gymAddress"
                value={formData.gymAddress}
                onChange={handleChange}
                placeholder="Enter gym address"
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

        </div>

        {/* ==========================
            Gym Admin Information
        ========================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <UserPlus size={21} />
            </div>

            <div>

              <h2 className="font-semibold text-slate-900">
                Gym Admin Account
              </h2>

              <p className="text-sm text-slate-500">
                This account will manage this gym.
              </p>

            </div>

          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Admin Name */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Admin Full Name *
              </label>

              <input
                type="text"
                name="adminFullName"
                value={formData.adminFullName}
                onChange={handleChange}
                placeholder="Enter admin full name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

            </div>

            {/* Admin Email */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Admin Email *
              </label>

              <input
                type="email"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

            </div>

            {/* Admin Password */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Admin Password *
              </label>

              <input
                type="password"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength={6}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

            </div>

          </div>

        </div>

        {/* ==========================
            Actions
        ========================== */}

        <div className="flex items-center justify-end gap-3">

          <Link
            href="/super-admin/gyms"
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Gym
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
}