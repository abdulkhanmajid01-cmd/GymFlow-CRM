"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();

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

    const role = user.role?.toLowerCase();

    // ==========================
    // Role-Based Page Permissions
    // ==========================

    const pagePermissions = {
      "/dashboard": [
        "admin",
        "receptionist",
        "trainer",
      ],

      "/members": [
        "admin",
        "receptionist",
        "trainer",
      ],

      "/membership-plans": [
        "admin",
      ],

      "/attendance": [
        "admin",
        "receptionist",
        "trainer",
      ],

      "/payments": [
        "admin",
        "receptionist",
      ],

      "/settings": [
        "admin",
      ],
    };

    // Find matching protected page
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