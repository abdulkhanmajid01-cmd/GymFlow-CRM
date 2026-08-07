"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Wallet,
  Settings,
  LogOut,
  Dumbbell,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col shadow-xl">

      {/* Logo */}

      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">

        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">

          <Dumbbell size={24} />

        </div>

        <div>

          <h1 className="text-2xl font-bold">
            GymFlow
          </h1>

          <p className="text-xs text-slate-400">
            CRM System
          </p>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6 space-y-2">

        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 font-medium"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          href="/members"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
        >
          <Users size={20} />
          Members
        </Link>

        <Link
          href="/membership-plans"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
        >
          <CreditCard size={20} />
          Membership Plans
        </Link>

        <Link
          href="/attendance"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
        >
          <CalendarCheck size={20} />
          Attendance
        </Link>

        <Link
          href="/payments"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
        >
          <Wallet size={20} />
          Payments
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
        >
          <Settings size={20} />
          Settings
        </Link>

      </nav>

      {/* User */}

      <div className="border-t border-slate-800 p-5">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">

            A

          </div>

          <div>

            <h3 className="font-semibold">
              Abdul Khan
            </h3>

            <p className="text-sm text-slate-400">
              Gym Admin
            </p>

          </div>

        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition py-3 rounded-xl">

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}