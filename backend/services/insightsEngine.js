const pool = require("../config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Gathers everything we know about a user's finances into one object.
// This is the "structured financial summary" that both the rule-based
// engine AND the AI consume.
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

// PERMANENT fallback — deterministic, no external dependency, always works.
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

// Builds a compact, structured prompt from the summary — no raw DB access,
// no PII beyond what's needed (no email, no user id, no transaction descriptions).
function buildPrompt(summary) {
  return `You are a personal finance assistant. Based ONLY on the following summary, write a short, encouraging, and specific financial insight for the user (2-3 sentences, no markdown, no bullet points, plain text only).

Financial summary:
- Total income: ₹${summary.totalIncome}
- Total expenses: ₹${summary.totalExpense}
- Net savings: ₹${summary.netSavings}
- Savings rate: ${(summary.savingsRate * 100).toFixed(1)}%
- Top spending category: ${summary.topCategory || "none"} (₹${summary.topCategoryAmount})
- Category breakdown: ${JSON.stringify(summary.categoryBreakdown)}
- Categories over budget this month: ${summary.overspentCategories.join(", ") || "none"}
- Categories near budget limit: ${summary.nearLimitCategories.join(", ") || "none"}

Give one practical, actionable suggestion based on this data. Do not invent numbers not shown above.`;
}

// Calls Gemini with a timeout. Throws on any failure — caller handles fallback.
async function getAiInsight(summary) {
  if (!genAI) {
    throw new Error("Gemini not configured (missing GEMINI_API_KEY)");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
  const prompt = buildPrompt(summary);

  const TIMEOUT_MS = 8000;
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini request timed out")), TIMEOUT_MS)
  );

  const result = await Promise.race([
    model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        thinkingConfig: { thinkingLevel: "minimal" },
      },
    }),
    timeoutPromise,
  ]);

  const text = result.response.text().trim();
  if (!text) {
    throw new Error("Gemini returned empty response");
  }
  return text;
}

module.exports = { getFinancialSummary, generateFallbackInsight, getAiInsight };