// routes/cryptoRoutes.js — Cryptocurrency data routes

const express = require("express");
const router = express.Router();
const {
  getAllCryptos,
  getTopGainers,
  getNewCryptos,
  addCrypto,
} = require("../controllers/cryptoController");

// IMPORTANT: Specific named paths (/gainers, /new) MUST be declared BEFORE the root (/)
// Otherwise Express would never reach them since "/" matches everything first.

// GET /api/crypto/gainers — top 6 coins by 24h price increase
router.get("/gainers", getTopGainers);

// GET /api/crypto/new — 6 most recently added coins
router.get("/new", getNewCryptos);

// GET /api/crypto — all cryptocurrencies
router.get("/", getAllCryptos);

// POST /api/crypto — add a new cryptocurrency
router.post("/", addCrypto);

module.exports = router;
