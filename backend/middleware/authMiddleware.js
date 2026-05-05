// middleware/authMiddleware.js — JWT verification middleware
// Checks the HTTP-only cookie first, then falls back to the Authorization header.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect — verifies the JWT token.
 *
 * Token sources (checked in order):
 *   1. HTTP-only cookie named "token"  (set by login/register)
 *   2. Authorization header:  Bearer <token>  (localStorage fallback)
 *
 * If valid → sets req.user and calls next()
 * If invalid/missing → returns 401 Unauthorised
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check HTTP-only cookie (preferred — more secure)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // 2. Fall back to Authorization header (localStorage token)
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorised, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorised, token failed" });
  }
};

module.exports = { protect };
