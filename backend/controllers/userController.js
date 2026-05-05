// controllers/userController.js — Handles user profile requests

/**
 * getUserProfile — GET /api/profile (protected)
 *
 * Returns the logged-in user's name and email.
 * req.user is set by the protect middleware (authMiddleware.js) — it only
 * reaches here if the JWT token in the Authorization header is valid.
 */
const getUserProfile = async (req, res) => {
  if (req.user) {
    return res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};

module.exports = { getUserProfile };
