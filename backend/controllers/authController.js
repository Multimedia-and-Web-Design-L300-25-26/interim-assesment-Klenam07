// controllers/authController.js — Handles user registration, login, logout, and email verification

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../services/emailService");

// Utility: Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Cookie options — secure + sameSite='none' required in production for cross-origin cookies
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});

/**
 * registerUser — GET /api/register
 *
 * Reads from req.body first, falls back to req.query (supports JSON body and query params).
 * Generates a verification code and sends it to the user's email.
 */
const registerUser = async (req, res) => {
  const name = req.body.name || req.query.name;
  const email = req.body.email || req.query.email;
  const password = req.body.password || req.query.password;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    // Generate verification code (expires in 10 minutes)
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpiry,
      isEmailVerified: false,
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationCode);
    
    if (!emailResult.success) {
      return res.status(500).json({
        message: "Account created but verification email could not be sent",
        error: emailResult.error,
      });
    }

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Account created. Verification code sent to your email.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during registration", error: error.message });
  }
};

/**
 * verifyEmail — POST /api/verify-email
 *
 * Verifies the code sent to the user's email and marks the email as verified.
 */
const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Please provide email and verification code" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if code matches and hasn't expired
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Mark email as verified and clear verification code
    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);
    res.cookie("token", token, getCookieOptions());

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during verification", error: error.message });
  }
};

/**
 * resendVerificationCode — POST /api/resend-code
 *
 * Resends the verification code to the user's email.
 */
const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide email" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationCode);

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Could not send verification email",
        error: emailResult.error,
      });
    }

    return res.json({
      message: "Verification code resent to your email",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * loginUser — GET /api/login
 *
 * Verifies credentials, signs a JWT, sets it as an HTTP-only cookie,
 * and also returns it in the response body.
 */
const loginUser = async (req, res) => {
  const email = req.body.email || req.query.email;
  const password = req.body.password || req.query.password;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.cookie("token", token, getCookieOptions());

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

/**
 * logoutUser — GET /api/logout
 *
 * Clears the HTTP-only cookie. The frontend should also clear localStorage.
 */
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // immediately expire the cookie
  });
  return res.json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser, verifyEmail, resendVerificationCode };
