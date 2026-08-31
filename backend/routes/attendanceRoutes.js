// Import Express
const express = require("express");

// Create Router
const router = express.Router();

// Import Authentication Middleware
const protect = require("../middleware/protect");

// Import Role-Based Authorization Middleware
const authorize = require("../middleware/authorize");

// Import Attendance Controllers
const {
  markAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

// ==========================
// Get All Attendance
// ==========================
// GET /api/attendance
//
// Admin:
// Can view all attendance
// inside their gym.
//
// Receptionist:
// Can view all attendance
// inside their gym.
//
// Trainer:
// Can view attendance only
// for assigned members.
//
// ==========================

router.get(
  "/",
  protect,
  authorize(
    "admin",
    "receptionist",
    "trainer"
  ),
  getAllAttendance
);

// ==========================
// Mark Attendance
// ==========================
// POST /api/attendance
//
// Admin:
// Can mark attendance for
// any member in their gym.
//
// Receptionist:
// Can mark attendance for
// any member in their gym.
//
// Trainer:
// Can mark attendance only
// for assigned members.
//
// ==========================

router.post(
  "/",
  protect,
  authorize(
    "admin",
    "receptionist",
    "trainer"
  ),
  markAttendance
);

// ==========================
// Update Attendance
// ==========================
// PUT /api/attendance/:id
//
// Admin:
// Can update attendance.
//
// Receptionist:
// Can update attendance.
//
// Trainer:
// Can update only attendance
// of assigned members.
//
// ==========================

router.put(
  "/:id",
  protect,
  authorize(
    "admin",
    "receptionist",
    "trainer"
  ),
  updateAttendance
);

// ==========================
// Delete Attendance
// ==========================
// DELETE /api/attendance/:id
//
// Admin:
// Can delete attendance.
//
// Receptionist:
// Can delete attendance.
//
// Trainer:
// Can delete only attendance
// of assigned members.
//
// ==========================

router.delete(
  "/:id",
  protect,
  authorize(
    "admin",
    "receptionist",
    "trainer"
  ),
  deleteAttendance
);

// ==========================
// Export Router
// ==========================

module.exports = router;