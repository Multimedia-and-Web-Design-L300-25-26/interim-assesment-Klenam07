// models/Crypto.js — Mongoose schema for cryptocurrency entries

const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cryptocurrency name is required"],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, "Symbol is required (e.g. BTC, ETH)"],
      unique: true, // prevents duplicate symbols (e.g. two BTC entries)
      uppercase: true, // always store symbols in uppercase
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      default: "", // URL to the coin's logo image (optional)
    },
    change24h: {
      type: Number,
      default: 0, // percentage price change over last 24 hours, e.g. 2.5 means +2.5%
    },
  },
  {
    timestamps: true, // createdAt is used to sort "new listings"
  }
);

module.exports = mongoose.model("Crypto", cryptoSchema);
