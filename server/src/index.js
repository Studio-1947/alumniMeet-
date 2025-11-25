const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON bodies
app.use(express.json());
// Parse cookies for optional token transport
app.use(cookieParser());

// Configure CORS to allow one or more frontend origins.
// Set `CLIENT_ORIGIN` to a single origin or a comma-separated list (e.g. "http://localhost:3000,http://localhost:3001").
const rawClientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const allowedOrigins = rawClientOrigin
  .split(",")
  .map((s) => s.trim())
  .map((s) => {
    try {
      return new URL(s).origin;
    } catch (e) {
      return s;
    }
  })
  .filter(Boolean);

// Ensure localhost is always allowed for development convenience
if (!allowedOrigins.includes("http://localhost:3000")) {
  allowedOrigins.push("http://localhost:3000");
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: Origin not allowed"), false);
    },
    credentials: true,
  })
);

// Simple health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
