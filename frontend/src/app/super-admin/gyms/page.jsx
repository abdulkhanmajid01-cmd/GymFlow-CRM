"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Building2,
  Plus,
  ArrowRight,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

export default function GymsPage() {
  const router = useRouter();

  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================
  // Fetch Gyms
  // ==========================

  const fetchGyms = async () => {
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
        "http://localhost:5000/api/gyms",
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
          result.message || "Failed to fetch gyms."
        );
      }

      setGyms(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Failed to fetch gyms:", err);

      setError(
        err.message ||
          "Something went wrong while loading gyms."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Initial Load
  // ==========================

  useEffect(() => {
    fetchGyms();
  }, []);

  // ==========================
  // Back
  // ==========================

  const handleBack = () => {
    router.push("/super-admin");
  };

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-600">
          <Loader2
            size={28}
            className="animate-spin text-blue-600"
          />

          <span className="text-sm">
            Loading gyms...
          </span>
        </div>
      </div>
    );
  }

  // ==========================
  // Statistics
  // ==========================

  const totalGyms = gyms.length;

  const activeGyms = gyms.filter(
    (gym) => gym.isActive === true
  ).length;

  const inactiveGyms = gyms.filter(
    (gym) => gym.isActive !== true
  ).length;

  return (
    <div className="space-y-8">

      {/* ==========================
          Header
      ========================== */}

      <div className="flex flex-col gap-5">

        <div className="flex items-start gap-4">

          {/* Back */}

          <button
            type="button"
            onClick={handleBack}
            className="mt-1 w-10 h-10 shrink-0 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Title */}

          <div className="flex-1">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Building2 size={25} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Gyms
                </h1>

                <p className="text-slate-500 mt-1">
                  Manage all gyms registered on GymFlow.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Actions */}

        <div className="flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={fetchGyms}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-all duration-200"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <Link
            href="/super-admin/gyms/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
          >
            <Plus size={19} />
            Create Gym
          </Link>

        </div>

      </div>

      {/* ==========================
          Error
      ========================== */}

      {error && (
        <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

          <p className="text-sm">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchGyms}
            className="shrink-0 text-sm font-medium underline hover:no-underline"
          >
            Retry
          </button>

        </div>
      )}

      {/* ==========================
          Statistics
      ========================== */}

      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Gyms
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {totalGyms}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Active Gyms
            </p>

            <p className="text-3xl font-bold text-emerald-600 mt-2">
              {activeGyms}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Inactive Gyms
            </p>

            <p className="text-3xl font-bold text-red-600 mt-2">
              {inactiveGyms}
            </p>
          </div>

        </div>
      )}

      {/* ==========================
          Empty State
      ========================== */}

      {!error && gyms.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
            <Building2 size={30} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            No gyms found
          </h2>

          <p className="mt-2 text-slate-500">
            Create your first gym to start using GymFlow.
          </p>

          <Link
            href="/super-admin/gyms/create"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200"
          >
            <Plus size={18} />
            Create First Gym
          </Link>

        </div>
      )}

      {/* ==========================
          Gym Cards
      ========================== */}

      {!error && gyms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {gyms.map((gym, index) => {

            const gymId = gym?._id;

            if (!gymId) {
              return null;
            }

            return (
              <Link
                key={gymId}
                href={`/super-admin/gyms/${gymId}`}
                className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{
                  animationDelay: `${index * 80}ms`,
                }}
              >

                {/* Card Header */}

                <div className="flex items-start justify-between">

                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Building2 size={24} />
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300"
                  />

                </div>

                {/* Gym Info */}

                <div className="mt-5">

                  <h2 className="text-xl font-semibold text-slate-900">
                    {gym.name}
                  </h2>

                  {gym.email && (
                    <p className="text-sm text-slate-500 mt-2 truncate">
                      {gym.email}
                    </p>
                  )}

                  {gym.phoneNumber && (
                    <p className="text-sm text-slate-500 mt-1">
                      {gym.phoneNumber}
                    </p>
                  )}

                  {gym.address && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {gym.address}
                    </p>
                  )}

                </div>

                {/* Status */}

                <div className="mt-5 flex items-center justify-between">

                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      gym.isActive === true
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        gym.isActive === true
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    />

                    {gym.isActive === true
                      ? "Active"
                      : "Inactive"}

                  </span>

                  <span className="text-xs text-slate-400 group-hover:text-blue-600 transition">
                    View Details
                  </span>

                </div>

              </Link>
            );
          })}

        </div>
      )}

    </div>
  );
}