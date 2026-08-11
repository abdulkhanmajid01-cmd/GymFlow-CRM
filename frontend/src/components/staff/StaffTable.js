"use client";

import {
  Pencil,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";

export default function StaffTable({
  staff,
  onEdit,
  onDelete,
}) {
  if (!staff || staff.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <p className="text-slate-500">
          No staff members found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      {/* Table Header */}

      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">
          Staff Members
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Manage your gym receptionists and trainers.
        </p>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Staff Member
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Email
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Role
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                Status
              </th>

              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {staff.map((member) => {

              const role =
                member.role?.toLowerCase();

              const isActive =
                member.isActive !== false;

              return (
                <tr
                  key={member._id || member.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >

                  {/* Staff */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                        {member.fullName
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-slate-800">
                          {member.fullName}
                        </p>

                        <p className="text-xs text-slate-400">
                          Staff ID:{" "}
                          {(
                            member._id ||
                            member.id
                          )?.slice(-6)}
                        </p>
                      </div>

                    </div>

                  </td>

                  {/* Email */}

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {member.email}
                  </td>

                  {/* Role */}

                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        role === "trainer"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {role === "trainer"
                        ? "Trainer"
                        : "Receptionist"}
                    </span>

                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">

                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                        <UserCheck size={16} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm text-red-600 font-medium">
                        <UserX size={16} />
                        Inactive
                      </span>
                    )}

                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">

                    <div className="flex justify-end items-center gap-2">

                      {/* Edit */}

                      <button
                        type="button"
                        onClick={() =>
                          onEdit(member)
                        }
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                        title="Edit Staff"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(member)
                        }
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                        title="Delete Staff"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}