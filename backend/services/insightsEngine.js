const pool = require("../config/db");

// Gathers everything we know about a user's finances into one object.
// This is the "structured financial summary" that both the rule-based
// engine AND (in the next step) the AI will consume.
async function getFinancialSummary(userId) {
  const overview = await pool.query(
    `SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN ABS(amount) END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN ABS(amount) END), 0) AS total_expense
     FROM transactions
     WHERE user_id = $1`,
    [userId]
  );

  const totalIncome = Number(overview.rows[0].total_income || 0);
  const totalExpense = Number(overview.rows[0].total_expense || 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? netSavings / totalIncome : 0;

  const categories = await pool.query(
    `SELECT category, SUM(ABS(amount)) AS total
     FROM transactions
     WHERE user_id = $1 AND type = 'expense'
     GROUP BY category
     ORDER BY total DESC`,
    [userId]
  );

  const topCategory = categories.rows[0] || null;

  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const budgets = await pool.query(
    `SELECT 
      b.category,
      b.amount AS budget,
      COALESCE(SUM(ABS(t.amount)), 0) AS spent
     FROM budgets b
     LEFT JOIN transactions t 
       ON b.category = t.category 
       AND b.user_id = t.user_id
       AND TO_CHAR(t.date, 'YYYY-MM') = b.month
     WHERE b.user_id = $1 AND b.month = $2
     GROUP BY b.category, b.amount`,
    [userId, currentMonth]
  );

  const overspent = budgets.rows.filter(b => Number(b.spent) > Number(b.budget));
  const nearLimit = budgets.rows.filter(
    b => Number(b.spent) <= Number(b.budget) && Number(b.spent) >= Number(b.budget) * 0.8
  );

  return {
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate: Number(savingsRate.toFixed(3)),
    topCategory: topCategory ? topCategory.category : null,
    topCategoryAmount: topCategory ? Number(topCategory.total) : 0,
    categoryBreakdown: categories.rows.map(r => ({
      category: r.category,
      total: Number(r.total),
    })),
    overspentCategories: overspent.map(b => b.category),
    nearLimitCategories: nearLimit.map(b => b.category),
  };
}

// The existing deterministic logic, slightly extended. This stays as the
// PERMANENT fallback — it must never depend on anything external.
function generateFallbackInsight(summary) {
  const lines = [];

  if (summary.topCategory) {
    lines.push(`You are spending the most on ${summary.topCategory} (₹${summary.topCategoryAmount.toFixed(2)}).`);
  } else {
    lines.push("No spending data available yet.");
  }

  if (summary.totalIncome > 0) {
    const pct = (summary.savingsRate * 100).toFixed(1);
    lines.push(`Your current savings rate is ${pct}%.`);
  }

  if (summary.overspentCategories.length > 0) {
    lines.push(`You have exceeded your budget in: ${summary.overspentCategories.join(", ")}.`);
  } else if (summary.nearLimitCategories.length > 0) {
    lines.push(`You are approaching your budget limit in: ${summary.nearLimitCategories.join(", ")}.`);
  }

  return lines.join(" ");
}

module.exports = { getFinancialSummary, generateFallbackInsight };