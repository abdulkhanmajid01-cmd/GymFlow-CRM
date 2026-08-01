const errorHandler = require("./middleware/errorHandler");
// Import Express Framework
const express = require("express");

// Import Environment Variables
const dotenv = require("dotenv");

// Import Database Connection
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");

// Load .env file
dotenv.config();

// Create Express Application
const app = express();

// Parse Incoming JSON Data
app.use(express.json());

// Connect MongoDB Database
connectDB();

// ---------------------
// Routes
// ---------------------

// Authentication Routes
app.use("/api/auth", authRoutes);

// Member Routes
app.use("/api/members", memberRoutes);

// ---------------------
// Test Route
// ---------------------

app.get("/", (req, res) => {
  res.send("GymFlow CRM Backend is Running...");
});

// ---------------------
// Start Server
// ---------------------

const PORT = process.env.PORT || 5000;
// Global Error Handler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});