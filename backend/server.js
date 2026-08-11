// Import Error Handler
const errorHandler = require("./middleware/errorHandler");

// Import Express Framework
const express = require("express");

// Import CORS
const cors = require("cors");

// Import Environment Variables
const dotenv = require("dotenv");

// Import Database Connection
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");
const membershipPlanRoutes = require("./routes/membershipPlanRoutes");
const membershipReminderRoutes = require("./routes/membershipReminderRoutes");
const staffRoutes = require("./routes/staffRoutes");

// Load .env file
dotenv.config();

// Connect MongoDB Database
connectDB();

// Create Express Application
const app = express();

// ---------------------
// Middlewares
// ---------------------

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Parse Incoming JSON Data
app.use(express.json());

// ---------------------
// Routes
// ---------------------

// Authentication Routes
app.use("/api/auth", authRoutes);

// Member Routes
app.use("/api/members", memberRoutes);

// Membership Plan Routes
app.use(
  "/api/membership-plans",
  membershipPlanRoutes
);

// Membership Reminder Routes
app.use(
  "/api/membership-reminders",
  membershipReminderRoutes
);

// Staff Routes
app.use(
  "/api/staff",
  staffRoutes
);

// ---------------------
// Test Route
// ---------------------

app.get("/", (req, res) => {
  res.send(
    "GymFlow CRM Backend is Running..."
  );
});

// ---------------------
// Global Error Handler
// ---------------------

app.use(errorHandler);

// ---------------------
// Start Server
// ---------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server is running on port ${PORT}`
  );
});