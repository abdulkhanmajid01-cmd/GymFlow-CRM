"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { getAllMembers } from "../../services/memberService";

export default function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  const [showNotifications, setShowNotifications] =
    useState(false);

  // ==========================
  // Check Membership Expiry
  // ==========================
  const checkMembershipExpiry = async () => {
    try {
      const response = await getAllMembers();

      const members = response.data || [];

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const expiryNotifications = [];

      members.forEach((member) => {
        if (!member.membershipExpiryDate) return;

        const expiryDate = new Date(
          member.membershipExpiryDate
        );

        expiryDate.setHours(0, 0, 0, 0);

        const difference =
          expiryDate.getTime() -
          today.getTime();

        const daysRemaining = Math.ceil(
          difference /
            (1000 * 60 * 60 * 24)
        );

        // ==========================
        // Expired
        // ==========================
        if (daysRemaining < 0) {
          expiryNotifications.push({
            id: `${member._id}-expired`,
            memberId: member._id,
            memberName: member.fullName,
            daysRemaining,
            type: "expired",
            message:
              "Membership has expired.",
          });

          return;
        }

        // ==========================
        // Expires Today
        // ==========================
        if (daysRemaining === 0) {
          expiryNotifications.push({
            id: `${member._id}-today`,
            memberId: member._id,
            memberName: member.fullName,
            daysRemaining: 0,
            type: "urgent",
            message:
              "Membership expires today.",
          });

          return;
        }

        // ==========================
        // 1 Day Before
        // ==========================
        if (daysRemaining === 1) {
          expiryNotifications.push({
            id: `${member._id}-1`,
            memberId: member._id,
            memberName: member.fullName,
            daysRemaining: 1,
            type: "urgent",
            message:
              "Membership expires tomorrow.",
          });

          return;
        }

        // ==========================
        // 3 Days Before
        // ==========================
        if (daysRemaining <= 3) {
          expiryNotifications.push({
            id: `${member._id}-3`,
            memberId: member._id,
            memberName: member.fullName,
            daysRemaining,
            type: "warning",
            message:
              `Membership expires in ${daysRemaining} days.`,
          });

          return;
        }

        // ==========================
        // 7 Days Before
        // ==========================
        if (daysRemaining <= 7) {
          expiryNotifications.push({
            id: `${member._id}-7`,
            memberId: member._id,
            memberName: member.fullName,
            daysRemaining,
            type: "warning",
            message:
              `Membership expires in ${daysRemaining} days.`,
          });
        }
      });

      setNotifications(
        expiryNotifications
      );
    } catch (error) {
      console.error(
        "Failed to load expiry notifications:",
        error
      );
    }
  };

  // ==========================
  // Initial Load
  // ==========================
  useEffect(() => {
    checkMembershipExpiry();

    // Check again every 5 minutes
    const interval = setInterval(
      checkMembershipExpiry,
      5 * 60 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="flex items-center justify-between">
      {/* ==========================
          Page Title
      ========================== */}

      <h2 className="text-2xl font-bold text-slate-800">
        Dashboard
      </h2>

      {/* ==========================
          Right Section
      ========================== */}

      <div className="flex items-center gap-5">

        {/* ==========================
            Search
        ========================== */}

        <input
          type="text"
          placeholder="Search..."
          className="border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* ==========================
            Notifications
        ========================== */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            className="relative w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition"
          >
            <span className="text-xl">
              🔔
            </span>

            {/* Notification Count */}

            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-semibold">
                {notifications.length}
              </span>
            )}
          </button>

          {/* ==========================
              Notification Dropdown
          ========================== */}

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-96 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">

              {/* Header */}

              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">

                <h3 className="font-semibold text-slate-800">
                  Membership Notifications
                </h3>

                {notifications.length > 0 && (
                  <span className="text-xs text-red-600 font-medium">
                    {notifications.length} Alert
                    {notifications.length > 1
                      ? "s"
                      : ""}
                  </span>
                )}

              </div>

              {/* Notifications */}

              {notifications.length === 0 ? (
                <div className="px-5 py-8 text-center">

                  <div className="text-3xl mb-2">
                    ✅
                  </div>

                  <p className="font-medium text-slate-700">
                    No membership alerts
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    All memberships are currently
                    up to date.
                  </p>

                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">

                  {notifications.map(
                    (notification) => (
                      <button
                        type="button"
                        key={notification.id}
                        onClick={() => {
                          router.push(
                            `/members?memberId=${notification.memberId}`
                          );

                          setShowNotifications(false);
                        }}
                        className={`w-full text-left px-4 py-4 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer ${
                          notification.type ===
                          "expired"
                            ? "bg-red-50"
                            : notification.type ===
                              "urgent"
                            ? "bg-orange-50"
                            : ""
                        }`}
                      >

                        <div className="flex gap-3">

                          {/* Icon */}

                          <div className="text-xl">
                            {notification.type ===
                            "expired"
                              ? "🔴"
                              : notification.type ===
                                "urgent"
                              ? "⚠️"
                              : "🟠"}
                          </div>

                          {/* Content */}

                          <div className="flex-1">

                            <p className="font-semibold text-slate-800">
                              {notification.memberName}
                            </p>

                            <p
                              className={`text-sm mt-1 ${
                                notification.type ===
                                "expired"
                                  ? "text-red-600"
                                  : notification.type ===
                                    "urgent"
                                  ? "text-orange-600"
                                  : "text-slate-600"
                              }`}
                            >
                              {notification.message}
                            </p>

                          </div>

                        </div>

                      </button>
                    )
                  )}

                </div>
              )}

            </div>
          )}

        </div>

        {/* ==========================
            Profile
        ========================== */}

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            A
          </div>

          <div>
            <p className="font-semibold text-sm">
              Admin
            </p>

            <p className="text-xs text-slate-500">
              Gym Admin
            </p>
          </div>

        </div>

      </div>
    </header>
  );
}