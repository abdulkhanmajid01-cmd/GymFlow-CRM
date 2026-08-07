"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>

      {/* Page Heading */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome to GymFlow CRM
        </p>

      </div>

      {/* Statistics Cards */}

      <div className="grid grid-cols-4 gap-6">

        {/* Card 1 */}

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-slate-500">
            Total Members
          </h3>

          <p className="text-4xl font-bold mt-4">
            245
          </p>

        </div>

        {/* Card 2 */}

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-slate-500">
            Active Plans
          </h3>

          <p className="text-4xl font-bold mt-4">
            180
          </p>

        </div>

        {/* Card 3 */}

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-slate-500">
            Today's Attendance
          </h3>

          <p className="text-4xl font-bold mt-4">
            95
          </p>

        </div>

        {/* Card 4 */}

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-slate-500">
            Monthly Revenue
          </h3>

          <p className="text-4xl font-bold mt-4">
            $12K
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}