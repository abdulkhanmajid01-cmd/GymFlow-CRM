"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../../../../context/AuthContext";

export default function EditGymPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const gymId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
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
  // Fetch Existing Gym
  // ==========================

  const fetchGym = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `http://localhost:5000/api/gyms/${gymId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch gym."
        );
      }

     const gym = result.data?.gym || result.data;

if (!gym) {
  throw new Error("Gym data not found.");
}

setFormData({
  name: gym.name || "",
  email: gym.email || "",
  phoneNumber: gym.phoneNumber || "",
  address: gym.address || "",
});
    } catch (error) {
      console.error("Fetch gym failed:", error);

      setError(
        error.message ||
          "Something went wrong while loading gym."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Initial Load
  // ==========================

  useEffect(() => {
    if (gymId) {
      fetchGym();
    }
  }, [gymId]);

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================
  // Submit
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Gym name is required.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `http://localhost:5000/api/gyms/${gymId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            address: formData.address.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update gym."
        );
      }

      setSuccess("Gym updated successfully.");

      // Go back to details page after save
      setTimeout(() => {
        router.push(`/super-admin/gyms/${gymId}`);
        router.refresh();
      }, 700);
    } catch (error) {
      console.error("Update gym failed:", error);

      setError(
        error.message ||
          "Something went wrong while updating gym."
      );
    } finally {
      setSaving(false);
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

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={22}
            className="animate-spin"
          />
          Loading gym...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* ==========================
          Header
      ========================== */}

      <div className="flex items-center gap-4">

        <Link
          href={`/super-admin/gyms/${gymId}`}
          className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <Building2 size={25} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Edit Gym
          </h1>

          <p className="text-slate-500 mt-1">
            Update the existing gym information.
          </p>
        </div>

      </div>

      {/* ==========================
          Error
      ========================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ==========================
          Success
      ========================== */}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* ==========================
          Form
      ========================== */}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
      >

        {/* Section Header */}

        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Building2 size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Gym Information
            </h2>

            <p className="text-sm text-slate-500">
              Existing gym data is loaded below.
            </p>
          </div>

        </div>

        {/* Fields */}

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Gym Name */}

          <div className="md:col-span-2">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gym Name *
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

          </div>

          {/* Email */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Phone */}

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Address */}

          <div className="md:col-span-2">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>

        {/* Actions */}

        <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3">

          <Link
            href={`/super-admin/gyms/${gymId}`}
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >

            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
}