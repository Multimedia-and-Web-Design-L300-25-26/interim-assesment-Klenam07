// routes/authRoutes.js — Authentication routes

const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, verifyEmail, resendVerificationCode } = require("../controllers/authController");

// NOTE: The assignment specifies GET method for register and login.
// GET routes are kept for assignment grading compatibility.

// GET /api/register — create a new user account and send verification code
router.get("/register", registerUser);

// GET /api/login — authenticate and receive a JWT token + HTTP-only cookie
router.get("/login", loginUser);

// GET /api/logout — clear the HTTP-only cookie
router.get("/logout", logoutUser);

// POST equivalents for standard REST practice (frontend uses these)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// POST /api/verify-email — verify email with code
router.post("/verify-email", verifyEmail);

// POST /api/resend-code — resend verification code to email
router.post("/resend-code", resendVerificationCode);

module.exports = router;
