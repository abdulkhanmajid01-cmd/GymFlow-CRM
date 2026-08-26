"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until AuthContext finishes loading
    if (loading) return;

    // User is not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // ==========================
    // Check User Active Status
    // ==========================
    // If user was deactivated after login
    // (JWT still valid), force logout.
    // ==========================

    if (user.isActive === false) {
      logout();
      router.replace("/login");
      return;
    }

    // ==========================
    // Check Gym Active Status
    // ==========================
    // Non-superAdmin users must belong to
    // an active gym. gymIsActive is set at
    // login time by the backend.
    // ==========================

    const role = user.role?.toLowerCase();

    if (
      role !== "superadmin" &&
      user.gymId &&
      user.gymIsActive === false
    ) {
      logout();
      router.replace("/login");
      return;
    }

    // ==========================
    // Role-Based Page Permissions
    // ==========================

    const pagePermissions = {
      // ==========================
      // Gym Dashboard
      // ==========================
      "/dashboard": [
        "admin",
        "receptionist",
        "trainer",
      ],

      // ==========================
      // Super Admin Dashboard
      // ==========================
      "/super-admin": [
        "superadmin",
      ],

      // ==========================
      // Members
      // ==========================
      "/members": [
        "admin",
        "receptionist",
        "trainer",
      ],

      // ==========================
      // Membership Plans
      // ==========================
      "/membership-plans": [
        "admin",
      ],

      // ==========================
      // Attendance
      // ==========================
      "/attendance": [
        "admin",
        "receptionist",
        "trainer",
      ],

      // ==========================
      // Payments
      // ==========================
      "/payments": [
        "admin",
        "receptionist",
      ],

      // ==========================
      // Settings
      // ==========================
      "/settings": [
        "admin",
      ],
    };

    // ==========================
    // Find Matching Protected Page
    // ==========================

    const matchedPage = Object.keys(
      pagePermissions
    ).find(
      (page) =>
        pathname === page ||
        pathname.startsWith(`${page}/`)
    );

    // ==========================
    // Check Role Permission
    // ==========================

    if (
      matchedPage &&
      !pagePermissions[matchedPage].includes(role)
    ) {
      // Super Admin should return to
      // Super Admin dashboard
      if (role === "superadmin") {
        router.replace("/super-admin");
        return;
      }

      // Gym users return to normal dashboard
      router.replace("/dashboard");
    }
  }, [
    user,
    loading,
    pathname,
    router,
  ]);

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-slate-600">
          Loading...
        </div>
      </div>
    );
  }

  // ==========================
  // Not Logged In
  // ==========================

  if (!user) {
    return null;
  }

  // ==========================
  // Inactive User
  // ==========================

  if (user.isActive === false) {
    return null;
  }

  // ==========================
  // Inactive Gym
  // ==========================

  const renderRole =
    user.role?.toLowerCase();

  if (
    renderRole !== "superadmin" &&
    user.gymId &&
    user.gymIsActive === false
  ) {
    return null;
  }

  // ==========================
  // Dashboard Layout
  // ==========================

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="flex-1 flex flex-col">

        {/* Top Navbar */}

        <Navbar />

        {/* Page Content */}

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}