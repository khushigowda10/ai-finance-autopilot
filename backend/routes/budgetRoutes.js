const express = require("express");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==============================
// ➕ CREATE / UPDATE BUDGET
// ==============================
router.post("/", authMiddleware, async (req, res) => {
  const { category, amount, month } = req.body;
  const userId = req.user.id;

  if (!category || !amount || !month) {
    return res.status(400).json({
      error: "Category, amount, and month are required",
    });
  }

  try {
    await db.query(
      `
      INSERT INTO budgets (user_id, category, amount, month)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, category, month)
      DO UPDATE SET amount = EXCLUDED.amount
      `,
      [userId, category, amount, month]
    );

    res.json({ message: "✅ Budget saved successfully" });
  } catch (err) {
    console.error("❌ Budget save error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// 📊 GET BUDGETS WITH SPENDING
// ==============================
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  // 🔥 get selected month from frontend
  const { month } = req.query;

  try {
    const result = await db.query(
      `
      SELECT 
        b.category,
        b.amount AS budget,
        COALESCE(SUM(ABS(t.amount)), 0) AS spent
      FROM budgets b
      LEFT JOIN transactions t 
        ON b.category = t.category 
        AND b.user_id = t.user_id
        AND TO_CHAR(t.date, 'YYYY-MM') = b.month
      WHERE b.user_id = $1
        AND ($2::text IS NULL OR b.month = $2)
      GROUP BY b.category, b.amount
      ORDER BY b.category;
      `,
      [userId, month || null]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch budgets error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// 🗑️ DELETE BUDGET (OPTIONAL)
// ==============================
router.delete("/", authMiddleware, async (req, res) => {
  const { category, month } = req.body;
  const userId = req.user.id;

  try {
    await db.query(
      `
      DELETE FROM budgets
      WHERE user_id = $1 AND category = $2 AND month = $3
      `,
      [userId, category, month]
    );

    res.json({ message: "🗑️ Budget deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;