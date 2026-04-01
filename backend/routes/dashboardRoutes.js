const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// ==============================
// 💰 FINANCE OVERVIEW
// ==============================
router.get("/finance-overview", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS total_expense
       FROM transactions
       WHERE user_id = $1`,
      [userId]
    );

    const totalIncome = Number(result.rows[0].total_income || 0);
    const totalExpense = Number(result.rows[0].total_expense || 0);

    res.json({
      success: true,
      data: {
        total_income: totalIncome,
        total_expense: totalExpense,
        net_savings: totalIncome - totalExpense,
      },
    });

  } catch (error) {
    console.error("FINANCE ERROR:", error);
    res.status(500).json({ success: false });
  }
});


// ==============================
// 📊 CATEGORY BREAKDOWN
// ==============================
router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'
       GROUP BY category`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("CATEGORY ERROR:", error);
    res.status(500).json({ success: false });
  }
});


// ==============================
// 🤖 AI INSIGHTS
// ==============================
router.get("/insights", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'
       GROUP BY category
       ORDER BY total DESC
       LIMIT 1`,
      [userId]
    );

    const top = result.rows[0];

    const message = top
      ? `You are spending most on ${top.category}.`
      : "No insights available";

    res.json({
      success: true,
      data: message,
    });

  } catch (error) {
    console.error("INSIGHT ERROR:", error);
    res.status(500).json({ success: false });
  }
});


// ==============================
// 📈 MONTHLY ANALYTICS
// ==============================
router.get("/monthly", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        TO_CHAR(date, 'Mon') as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
       FROM transactions
       WHERE user_id = $1
       GROUP BY month, DATE_TRUNC('month', date)
       ORDER BY DATE_TRUNC('month', date)`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("MONTHLY ERROR:", error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;