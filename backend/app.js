const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const rateLimit = require("express-rate-limit");

// config
dotenv.config();

const app = express();

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://ai-finance-autopilot.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// ==============================
// RATE LIMITERS
// ==============================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many insight requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==============================
// ROUTES
// ==============================
app.use("/auth/login", authLimiter);
app.use("/auth/signup", authLimiter);
app.use("/auth", authRoutes);

app.use("/dashboard/insights", aiLimiter);
app.use("/dashboard", dashboardRoutes);

app.use("/transactions", transactionRoutes);
app.use("/budgets", budgetRoutes);

// root route
app.get("/", (req, res) => {
  res.send("AI Finance Autopilot Backend Running 🚀");
});

module.exports = app;