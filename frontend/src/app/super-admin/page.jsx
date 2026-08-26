"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Building2,
  Users,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [gyms, setGyms] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Auth Guard
  // ==========================
  // Redirect if not authenticated or
  // not a superAdmin.
  // ==========================

  useEffect(() => {
    if (loading) return;

    if (
      !user ||
      user.role?.toLowerCase() !== "superadmin"
    ) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // ==========================
  // Fetch Gyms
  // ==========================

  const fetchGyms = async () => {
    try {
      setLoadingData(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        "http://localhost:5000/api/gyms",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch gyms."
        );
      }

      setGyms(data.data || []);
    } catch (err) {
      console.error("Failed to fetch gyms:", err);

      setError(
        err.message || "Unable to load gym data."
      );
    } finally {
      setLoadingData(false);
    }
  };

  // ==========================
  // Load Data
  // ==========================

  useEffect(() => {
    fetchGyms();
  }, []);

  // ==========================
  // Statistics
  // ==========================

  const totalGyms = gyms.length;

  const activeGyms = gyms.filter(
    (gym) => gym.isActive
  ).length;

  const inactiveGyms = gyms.filter(
    (gym) => !gym.isActive
  ).length;

  // ==========================
  // Loading Auth / Unauthorized
  // ==========================

  if (
    loading ||
    !user ||
    user.role?.toLowerCase() !== "superadmin"
  ) {
    return null;
  }

  return (
    <div className="space-y-8">

      {/* ==========================
          Header
      ========================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Super Admin Dashboard
              </h1>

              <p className="text-slate-500 mt-1">
                Manage gyms and GymFlow platform administration.
              </p>
            </div>

          </div>
        </div>

        {/* Create Gym */}

        <Link
          href="/super-admin/gyms/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          <Plus size={19} />
          Create Gym
        </Link>

      </div>

      {/* ==========================
          Error
      ========================== */}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <XCircle
              size={20}
              className="text-red-600"
            />

            <p className="text-sm text-red-700">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={fetchGyms}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
          >
            <RefreshCw size={16} />
            Retry
          </button>

        </div>
      )}

      {/* ==========================
          Platform Statistics
      ========================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Gyms */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Building2 size={24} />
            </div>

            <span className="text-xs font-medium text-slate-400 uppercase">
              Total
            </span>

          </div>

          <div className="mt-5">

            <p className="text-sm text-slate-500">
              Total Gyms
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              {loadingData ? "..." : totalGyms}
            </h2>

          </div>

        </div>

        {/* Active Gyms */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>

            <span className="text-xs font-medium text-emerald-600 uppercase">
              Active
            </span>

          </div>

          <div className="mt-5">

            <p className="text-sm text-slate-500">
              Active Gyms
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              {loadingData ? "..." : activeGyms}
            </h2>

          </div>

        </div>

        {/* Inactive Gyms */}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <XCircle size={24} />
            </div>

            <span className="text-xs font-medium text-red-600 uppercase">
              Inactive
            </span>

          </div>

          <div className="mt-5">

            <p className="text-sm text-slate-500">
              Inactive Gyms
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              {loadingData ? "..." : inactiveGyms}
            </h2>

          </div>

        </div>

      </div>

      {/* ==========================
          Platform Overview
      ========================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Gyms */}

        <Link
          href="/super-admin/gyms"
          className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
        >

          <div className="flex items-start justify-between">

            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Building2 size={24} />
            </div>

            <ArrowRight
              size={20}
              className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition"
            />

          </div>

          <div className="mt-5">

            <h2 className="text-lg font-semibold text-slate-900">
              Gym Management
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Create, view, update and manage all gyms registered on GymFlow.
            </p>

          </div>

        </Link>

        {/* Gym Administrators */}
    

         <Link
          href="/super-admin/gym-administrators"
          className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
        >

          <div className="flex items-start justify-between">

            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users size={24} />
            </div>

            <ArrowRight
              size={20}
              className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition"
            />

          </div>

          <div className="mt-5">

            <h2 className="text-lg font-semibold text-slate-900">
              Gym Administrators
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Gym administrator accounts will be created during gym setup.
            </p>

          </div>

         </Link>

      </div>

      {/* ==========================
          Platform Administration
      ========================== */}

      <Link
        href="/super-admin/platform-administration"
        className="block bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-slate-300 hover:shadow-md transition cursor-pointer"
        onClick={(e) => {
          const target = e.target.closest("button, a");

          if (target && target !== e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <ShieldCheck size={21} />
          </div>

          <div>

            <h2 className="font-semibold text-slate-900">
              Platform Administration
            </h2>

            <p className="text-sm text-slate-500">
              Super Admin has platform-level access to GymFlow.
            </p>

          </div>

        </div>

        <div className="mt-6 border-t border-slate-100 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <p className="text-sm text-slate-500">
              {loadingData
                ? "Loading platform data..."
                : `GymFlow currently has ${totalGyms} registered ${
                    totalGyms === 1 ? "gym" : "gyms"
                  }.`}
            </p>

          </div>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fetchGyms();
              }}
              disabled={loadingData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  loadingData
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/super-admin/gyms");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Manage Gyms
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </Link>

    </div>
  );
}