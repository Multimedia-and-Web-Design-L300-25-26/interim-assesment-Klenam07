// server.js — Entry point for the Crypto App backend
// Connects to MongoDB and starts the Express server

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Load environment variables from .env BEFORE importing anything that uses them
dotenv.config();

// Import route files
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");

const app = express();

// --- CORS ---
// Allow requests from the local Vite dev server and the deployed Netlify URL.
// credentials: true is required so HTTP-only cookies are sent cross-origin.
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Required: allows cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Middleware ---
app.use(cookieParser()); // Parse HTTP-only cookies (must come before routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
// Auth routes: GET /api/register, GET /api/login, GET /api/logout
app.use("/api", authRoutes);

// User routes: GET /api/profile (protected)
app.use("/api", userRoutes);

// Crypto routes: GET /api/crypto, GET /api/crypto/gainers, GET /api/crypto/new, POST /api/crypto
app.use("/api/crypto", cryptoRoutes);

// --- Health check ---
app.get("/", (req, res) => {
  res.json({ message: "Crypto App API is running — student project" });
});

// --- Connect to MongoDB, then start server ---
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
