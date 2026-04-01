import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";

const Insights = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]); // 🔥 NEW

  useEffect(() => {
    fetchData();
    fetchBudgets(); // 🔥 NEW
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBudgets = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const res = await API.get(`/budgets?month=${currentMonth}`);
      setBudgets(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // 🧠 HELPERS
  // ==============================

  const parseAmount = (val) => {
    if (!val) return 0;
    return Number(String(val).replace(/[^0-9.-]+/g, "")) || 0;
  };

  const isIncome = (t) =>
    t.category?.toLowerCase() === "income";

  // ==============================
  // 💰 CALCULATIONS
  // ==============================

  const income = transactions
    .filter(isIncome)
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const expenses = transactions
    .filter((t) => !isIncome(t))
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const score = Math.min(100, Math.max(0, savingsRate));

  // ==============================
  // 📊 CATEGORY ANALYSIS
  // ==============================

  const categoryMap = {};

  transactions.forEach((t) => {
    if (!isIncome(t)) {
      if (!categoryMap[t.category]) categoryMap[t.category] = 0;
      categoryMap[t.category] += parseAmount(t.amount);
    }
  });

  const topCategory = Object.entries(categoryMap).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // ==============================
  // 💡 SMART INSIGHTS (FIXED 🔥)
  // ==============================

  const insights = [];

  // 🔥 LOOP ALL CATEGORIES (no hardcoding)
  budgets.forEach((b) => {
    const spent = Number(b.spent);
    const budget = Number(b.budget);

    if (budget === 0) return;

    const percent = (spent / budget) * 100;

    if (percent > 100) {
      insights.push({
        type: "warning",
        text: `🚨 ${b.category}: Overspent by ₹${spent - budget}`,
      });
    } else if (percent > 80) {
      insights.push({
        type: "warning",
        text: `⚠️ ${b.category}: Near limit (${percent.toFixed(0)}%)`,
      });
    } else {
      insights.push({
        type: "positive",
        text: `✅ ${b.category}: Under control (${percent.toFixed(0)}%)`,
      });
    }
  });

  // 🔥 savings insight
  if (savingsRate > 30) {
    insights.push({
      type: "positive",
      text: `💰 You are saving ${savingsRate.toFixed(1)}% of income`,
    });
  }

  // 🔥 top category
  if (topCategory) {
    insights.push({
      type: "neutral",
      text: `🔥 Highest spending: ${topCategory[0]} (₹${topCategory[1]})`,
    });
  }

  // ==============================
  // 🎨 UI HELPERS
  // ==============================

  const getScoreColor = () => {
    if (score > 75) return "text-green-400";
    if (score > 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getMessage = () => {
    if (score > 75) return "Great job! Keep it up 👍";
    if (score > 50) return "Good progress 👍";
    return "Needs improvement ⚠️";
  };

  // ==============================
  // 🎨 UI
  // ==============================

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">AI Insights</h1>

        {/* 💎 SCORE */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <h2 className="text-lg mb-4">Financial Health Score</h2>

          <div className="flex items-center gap-6">
            <div className={`text-5xl font-bold ${getScoreColor()}`}>
              {score.toFixed(0)}
              <span className="text-sm text-gray-400"> / 100</span>
            </div>

            <div>
              <p className="text-lg font-semibold">{getMessage()}</p>
              <p className="text-gray-400 text-sm">
                Savings rate: {savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* 📊 METRICS */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
          <h2 className="text-lg">Key Metrics</h2>

          <div>
            <p className="text-sm mb-1">Savings Ratio</p>
            <div className="w-full bg-gray-700 h-2 rounded">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${Math.min(savingsRate, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm mb-1">Expense Ratio</p>
            <div className="w-full bg-gray-700 h-2 rounded">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{
                  width: `${Math.min((expenses / income) * 100 || 0, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* 💡 INSIGHTS */}
        <div className="space-y-4">
          <h2 className="text-lg">Smart Insights</h2>

          {insights.length === 0 ? (
            <p className="text-gray-400">No insights available</p>
          ) : (
            insights.map((ins, i) => {
              let color = "bg-gray-800";

              if (ins.type === "warning")
                color = "bg-red-500/10 border border-red-500";
              if (ins.type === "positive")
                color = "bg-green-500/10 border border-green-500";

              return (
                <div key={i} className={`p-4 rounded-xl ${color}`}>
                  {ins.text}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;