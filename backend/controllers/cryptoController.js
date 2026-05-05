// controllers/cryptoController.js — Handles all cryptocurrency data operations

const Crypto = require("../models/Crypto");

/**
 * getAllCryptos — GET /api/crypto
 * Returns all cryptocurrencies, newest first.
 */
const getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 });
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cryptocurrencies", error: error.message });
  }
};

/**
 * getTopGainers — GET /api/crypto/gainers
 * Returns top 6 cryptocurrencies sorted by highest 24h % change (best performers first).
 */
const getTopGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find().sort({ change24h: -1 }).limit(6);
    res.json(gainers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top gainers", error: error.message });
  }
};

/**
 * getNewCryptos — GET /api/crypto/new
 * Returns the 6 most recently added cryptocurrencies (newest first).
 */
const getNewCryptos = async (req, res) => {
  try {
    const newest = await Crypto.find().sort({ createdAt: -1 }).limit(6);
    res.json(newest);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch new listings", error: error.message });
  }
};

/**
 * addCrypto — POST /api/crypto
 * Adds a new cryptocurrency. Rejects duplicate symbols.
 *
 * Required body fields: name, symbol, price
 * Optional: image (URL string), change24h (number)
 */
const addCrypto = async (req, res) => {
  const { name, symbol, price, image, change24h } = req.body;

  if (!name || !symbol || price === undefined || price === null) {
    return res.status(400).json({ message: "name, symbol, and price are required" });
  }

  if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    return res.status(400).json({ message: "price must be a positive number" });
  }

  try {
    // Explicit duplicate check before insert (cleaner error message than the Mongo 11000 code)
    const existing = await Crypto.findOne({ symbol: symbol.toUpperCase() });
    if (existing) {
      return res.status(409).json({
        message: `A cryptocurrency with symbol ${symbol.toUpperCase()} already exists`,
      });
    }

    const crypto = await Crypto.create({
      name,
      symbol: symbol.toUpperCase(),
      price: parseFloat(price),
      image: image || "",
      change24h: parseFloat(change24h) || 0,
    });

    res.status(201).json(crypto);
  } catch (error) {
    // Catch MongoDB duplicate key error as a safety net
    if (error.code === 11000) {
      return res.status(409).json({ message: "A cryptocurrency with this symbol already exists" });
    }
    res.status(500).json({ message: "Failed to add cryptocurrency", error: error.message });
  }
};

module.exports = { getAllCryptos, getTopGainers, getNewCryptos, addCrypto };
