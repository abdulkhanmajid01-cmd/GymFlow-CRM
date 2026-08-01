const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/authController");

const protect = require("../middleware/protect");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get All Users (Protected)
router.get("/users", protect, getAllUsers);

module.exports = router;