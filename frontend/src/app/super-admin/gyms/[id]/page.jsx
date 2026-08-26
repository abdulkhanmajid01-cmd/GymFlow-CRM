"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Building2,
  ArrowLeft,
  RefreshCw,
  Pencil,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";

export default function GymDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const gymId = params?.id;

  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  // Fetch Gym Details
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

      if (!gymId) {
        throw new Error("Gym ID not found.");
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

      const contentType =
        response.headers.get("content-type") || "";

      let result;

      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch gym details."
        );
      }

      /*
        Backend response expected:

        {
          success: true,
          data: gym
        }
      */

      const gymData = result.data?.gym || result.data;

if (!gymData) {
  throw new Error("Gym data not found.");
}

setGym(gymData);
    } catch (err) {
      console.error(
        "Fetch Gym Details Failed:",
        err
      );

      setError(
        err.message ||
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
  // Toggle Gym Status
  // ==========================

  const handleToggleStatus = async () => {
    if (!gym || actionLoading) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      /*
        IMPORTANT:

        Backend route is:

        PATCH /api/gyms/:id/status

        NOT:

        /toggle-status
      */

      const response = await fetch(
        `http://localhost:5000/api/gyms/${gymId}/status`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let result;

      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Non-JSON response from server:",
          text
        );

        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update gym status."
        );
      }

      /*
        Backend should return:

        {
          success: true,
          data: updatedGym
        }
      */

      if (result.data) {
        setGym(result.data);
      } else {
        // Fallback:
        // If backend does not return updated gym,
        // fetch latest data again.
        await fetchGym();
      }

      setSuccess(
        result.message ||
          (gym.isActive
            ? "Gym deactivated successfully."
            : "Gym activated successfully.")
      );

      // Remove success message after 2.5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "Toggle Gym Status Failed:",
        err
      );

      setError(
        err.message ||
          "Failed to update gym status."
      );
    } finally {
      setActionLoading(false);
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
  // Loading State
  // ==========================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>
            Loading gym details...
          </span>
        </div>
      </div>
    );
  }

  // ==========================
  // Error State
  // ==========================

  if (error && !gym) {
    return (
      <div className="space-y-6">

        <Link
          href="/super-admin/gyms"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={18} />

          Back to Gyms
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>

      </div>
    );
  }

  if (!gym) {
    return null;
  }

  // ==========================
  // Dates
  // ==========================

  const createdDate = gym.createdAt
    ? new Date(
        gym.createdAt
      ).toLocaleDateString()
    : "N/A";

  const updatedDate = gym.updatedAt
    ? new Date(
        gym.updatedAt
      ).toLocaleDateString()
    : "N/A";

  return (
    <div className="space-y-8">

      {/* ==========================
          Header
      ========================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Side */}

        <div className="flex items-center gap-4">

          {/* Back */}

          <Link
            href="/super-admin/gyms"
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
            title="Back to Gyms"
          >
            <ArrowLeft size={20} />
          </Link>

          {/* Icon */}

          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Building2 size={25} />
          </div>

          {/* Title */}

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {gym.name}
            </h1>

            <p className="text-slate-500 mt-1">
              Gym details and platform management.
            </p>
          </div>

        </div>

        {/* Actions */}

        <div className="flex items-center gap-3">

          {/* Refresh */}

          <button
            type="button"
            onClick={fetchGym}
            disabled={loading || actionLoading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {/* Edit */}

          <Link
            href={`/super-admin/gyms/${gymId}/edit`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            <Pencil size={18} />

            Edit Gym
          </Link>

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
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle2 size={18} />

          {success}
        </div>
      )}

      {/* ==========================
          Overview
      ========================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Status */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Gym Status
              </p>

              <div className="mt-3">

                <span
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                    gym.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {gym.isActive ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}

                  {gym.isActive
                    ? "Active"
                    : "Inactive"}

                </span>

              </div>
            </div>

            <ShieldCheck
              size={25}
              className={
                gym.isActive
                  ? "text-emerald-500"
                  : "text-red-500"
              }
            />

          </div>

        </div>

        {/* Created */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <p className="text-sm text-slate-500">
            Created
          </p>

          <p className="mt-3 text-xl font-semibold text-slate-900">
            {createdDate}
          </p>

        </div>

        {/* Updated */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <p className="text-sm text-slate-500">
            Last Updated
          </p>

          <p className="mt-3 text-xl font-semibold text-slate-900">
            {updatedDate}
          </p>

        </div>

      </div>

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
              Basic information about this gym.
            </p>

          </div>

        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Name */}

          <div className="md:col-span-2">

            <p className="text-sm text-slate-500">
              Gym Name
            </p>

            <div className="mt-2 flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-4">

              <Building2
                size={18}
                className="text-slate-400"
              />

              <span className="text-slate-900">
                {gym.name ||
                  "Not provided"}
              </span>

            </div>

          </div>

          {/* Email */}

          <div>

            <p className="text-sm text-slate-500">
              Email
            </p>

            <div className="mt-2 flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-4">

              <Mail
                size={18}
                className="text-slate-400"
              />

              <span className="text-slate-900">
                {gym.email ||
                  "Not provided"}
              </span>

            </div>

          </div>

          {/* Phone */}

          <div>

            <p className="text-sm text-slate-500">
              Phone Number
            </p>

            <div className="mt-2 flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-4">

              <Phone
                size={18}
                className="text-slate-400"
              />

              <span className="text-slate-900">
                {gym.phoneNumber ||
                  "Not provided"}
              </span>

            </div>

          </div>

          {/* Address */}

          <div className="md:col-span-2">

            <p className="text-sm text-slate-500">
              Address
            </p>

            <div className="mt-2 flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-4">

              <MapPin
                size={18}
                className="text-slate-400 mt-0.5"
              />

              <span className="text-slate-900">
                {gym.address ||
                  "Not provided"}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================
          Gym Administration
      ========================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <ShieldCheck size={21} />
          </div>

          <div>

            <h2 className="font-semibold text-slate-900">
              Gym Administration
            </h2>

            <p className="text-sm text-slate-500">
              Platform-level controls for this gym.
            </p>

          </div>

        </div>

        <div className="p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <h3 className="font-semibold text-slate-900">
                Gym Access
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {gym.isActive
                  ? "This gym is currently active and can access the platform."
                  : "This gym is currently inactive and cannot access the platform."}
              </p>

            </div>

            {/* Activate / Deactivate */}

            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={actionLoading}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white transition disabled:opacity-60 disabled:cursor-not-allowed ${
                gym.isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >

              {actionLoading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Updating...
                </>
              ) : gym.isActive ? (
                <>
                  <XCircle size={18} />

                  Deactivate Gym
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />

                  Activate Gym
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}