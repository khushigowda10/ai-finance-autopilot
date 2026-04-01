const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

// routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const budgetRoutes = require("./routes/budgetRoutes"); // ✅ NEW

// config
dotenv.config();

const app = express();
const PORT = 5000;

// middleware
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// ==============================
// DB CONNECTION
// ==============================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ DB error:", err));

// ==============================
// ROUTES
// ==============================
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/budgets", budgetRoutes); // ✅ NEW ROUTE

// root route
app.get("/", (req, res) => {
  res.send("AI Finance Autopilot Backend Running 🚀");
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});