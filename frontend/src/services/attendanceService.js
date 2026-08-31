// ==========================
// Attendance Service
// ==========================
//
// Centralized API functions
// for Attendance module.
//
// Uses shared api.js
// ==========================

import apiRequest from "./api";

// ==========================
// Get Attendance
// ==========================

export const getAttendance = async (date) => {
  const endpoint = date
    ? `/attendance?date=${date}`
    : "/attendance";

  return apiRequest(endpoint, {
    method: "GET",
  });
};

// ==========================
// Mark Attendance
// ==========================

export const markAttendance = async (
  memberId,
  date,
  status
) => {
  return apiRequest("/attendance", {
    method: "POST",

    body: JSON.stringify({
      memberId,
      date,
      status,
    }),
  });
};

// ==========================
// Update Attendance
// ==========================

export const updateAttendance = async (
  attendanceId,
  data
) => {
  return apiRequest(
    `/attendance/${attendanceId}`,
    {
      method: "PUT",

      body: JSON.stringify(data),
    }
  );
};

// ==========================
// Delete Attendance
// ==========================

export const deleteAttendance = async (
  attendanceId
) => {
  return apiRequest(
    `/attendance/${attendanceId}`,
    {
      method: "DELETE",
    }
  );
};

// ==========================
// Default Export
// ==========================

const attendanceService = {
  getAttendance,
  markAttendance,
  updateAttendance,
  deleteAttendance,
};

export default attendanceService;