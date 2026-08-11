"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Wallet,
  Settings,
  LogOut,
  Dumbbell,
  UserCog,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const role = user?.role?.toLowerCase() || "receptionist";

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "receptionist", "trainer"],
    },
    {
      name: "Members",
      href: "/members",
      icon: Users,
      roles: ["admin", "receptionist", "trainer"],
    },
    {
      name: "Membership Plans",
      href: "/membership-plans",
      icon: CreditCard,
      roles: ["admin"],
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: CalendarCheck,
      roles: ["admin", "receptionist", "trainer"],
    },
    {
      name: "Payments",
      href: "/payments",
      icon: Wallet,
      roles: ["admin", "receptionist"],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["admin"],
    },

    {
  name: "Staff Management",
  href: "/staff",
  icon: UserCog,
  roles: ["admin"],
},
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  const getRoleName = () => {
    if (role === "admin") return "Gym Admin";
    if (role === "receptionist") return "Receptionist";
    if (role === "trainer") return "Trainer";

    return "Staff";
  };

  const getInitial = () => {
    return user?.fullName?.charAt(0)?.toUpperCase() || "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col shadow-xl">

      {/* ==========================
          Logo
      ========================== */}

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

      {/* ==========================
          Navigation
      ========================== */}

      <nav className="flex-1 px-4 py-6 space-y-2">

        {visibleMenuItems.map((item) => {

          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}

      </nav>

      {/* ==========================
          User
      ========================== */}

      <div className="border-t border-slate-800 p-5">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">
            {getInitial()}
          </div>

          <div className="min-w-0">

            <h3 className="font-semibold truncate">
              {user?.fullName || "User"}
            </h3>

            <p className="text-sm text-slate-400 capitalize">
              {getRoleName()}
            </p>

          </div>

        </div>

        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition py-3 rounded-xl"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}