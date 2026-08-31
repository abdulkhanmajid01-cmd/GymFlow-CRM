"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  Users,
  Clock3,
  AlertCircle,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import attendanceService from "@/services/attendanceService";
import { getAllMembers } from "@/services/memberService";

// ===============================
// Karachi Date Helper
// ===============================

const getKarachiDate = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
  }).format(new Date());
};

// ===============================
// Attendance Page
// ===============================

export default function AttendancePage() {
  // ===============================
  // State
  // ===============================

  const [selectedDate, setSelectedDate] =
    useState(getKarachiDate());

  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loadingMembers, setLoadingMembers] =
    useState(true);

  const [loadingAttendance, setLoadingAttendance] =
    useState(true);

  const [markingId, setMarkingId] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // Latest attendance request id.
  // Stale responses (from a previously
  // selected date) are ignored so a
  // slower old request cannot overwrite
  // the currently displayed date.
  const requestIdRef = useRef(0);

  // Success message timer. Kept in a ref
  // so a late timeout cannot clear a
  // newer success/error message.
  const successTimerRef = useRef(null);

  // ===============================
  // Fetch Members
  // ===============================

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      setError("");

      const response = await getAllMembers();

      setMembers(response.data || []);
    } catch (err) {
      console.error(
        "Fetch Members Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load members."
      );
    } finally {
      setLoadingMembers(false);
    }
  };

  // ===============================
  // Fetch Attendance
  // ===============================

  const fetchAttendance = async (date) => {
    const requestId = ++requestIdRef.current;

    try {
      setLoadingAttendance(true);
      setError("");

      const data =
        await attendanceService.getAttendance(
          date
        );

      if (
        requestIdRef.current === requestId
      ) {
        setAttendance(data?.data || []);
      }
    } catch (err) {
      console.error(
        "Fetch Attendance Error:",
        err
      );

      if (
        requestIdRef.current === requestId
      ) {
        setError(
          err.message ||
            "Failed to load attendance."
        );
      }
    } finally {
      if (
        requestIdRef.current === requestId
      ) {
        setLoadingAttendance(false);
      }
    }
  };

  // ===============================
  // Initial Members Fetch
  // ===============================

  useEffect(() => {
    fetchMembers();
  }, []);

  // ===============================
  // Attendance Date Change
  // ===============================

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  // ===============================
  // Cleanup Success Timer
  // ===============================

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, []);

  // ===============================
  // Mark or Update Attendance
  // ===============================

  const markAttendance = async (
    memberId,
    status
  ) => {
    try {
      setMarkingId(memberId);

      setError("");
      setSuccess("");

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }

      const existingRecord =
        attendanceMap[String(memberId)];

      // Same status already recorded: nothing to do
      if (
        existingRecord &&
        existingRecord.status === status
      ) {
        return;
      }

      if (existingRecord) {
        // Correct a previously marked record
        await attendanceService.updateAttendance(
          existingRecord._id,
          { status }
        );

        setSuccess(
          `Attendance updated to ${status}.`
        );
      } else {
        await attendanceService.markAttendance(
          memberId,
          selectedDate,
          status
        );

        setSuccess(
          `Attendance marked as ${status}.`
        );
      }

      // Refresh attendance list
      await fetchAttendance(selectedDate);

      // Remove success message
      successTimerRef.current = setTimeout(
        () => {
          setSuccess("");
          successTimerRef.current = null;
        },
        2500
      );
    } catch (err) {
      console.error(
        "Mark Attendance Error:",
        err
      );

      setError(
        err.message ||
          "Failed to mark attendance."
      );
    } finally {
      setMarkingId(null);
    }
  };

  // ===============================
  // Clear / Delete Attendance
  // ===============================

  const deleteAttendance = async (
    memberId,
    recordId
  ) => {
    try {
      setDeletingId(memberId);

      setError("");
      setSuccess("");

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }

      await attendanceService.deleteAttendance(
        recordId
      );

      // Remove the record from local state
      // so the UI reflects that the member's
      // attendance has been cleared for the
      // selected date.
      setAttendance((prev) =>
        prev.filter((record) => {
          const id =
            record.memberId?._id ||
            record.memberId;

          return String(id) !== String(memberId);
        })
      );

      setSuccess("Attendance cleared.");

      successTimerRef.current = setTimeout(
        () => {
          setSuccess("");
          successTimerRef.current = null;
        },
        2500
      );
    } catch (err) {
      console.error(
        "Delete Attendance Error:",
        err
      );

      setError(
        err.message ||
          "Failed to clear attendance."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ===============================
  // Create Attendance Lookup
  // ===============================

  const attendanceMap = useMemo(() => {
    const map = {};

    attendance.forEach((record) => {
      const memberId =
        record.memberId?._id ||
        record.memberId;

      if (memberId) {
        map[String(memberId)] = record;
      }
    });

    return map;
  }, [attendance]);

  // ===============================
  // Search Members
  // ===============================

  const filteredMembers = useMemo(() => {
    const search =
      searchTerm
        .trim()
        .toLowerCase();

    if (!search) {
      return members;
    }

    return members.filter((member) => {
      return (
        member.fullName
          ?.toLowerCase()
          .includes(search) ||
        member.memberId
          ?.toLowerCase()
          .includes(search) ||
        member.phoneNumber
          ?.toLowerCase()
          .includes(search) ||
        member.email
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [members, searchTerm]);

  // ===============================
  // Attendance Statistics
  // ===============================

  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;

    attendance.forEach((record) => {
      if (record.status === "present") {
        present++;
      }

      if (record.status === "absent") {
        absent++;
      }
    });

    return {
      present,
      absent,
      notMarked:
        Math.max(
          members.length -
            present -
            absent,
          0
        ),
      total: members.length,
    };
  }, [attendance, members]);

  // ===============================
  // Loading
  // ===============================

  const loading =
    loadingMembers ||
    loadingAttendance;

  // ===============================
  // Render
  // ===============================

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* ==========================
            Header
        ========================== */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Attendance
            </h1>

            <p className="mt-1 text-slate-500">
              Manage daily member attendance.
            </p>
          </div>

          {/* Date Picker */}

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <CalendarDays
              size={19}
              className="text-blue-600"
            />

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            />

          </div>

        </div>

        {/* ==========================
            Error
        ========================== */}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">

            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>

          </div>
        )}

        {/* ==========================
            Success
        ========================== */}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">

            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <span>{success}</span>

          </div>
        )}

        {/* ==========================
            Statistics
        ========================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Members
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Users size={21} />
              </div>

            </div>

          </div>

          {/* Present */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Present
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {stats.present}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>

            </div>

          </div>

          {/* Absent */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Absent
                </p>

                <p className="mt-2 text-2xl font-bold text-red-600">
                  {stats.absent}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <XCircle size={21} />
              </div>

            </div>

          </div>

          {/* Not Marked */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Not Marked
                </p>

                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {stats.notMarked}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Clock3 size={21} />
              </div>

            </div>

          </div>

        </div>

        {/* ==========================
            Attendance Card
        ========================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Toolbar */}

          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="font-semibold text-slate-900">
                Member Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Attendance for {selectedDate}
              </p>
            </div>

            {/* Search */}

            <div className="relative w-full md:w-80">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Search member..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* ==========================
              Loading
          ========================== */}

          {loading ? (
            <div className="flex items-center justify-center px-6 py-16">

              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            </div>
          ) : members.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <Users
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-medium text-slate-700">
                No members in your gym
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add members first to start
                tracking attendance.
              </p>

            </div>

          ) : filteredMembers.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <Search
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-medium text-slate-700">
                No members match your search
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try a different name, ID, phone
                number or email.
              </p>

            </div>

          ) : (

            /* ==========================
               Table
            ========================== */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Member
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Member ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredMembers.map(
                    (member) => {

                      const record =
                        attendanceMap[
                          String(member._id)
                        ];

                      const status =
                        record?.status ||
                        null;

                      const isMarking =
                        markingId ===
                        member._id;

                      const isDeleting =
                        deletingId ===
                        member._id;

                      const isWorking =
                        isMarking ||
                        isDeleting;

                      return (
                        <tr
                          key={member._id}
                          className="transition hover:bg-slate-50"
                        >

                          {/* Member */}

                          <td className="px-6 py-4">

                            <div>
                              <p className="font-medium text-slate-900">
                                {member.fullName}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {member.phoneNumber ||
                                  member.email ||
                                  "—"}
                              </p>
                            </div>

                          </td>

                          {/* Member ID */}

                          <td className="px-6 py-4">

                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                              {member.memberId ||
                                "—"}
                            </span>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-4">

                            {status ===
                            "present" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                                <CheckCircle2
                                  size={14}
                                />

                                Present

                              </span>
                            ) : status ===
                              "absent" ? (

                              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">

                                <XCircle
                                  size={14}
                                />

                                Absent

                              </span>
                            ) : (

                              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                Not Marked
                              </span>

                            )}

                          </td>

                          {/* Action */}

                          <td className="px-6 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                disabled={
                                  isWorking ||
                                  status ===
                                    "present"
                                }
                                onClick={() =>
                                  markAttendance(
                                    member._id,
                                    "present"
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                              >

                                <CheckCircle2
                                  size={15}
                                />

                                Present

                              </button>

                              <button
                                type="button"
                                disabled={
                                  isWorking ||
                                  status ===
                                    "absent"
                                }
                                onClick={() =>
                                  markAttendance(
                                    member._id,
                                    "absent"
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                              >

                                <XCircle
                                  size={15}
                                />

                                Absent

                              </button>

                              {record && (
                                <button
                                  type="button"
                                  disabled={isWorking}
                                  onClick={() =>
                                    deleteAttendance(
                                      member._id,
                                      record._id
                                    )
                                  }
                                  title="Clear attendance"
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                  <Trash2 size={15} />

                                  Clear

                                </button>
                              )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}