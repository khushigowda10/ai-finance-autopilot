const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ai_finance_autopilot",
  password: "root123",
  port: 5432,
});

module.exports = pool;