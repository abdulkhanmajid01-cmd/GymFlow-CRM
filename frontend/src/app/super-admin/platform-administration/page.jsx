"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  RefreshCw,
  Loader2,
  Building2,
  ShieldCheck,
  Users,
  UserCog,
  Dumbbell,
  UserRoundCheck,
  UserRoundX,
  CheckCircle2,
  XCircle,
  Mail,
} from "lucide-react";

import { getPlatformStats } from "@/services/platformService";

import { useAuth } from "../../../context/AuthContext";

export default function PlatformAdministrationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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
  // Fetch Platform Statistics
  // ==========================

  const fetchPlatformStats = async (
    showRefreshLoader = false
  ) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const result =
        await getPlatformStats();

      if (!result?.data) {
        throw new Error(
          "Platform statistics not found."
        );
      }

      setStats(result.data);
    } catch (err) {
      console.error(
        "Fetch Platform Statistics Failed:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while loading platform statistics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================
  // Initial Load
  // ==========================

  useEffect(() => {
    fetchPlatformStats();
  }, []);

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
        <div className="flex flex-col items-center gap-4 text-slate-600">
          <Loader2
            size={30}
            className="animate-spin text-blue-600"
          />

          <span className="text-sm">
            Loading platform administration...
          </span>
        </div>
      </div>
    );
  }

  // ==========================
  // Error State
  // ==========================

  if (error && !stats) {
    return (
      <div className="space-y-6">

        <Link
          href="/super-admin"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={18} />

          Back to Super Admin Dashboard
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>

        <button
          type="button"
          onClick={() => fetchPlatformStats()}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          <RefreshCw size={18} />

          Try Again
        </button>

      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-8">

      {/* ==========================
          Header
      ========================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-start gap-4">

          <Link
            href="/super-admin"
            className="mt-1 w-10 h-10 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition"
            title="Back to Super Admin Dashboard"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Platform Administration
            </h1>

            <p className="text-slate-500 mt-1">
              Monitor and manage GymFlow platform-wide resources.
            </p>
          </div>

        </div>

        {/* Refresh */}

        <button
          type="button"
          onClick={() =>
            fetchPlatformStats(true)
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            size={18}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* ==========================
          Error Banner
      ========================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ==========================
          Gym Statistics
      ========================== */}

      <div>

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Building2 size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Gym Overview
            </h2>

            <p className="text-sm text-slate-500">
              Platform-wide gym statistics.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Total Gyms */}

          <StatCard
            title="Total Gyms"
            value={stats.gyms.total}
            icon={<Building2 size={21} />}
            iconClass="bg-blue-100 text-blue-600"
          />

          {/* Active Gyms */}

          <StatCard
            title="Active Gyms"
            value={stats.gyms.active}
            icon={<CheckCircle2 size={21} />}
            iconClass="bg-emerald-100 text-emerald-600"
          />

          {/* Inactive Gyms */}

          <StatCard
            title="Inactive Gyms"
            value={stats.gyms.inactive}
            icon={<XCircle size={21} />}
            iconClass="bg-red-100 text-red-600"
          />

        </div>

      </div>

      {/* ==========================
          Gym Administrator Statistics
      ========================== */}

      <div>

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Gym Administrator Overview
            </h2>

            <p className="text-sm text-slate-500">
              Platform-wide gym administrator accounts.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Total Admins */}

          <StatCard
            title="Total Gym Admins"
            value={stats.gymAdmins.total}
            icon={<UserCog size={21} />}
            iconClass="bg-purple-100 text-purple-600"
          />

          {/* Active Admins */}

          <StatCard
            title="Active Administrators"
            value={stats.gymAdmins.active}
            icon={<UserRoundCheck size={21} />}
            iconClass="bg-emerald-100 text-emerald-600"
          />

          {/* Inactive Admins */}

          <StatCard
            title="Inactive Administrators"
            value={stats.gymAdmins.inactive}
            icon={<UserRoundX size={21} />}
            iconClass="bg-red-100 text-red-600"
          />

        </div>

      </div>

      {/* ==========================
          Members & Staff
      ========================== */}

      <div>

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <Users size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Platform Users & Resources
            </h2>

            <p className="text-sm text-slate-500">
              Platform-wide member and staff statistics.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Members */}

          <StatCard
            title="Total Members"
            value={stats.members.total}
            icon={<Users size={21} />}
            iconClass="bg-orange-100 text-orange-600"
          />

          {/* Staff */}

          <StatCard
            title="Total Staff"
            value={stats.staff.total}
            icon={<UserCog size={21} />}
            iconClass="bg-indigo-100 text-indigo-600"
          />

          {/* Trainers */}

          <StatCard
            title="Trainers"
            value={stats.staff.trainers}
            icon={<Dumbbell size={21} />}
            iconClass="bg-cyan-100 text-cyan-600"
          />

          {/* Receptionists */}

          <StatCard
            title="Receptionists"
            value={stats.staff.receptionists}
            icon={<UserRoundCheck size={21} />}
            iconClass="bg-pink-100 text-pink-600"
          />

        </div>

      </div>

      {/* ==========================
          Platform Summary
      ========================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

        <div className="px-6 py-5 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Platform Summary
              </h2>

              <p className="text-sm text-slate-500">
                Current overall GymFlow platform state.
              </p>
            </div>

          </div>

        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <SummaryRow
            icon={<Building2 size={18} />}
            label="Gym Availability"
            value={`${stats.gyms.active} active / ${stats.gyms.total} total`}
          />

          <SummaryRow
            icon={<ShieldCheck size={18} />}
            label="Administrator Availability"
            value={`${stats.gymAdmins.active} active / ${stats.gymAdmins.total} total`}
          />

          <SummaryRow
            icon={<Users size={18} />}
            label="Platform Members"
            value={`${stats.members.total} members`}
          />

          <SummaryRow
            icon={<UserCog size={18} />}
            label="Platform Staff"
            value={`${stats.staff.total} staff`}
          />

        </div>

      </div>

    </div>
  );
}

// ======================================================
// Stat Card Component
// ======================================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </p>

        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

// ======================================================
// Summary Row Component
// ======================================================

function SummaryRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">

      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center">
        {icon}
      </div>

      <div>

        <p className="text-xs uppercase tracking-wide font-medium text-slate-400">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-900 mt-1">
          {value}
        </p>

      </div>

    </div>
  );
}