// routes/userRoutes.js — User profile routes

const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/profile — returns the logged-in user's name and email
// protect middleware runs first: it verifies the JWT token before the controller runs
router.get("/profile", protect, getUserProfile);

module.exports = router;
