// models/User.js — Mongoose schema for registered users

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes leading/trailing spaces
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // prevents two users registering with the same email
      lowercase: true, // always store emails in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    verificationCode: {
      type: String,
      default: null,
    },
    verificationCodeExpiry: {
      type: Date,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

// --- Pre-save hook ---
// Runs automatically before every .save() call.
// Hashes the password so we never store plain text passwords in MongoDB.
userSchema.pre("save", async function (next) {
  // Only hash if the password field was actually changed (avoid re-hashing on profile updates)
  if (!this.isModified("password")) return next();

  // 10 salt rounds is the recommended balance of security and speed
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// --- Instance method ---
// Called at login to check if the entered password matches the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
