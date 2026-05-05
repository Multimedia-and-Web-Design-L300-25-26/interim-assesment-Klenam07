// seed.js — Populates the database with 10 sample cryptocurrencies
// Run with:  node seed.js   (from the backend/ directory)
// WARNING:   This deletes ALL existing crypto entries before inserting.

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Crypto = require("./models/Crypto");

dotenv.config();

const cryptos = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 67000,
    change24h: 2.45,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 3800,
    change24h: 1.83,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 185,
    change24h: 5.21,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
  },
  {
    name: "Cardano",
    symbol: "ADA",
    price: 0.65,
    change24h: -1.23,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.18,
    change24h: 8.92,
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
  },
  {
    name: "Ripple",
    symbol: "XRP",
    price: 0.62,
    change24h: -0.54,
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
  },
  {
    name: "Polkadot",
    symbol: "DOT",
    price: 9.2,
    change24h: 3.17,
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
  },
  {
    name: "Avalanche",
    symbol: "AVAX",
    price: 42.5,
    change24h: 6.88,
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    price: 18.3,
    change24h: -2.1,
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    price: 95.4,
    change24h: 0.73,
    image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Crypto.deleteMany({});
    console.log("Cleared existing cryptocurrencies");

    const inserted = await Crypto.insertMany(cryptos);
    console.log(`Seeded ${inserted.length} cryptocurrencies:`);
    inserted.forEach((c) => console.log(`  ${c.symbol} — ${c.name} @ $${c.price}`));

    console.log("\nSeed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
