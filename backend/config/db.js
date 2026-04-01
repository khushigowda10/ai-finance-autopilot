const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "ai-finance-backend-0chy.onrender.com",
  database: "ai_finance_autopilot",
  password: "root123",
  port: 5432,
});

module.exports = pool;