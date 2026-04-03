// import React, { useEffect, useState } from "react";
// import API from "../utils/api";
// import Navbar from "../components/Navbar";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";

// const COLORS = ["#08eab9","#c52274", "#efa544", "#3b82f6", "#a23bf6","#3bf68f"];

// const Dashboard = () => {
//   const [finance, setFinance] = useState({});
//   const [categories, setCategories] = useState([]);
//   const [insight, setInsight] = useState("");
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [budgetSummary, setBudgetSummary] = useState({});

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const fetchDashboard = async () => {
//     try {
//       const [
//         financeRes,
//         categoryRes,
//         insightRes,
//         monthlyRes,
//         budgetRes,
//       ] = await Promise.all([
//         API.get("/dashboard/finance-overview"),
//         API.get("/dashboard/categories"),
//         API.get("/dashboard/insights"),
//         API.get("/dashboard/monthly"),
//         API.get("/budgets"), // 🔥 NEW
//       ]);

//       setFinance(financeRes.data.data || {});
//       setInsight(insightRes.data.data || "");

//       const formatted = (categoryRes.data.data || [])
//         .map((item) => ({
//           category: item.category,
//           total: Math.abs(Number(item.total)),
//         }))
//         .sort((a, b) => b.total - a.total);

//       setCategories(formatted);

//       setMonthlyData(
//         (monthlyRes.data.data || []).map((item) => ({
//           ...item,
//           income: Number(item.income),
//           expense: Number(item.expense),
//         }))
//       );

//       // 🔥 BUDGET SUMMARY LOGIC
//       const budgets = budgetRes.data || [];

//       const over = budgets.filter(
//         (b) => Number(b.spent) > Number(b.budget)
//       );

//       const totalOver = over.reduce(
//         (sum, b) => sum + (b.spent - b.budget),
//         0
//       );

//       const top = budgets.reduce((max, b) => {
//         return Number(b.spent) > Number(max.spent) ? b : max;
//       }, budgets[0] || {});

//       setBudgetSummary({
//         count: over.length,
//         total: totalOver,
//         top: top,
//       });

//     } catch (error) {
//       console.error("Dashboard error:", error);
//     }
//   };

//   const totalExpense = categories.reduce(
//     (sum, item) => sum + item.total,
//     0
//   );

//   const savingsRate =
//     finance.total_income > 0
//       ? (
//           ((finance.total_income - finance.total_expense) /
//             finance.total_income) *
//           100
//         ).toFixed(1)
//       : 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
//       <Navbar />

//       <div className="p-6 max-w-6xl mx-auto">
//         <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

//         {/* ===== TOP CARDS ===== */}
//         <div className="grid md:grid-cols-4 gap-5 mb-6">

//           <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
//             <p className="text-gray-400 text-sm">Income</p>
//             <h2 className="text-2xl font-semibold text-green-400">
//               ₹ {finance.total_income || 0}
//             </h2>
//           </div>

//           <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
//             <p className="text-gray-400 text-sm">Expense</p>
//             <h2 className="text-2xl font-semibold text-red-400">
//               ₹ {finance.total_expense || 0}
//             </h2>
//           </div>

//           <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
//             <p className="text-gray-400 text-sm">Savings</p>
//             <h2 className="text-2xl font-semibold text-blue-400">
//               ₹ {finance.net_savings || 0}
//             </h2>
//           </div>

//           <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
//             <p className="text-gray-400 text-sm">Savings Rate</p>
//             <h2 className="text-2xl font-semibold text-purple-400">
//               {savingsRate}%
//             </h2>
//           </div>

//         </div>

//         {/* ===== BUDGET SUMMARY ===== */}
//         <div className="mb-6 p-5 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
//           <h2 className="text-lg font-semibold mb-2">
//             Budget Summary
//           </h2>

//           {budgetSummary.count > 0 ? (
//             <>
//               <p className="text-red-400">
//                 ⚠️ {budgetSummary.count} budgets exceeded
//               </p>
//               <p className="text-white font-semibold">
//                 💸 Overspent: ₹ {budgetSummary.total}
//               </p>
//             </>
//           ) : (
//             <p className="text-green-400">
//               ✅ All budgets are under control
//             </p>
//           )}

//           {budgetSummary.top?.category && (
//             <p className="text-gray-400 mt-2 text-sm">
//               🔥 Highest: {budgetSummary.top.category} (₹{" "}
//               {budgetSummary.top.spent})
//             </p>
//           )}
//         </div>

//         {/* ===== AI INSIGHT ===== */}
//         <div className="mb-6 p-5 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
//           <p className="text-gray-400 text-sm mb-1">AI Insight</p>
//           <p className="text-white">{insight}</p>
//         </div>

//         {/* ===== CHARTS ===== */}
//         <div className="grid md:grid-cols-2 gap-6 mb-6">

//           <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800">
//             <h2 className="text-lg mb-3 text-center">
//               Income vs Expense
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={monthlyData}>
//                 <CartesianGrid stroke="#333" />
//                 <XAxis dataKey="month" stroke="#aaa" />
//                 <YAxis stroke="#aaa" />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="income" fill="#22c55e" />
//                 <Bar dataKey="expense" fill="#ef4444" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800">
//             <h2 className="text-lg mb-3 text-center">Trend</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={monthlyData}>
//                 <CartesianGrid stroke="#333" />
//                 <XAxis dataKey="month" stroke="#aaa" />
//                 <YAxis stroke="#aaa" />
//                 <Tooltip />
//                 <Legend />
//                 <Line dataKey="income" stroke="#22c55e" />
//                 <Line dataKey="expense" stroke="#ef4444" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//         </div>

//         {/* ===== PIE ===== */}
//         <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800">
//           <h2 className="text-lg mb-3 text-center">
//             Spending Breakdown
//           </h2>

//           <ResponsiveContainer width="100%" height={400}>
//             <PieChart>
//               <Pie
//                 data={categories}
//                 dataKey="total"
//                 nameKey="category"
//                 innerRadius={80}
//                 outerRadius={140}
//                 label={({ percent }) =>
//                   `${(percent * 100).toFixed(0)}%`
//                 }
//               >
//                 {categories.map((entry, index) => (
//                   <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>

//               <text
//                 x="50%"
//                 y="50%"
//                 textAnchor="middle"
//                 fill="#fff"
//               >
//                 <tspan fontSize="18" fontWeight="bold">
//                   ₹ {totalExpense}
//                 </tspan>
//                 <tspan x="50%" dy="20" fontSize="12" fill="#aaa">
//                   Expenses
//                 </tspan>
//               </text>

//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;







import React, { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#08eab9","#c52274","#efa544","#3b82f6","#a23bf6","#3bf68f"];

const Dashboard = () => {
  const [finance, setFinance] = useState({});
  const [categories, setCategories] = useState([]);
  const [insight, setInsight] = useState("");
  const [monthlyData, setMonthlyData] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState({});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [
        financeRes,
        categoryRes,
        insightRes,
        monthlyRes,
        budgetRes,
      ] = await Promise.all([
        API.get("/dashboard/finance-overview"),
        API.get("/dashboard/categories"),
        API.get("/dashboard/insights"),
        API.get("/dashboard/monthly"),
        API.get("/budgets"),
      ]);

      setFinance(financeRes.data.data || {});
      setInsight(insightRes.data.data || "");

      const formatted = (categoryRes.data.data || [])
        .map((item) => ({
          category: item.category,
          total: Math.abs(Number(item.total)),
        }))
        .sort((a, b) => b.total - a.total);

      setCategories(formatted);

      setMonthlyData(
        (monthlyRes.data.data || []).map((item) => ({
          ...item,
          income: Number(item.income),
          expense: Number(item.expense),
        }))
      );

      const budgets = budgetRes.data || [];

      const over = budgets.filter(
        (b) => Number(b.spent) > Number(b.budget)
      );

      const totalOver = over.reduce(
        (sum, b) => sum + (b.spent - b.budget),
        0
      );

      const top = budgets.reduce((max, b) => {
        return Number(b.spent) > Number(max.spent) ? b : max;
      }, budgets[0] || {});

      setBudgetSummary({
        count: over.length,
        total: totalOver,
        top: top,
      });

    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  const totalExpense = categories.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const savingsRate =
    finance.total_income > 0
      ? (
          ((finance.total_income - finance.total_expense) /
            finance.total_income) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      <Navbar />

      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
          Dashboard
        </h1>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
            <p className="text-gray-400 text-sm">Income</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-green-400">
              ₹ {finance.total_income || 0}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
            <p className="text-gray-400 text-sm">Expense</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-red-400">
              ₹ {finance.total_expense || 0}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
            <p className="text-gray-400 text-sm">Savings</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-400">
              ₹ {finance.net_savings || 0}
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
            <p className="text-gray-400 text-sm">Savings Rate</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-purple-400">
              {savingsRate}%
            </h2>
          </div>

        </div>

        {/* BUDGET SUMMARY */}
        <div className="mb-6 p-4 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
          <h2 className="text-lg font-semibold mb-2">
            Budget Summary
          </h2>

          {budgetSummary.count > 0 ? (
            <>
              <p className="text-red-400">
                ⚠️ {budgetSummary.count} budgets exceeded
              </p>
              <p className="text-white font-semibold">
                💸 Overspent: ₹ {budgetSummary.total}
              </p>
            </>
          ) : (
            <p className="text-green-400">
              ✅ All budgets are under control
            </p>
          )}

          {budgetSummary.top?.category && (
            <p className="text-gray-400 mt-2 text-sm">
              🔥 Highest: {budgetSummary.top.category} (₹{" "}
              {budgetSummary.top.spent})
            </p>
          )}
        </div>

        {/* AI INSIGHT */}
        <div className="mb-6 p-4 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur">
          <p className="text-gray-400 text-sm mb-1">AI Insight</p>
          <p className="text-white text-sm sm:text-base">{insight}</p>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
            <h2 className="text-lg mb-3 text-center">
              Income vs Expense
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" />
                <Bar dataKey="expense" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
            <h2 className="text-lg mb-3 text-center">Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Legend />
                <Line dataKey="income" stroke="#22c55e" />
                <Line dataKey="expense" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* PIE */}
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800">
          <h2 className="text-lg mb-3 text-center">
            Spending Breakdown
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="total"
                nameKey="category"
                innerRadius={60}
                outerRadius={100}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {categories.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;