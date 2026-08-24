"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ShieldCheck,
  Building2,
  Mail,
  User,
  ArrowLeft,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  getAllGymAdmins,
  toggleGymAdminStatus,
} from "@/services/gymAdminService";

export default function GymAdministratorsPage() {
  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ==========================================
  // Fetch Gym Administrators
  // ==========================================

  const fetchAdministrators = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAllGymAdmins();

      const administrators =
        Array.isArray(result.data)
          ? result.data
          : [];

      setAdmins(administrators);
    } catch (error) {
      console.error(
        "Fetch Gym Administrators Failed:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while loading gym administrators."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Toggle Administrator Status
  // ==========================================

  const handleToggleStatus = async (
    adminId
  ) => {
    if (!adminId || actionLoading) {
      return;
    }

    try {
      setActionLoading(adminId);

      setError("");
      setSuccess("");

      const result =
        await toggleGymAdminStatus(adminId);

      const updatedAdmin = result.data;

      if (updatedAdmin) {
        setAdmins((currentAdmins) =>
          currentAdmins.map((admin) =>
            admin._id === updatedAdmin._id
              ? {
                  ...admin,
                  ...updatedAdmin,
                }
              : admin
          )
        );
      } else {
        await fetchAdministrators();
      }

      setSuccess(
        result.message ||
          "Administrator status updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      console.error(
        "Toggle Gym Administrator Status Failed:",
        error
      );

      setError(
        error.message ||
          "Failed to update administrator status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchAdministrators();
  }, []);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-600">
          <Loader2
            size={28}
            className="animate-spin text-blue-600"
          />

          <span className="text-sm">
            Loading gym administrators...
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <div className="space-y-8">

      {/* ========================================
          Header
      ======================================== */}

      <div className="flex flex-col gap-5">

        <div className="flex items-start gap-4">

          <Link
            href="/super-admin"
            className="mt-1 w-10 h-10 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition"
            title="Back to Super Admin Dashboard"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gym Administrators
            </h1>

            <p className="text-slate-500 mt-1">
              Manage administrators assigned to GymFlow gyms.
            </p>
          </div>

        </div>

        {/* Refresh */}

        <div>
          <button
            type="button"
            onClick={fetchAdministrators}
            disabled={loading || actionLoading !== null}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>

      </div>

      {/* ========================================
          Error
      ======================================== */}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

          <AlertCircle size={20} />

          <p className="text-sm">
            {error}
          </p>

        </div>
      )}

      {/* ========================================
          Success
      ======================================== */}

      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4">

          <CheckCircle2 size={20} />

          <p className="text-sm">
            {success}
          </p>

        </div>
      )}

      {/* ========================================
          Statistics
      ======================================== */}

      {!error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Total */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Administrators
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {admins.length}
            </p>

          </div>

          {/* Active */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Active Administrators
            </p>

            <p className="text-3xl font-bold text-emerald-600 mt-2">
              {
                admins.filter(
                  (admin) =>
                    admin.isActive !== false
                ).length
              }
            </p>

          </div>

          {/* Assigned Gyms */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Assigned Gyms
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {
                new Set(
                  admins
                    .map(
                      (admin) =>
                        admin.gymId?._id
                    )
                    .filter(Boolean)
                ).size
              }
            </p>

          </div>

        </div>
      )}

      {/* ========================================
          Empty State
      ======================================== */}

      {!error && admins.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <User size={30} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            No gym administrators found
          </h2>

          <p className="mt-2 text-slate-500">
            Gym administrators will appear here after they are assigned to gyms.
          </p>

        </div>
      )}

      {/* ========================================
          Administrator List
      ======================================== */}

      {!error && admins.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100">

            <h2 className="font-semibold text-slate-900">
              Gym Administrators
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Administrators currently associated with GymFlow gyms.
            </p>

          </div>

          <div className="divide-y divide-slate-100">

            {admins.map((admin) => {

              const isActive =
                admin.isActive !== false;

              const isUpdating =
                actionLoading === admin._id;

              return (
                <div
                  key={admin._id}
                  className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 hover:bg-slate-50 transition"
                >

                  {/* Admin Information */}

                  <div className="flex items-start gap-4">

                    <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <User size={21} />
                    </div>

                    <div>

                      <h3 className="font-semibold text-slate-900">
                        {admin.fullName ||
                          "Unnamed Administrator"}
                      </h3>

                      {admin.email && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                          <Mail size={15} />

                          {admin.email}
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Assigned Gym */}

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Building2 size={19} />
                    </div>

                    <div>

                      <p className="text-xs text-slate-400 uppercase font-medium">
                        Assigned Gym
                      </p>

                      <p className="text-sm font-medium text-slate-900">
                        {admin.gymId?.name ||
                          "Not assigned"}
                      </p>

                    </div>

                  </div>

                  {/* Status */}

                  <div>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {isActive ? (
                        <CheckCircle2
                          size={14}
                          className="mr-2"
                        />
                      ) : (
                        <XCircle
                          size={14}
                          className="mr-2"
                        />
                      )}

                      {isActive
                        ? "Active"
                        : "Inactive"}

                    </span>

                  </div>

                  {/* Action */}

                  <div>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(
                          admin._id
                        )
                      }
                      disabled={
                        isUpdating ||
                        actionLoading !== null
                      }
                      className={`inline-flex items-center justify-center gap-2 min-w-[150px] px-4 py-3 rounded-xl font-medium text-white transition disabled:opacity-60 disabled:cursor-not-allowed ${
                        isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >

                      {isUpdating ? (
                        <>
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />

                          Updating...
                        </>
                      ) : isActive ? (
                        <>
                          <XCircle size={17} />

                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={17} />

                          Activate
                        </>
                      )}

                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      )}

    </div>
  );
}