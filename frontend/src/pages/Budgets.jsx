import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  // 🔥 NEW: month selector
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const categories = ["Food", "Shopping", "Travel", "Transport"];

  // ==============================
  // FETCH (UPDATED)
  // ==============================
  const fetchBudgets = async () => {
    try {
      const res = await API.get(`/budgets?month=${month}`);
      setBudgets(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month]); // 🔥 refetch when month changes

  // ==============================
  // ADD
  // ==============================
  const handleAdd = async () => {
    if (!category || !amount) {
      return alert("Select category and amount");
    }

    try {
      await API.post("/budgets", {
        category,
        amount: Number(amount),
        month, // 🔥 important fix
      });

      setCategory("");
      setAmount("");

      fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // SMART DATA
  // ==============================
  const overBudget = budgets.filter(
    (b) => Number(b.spent) > Number(b.budget)
  );

  const totalOver = overBudget.reduce(
    (sum, b) => sum + (b.spent - b.budget),
    0
  );

  const topCategory = budgets.reduce((max, b) => {
    return Number(b.spent) > Number(max?.spent || 0) ? b : max;
  }, {});

  // ==============================
  // UI
  // ==============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">
          Budgets
        </h1>

        {/* 📅 MONTH SELECTOR */}
        <div className="mb-6">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
          />
        </div>

        {/* 🔥 SUMMARY */}
        {budgets.length > 0 && (
          <div className="mb-6 space-y-3">
            {overBudget.length > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-700/10 border border-red-500/20">
                <p className="text-sm text-red-300">
                  ⚠️ You exceeded {overBudget.length} budget(s)
                </p>
                <p className="text-lg font-semibold">
                  ₹ {totalOver} overspent
                </p>
              </div>
            )}

            {topCategory?.category && (
              <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
                <p className="text-sm text-gray-400">
                  Highest spending
                </p>
                <p className="text-lg font-semibold">
                  🔥 {topCategory.category} — ₹ {topCategory.spent}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ➕ ADD */}
        <div className="flex gap-3 mb-8">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
          >
            <option value="">Category</option>
            {categories.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
          />

          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 rounded-xl hover:scale-105 transition"
          >
            Set Budget
          </button>
        </div>

        {/* 📊 LIST */}
        {budgets.length === 0 ? (
          <p className="text-gray-400">No budgets for this month</p>
        ) : (
          <div className="space-y-5">
            {budgets.map((b, i) => {
              const spent = Number(b.spent || 0);
              const budget = Number(b.budget || 0);
              const percent =
                budget > 0 ? (spent / budget) * 100 : 0;
              const remaining = budget - spent;

              let barColor =
                "bg-gradient-to-r from-green-400 to-green-600";
              if (percent >= 70 && percent <= 100)
                barColor =
                  "bg-gradient-to-r from-yellow-400 to-yellow-600";
              if (percent > 100)
                barColor =
                  "bg-gradient-to-r from-red-500 to-red-700";

              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800"
                >
                  {/* HEADER */}
                  <div className="flex justify-between mb-3">
                    <h2 className="text-lg font-semibold">
                      {b.category}
                    </h2>
                    <span className="text-sm text-gray-400">
                      ₹ {spent} / {budget}
                    </span>
                  </div>

                  {/* BAR */}
                  <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor}`}
                      style={{
                        width: `${Math.min(percent, 100)}%`,
                      }}
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex justify-between text-xs mt-2 text-gray-400">
                    <span>{percent.toFixed(0)}% used</span>
                    <span>
                      {remaining >= 0
                        ? `₹ ${remaining} left`
                        : `₹ ${Math.abs(remaining)} over`}
                    </span>
                  </div>

                  {/* ALERTS */}
                  {percent > 100 && (
                    <p className="text-red-400 mt-2 text-sm">
                      ⚠️ Budget exceeded
                    </p>
                  )}

                  {percent >= 70 && percent <= 100 && (
                    <p className="text-yellow-400 mt-2 text-sm">
                      ⚠️ Near limit
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;