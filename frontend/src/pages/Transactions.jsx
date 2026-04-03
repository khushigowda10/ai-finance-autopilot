// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../utils/api";
// import Navbar from "../components/Navbar";

// const Transactions = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [file, setFile] = useState(null);

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [type, setType] = useState("");
//   const [sort, setSort] = useState("desc");

//   const navigate = useNavigate();

//   // 🍔 ICONS
//   const categoryIcons = {
//     Food: "🍔",
//     Shopping: "🛒",
//     Travel: "✈️",
//     Transport: "🚌",
//     Entertainment: "🎮",
//     Income: "💰",
//     Others: "📦",
//   };

//   // ==============================
//   // CHECK IF DATA EXISTS (OPTIONAL)
//   // ==============================
//   useEffect(() => {
//     checkData();
//   }, []);

//   const checkData = async () => {
//     try {
//       const res = await API.get("/transactions/has-data");

//       // 👉 if already has data → go dashboard
//       if (res.data.hasData) {
//         navigate("/dashboard");
//       }

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ==============================
//   // FETCH
//   // ==============================
//   const fetchTransactions = async () => {
//     try {
//       const res = await API.get("/transactions", {
//         params: { search, category, type, sort },
//       });

//       setTransactions(res.data.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, [search, category, type, sort]);

//   // ==============================
//   // UPLOAD
//   // ==============================
//   const handleUpload = async () => {
//     if (!file) return alert("Select file");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await API.post("/transactions/upload", formData);

//       alert("Upload successful 🎉");

//       // 🔥 REDIRECT AFTER UPLOAD
//       navigate("/dashboard");

//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     }
//   };

//   // ==============================
//   // GROUP BY MONTH
//   // ==============================
//   const grouped = transactions.reduce((acc, t) => {
//     const month = new Date(t.date).toLocaleString("default", {
//       month: "long",
//       year: "numeric",
//     });

//     if (!acc[month]) acc[month] = [];
//     acc[month].push(t);

//     return acc;
//   }, {});

//   // ==============================
//   // DOWNLOAD CSV
//   // ==============================
//   const downloadCSV = () => {
//     const headers = ["Date", "Description", "Category", "Amount"];

//     const rows = transactions.map((t) => [
//       t.date,
//       t.description,
//       t.category,
//       t.amount,
//     ]);

//     const csv =
//       "data:text/csv;charset=utf-8," +
//       [headers, ...rows].map((e) => e.join(",")).join("\n");

//     const link = document.createElement("a");
//     link.href = encodeURI(csv);
//     link.download = "transactions.csv";
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
//       <Navbar />

//       <div className="p-6 max-w-6xl mx-auto">
//         <h1 className="text-3xl font-semibold mb-6">Transactions</h1>

//         {/* UPLOAD + DOWNLOAD */}
//         <div className="flex gap-4 mb-6 flex-wrap">
//           <input type="file" onChange={(e) => setFile(e.target.files[0])} />

//           <button
//             onClick={handleUpload}
//             className="bg-blue-600 px-4 py-2 rounded-xl hover:scale-105 transition"
//           >
//             Upload CSV
//           </button>

//           <button
//             onClick={downloadCSV}
//             className="bg-green-600 px-4 py-2 rounded-xl hover:scale-105 transition"
//           >
//             Download CSV
//           </button>
//         </div>

//         {/* FILTERS */}
//         <div className="flex flex-wrap gap-3 mb-6">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
//           />

//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
//           >
//             <option value="">All Categories</option>
//             <option value="Food">Food</option>
//             <option value="Transport">Transport</option>
//             <option value="Shopping">Shopping</option>
//             <option value="Entertainment">Entertainment</option>
//             <option value="Others">Others</option>
//           </select>

//           <select
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
//           >
//             <option value="">All Types</option>
//             <option value="income">Income</option>
//             <option value="expense">Expense</option>
//           </select>

//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
//           >
//             <option value="desc">Latest</option>
//             <option value="asc">Oldest</option>
//           </select>
//         </div>

//         {/* TABLE */}
//         <div className="bg-gray-900/60 border border-gray-800 rounded-2xl backdrop-blur max-h-[500px] overflow-y-auto">

//           {/* HEADER */}
//           <div className="grid grid-cols-5 px-5 py-3 text-sm text-gray-400 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
//             <span>Date</span>
//             <span>Description</span>
//             <span>Category</span>
//             <span>Type</span>
//             <span className="text-right">Amount</span>
//           </div>

//           {/* DATA */}
//           {Object.keys(grouped).length === 0 ? (
//             <p className="p-5 text-gray-400">
//               No transactions — upload your CSV 🚀
//             </p>
//           ) : (
//             Object.keys(grouped).map((month, i) => (
//               <div key={i}>
//                 <div className="px-5 py-2 text-sm text-gray-500 bg-gray-800/40">
//                   {month}
//                 </div>

//                 {grouped[month].map((tx) => (
//                   <div
//                     key={tx.id}
//                     className="grid grid-cols-5 px-5 py-4 border-b border-gray-800 hover:bg-gray-800/40 transition"
//                   >
//                     <span>
//                       {new Date(tx.date).toLocaleDateString()}
//                     </span>

//                     <span>{tx.description}</span>

//                     <span>
//                       {categoryIcons[tx.category] || "📦"} {tx.category}
//                     </span>

//                     <span
//                       className={
//                         tx.type === "income"
//                           ? "text-green-400"
//                           : "text-red-400"
//                       }
//                     >
//                       {tx.type}
//                     </span>

//                     <span
//                       className={`text-right font-semibold ${
//                         tx.type === "income"
//                           ? "text-green-400"
//                           : "text-red-400"
//                       }`}
//                     >
//                       ₹ {Math.abs(tx.amount)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Transactions;






// import { useEffect, useState } from "react";
// import API from "../utils/api";
// import Navbar from "../components/Navbar";

// const Transactions = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [file, setFile] = useState(null);

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [type, setType] = useState("");
//   const [sort, setSort] = useState("desc");

//   // 🍔 ICONS
//   const categoryIcons = {
//     Food: "🍔",
//     Shopping: "🛒",
//     Travel: "✈️",
//     Transport: "🚌",
//     Entertainment: "🎮",
//     Income: "💰",
//     Others: "📦",
//   };

//   // ==============================
//   // FETCH TRANSACTIONS
//   // ==============================
//   const fetchTransactions = async () => {
//     try {
//       const res = await API.get("/transactions", {
//         params: { search, category, type, sort },
//       });

//       console.log("DATA:", res.data); // 🔍 debug

//       setTransactions(res.data.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, [search, category, type, sort]);

//   // ==============================
//   // UPLOAD CSV
//   // ==============================
//   const handleUpload = async () => {
//     if (!file) return alert("Select file");

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await API.post("/transactions/upload", formData);

//       alert("Upload successful 🎉");

//       // 🔥 REFRESH DATA (instead of redirect)
//       fetchTransactions();

//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     }
//   };

//   // ==============================
//   // GROUP BY MONTH
//   // ==============================
//   const grouped = transactions.reduce((acc, t) => {
//     const month = new Date(t.date).toLocaleString("default", {
//       month: "long",
//       year: "numeric",
//     });

//     if (!acc[month]) acc[month] = [];
//     acc[month].push(t);

//     return acc;
//   }, {});

//   // ==============================
//   // DOWNLOAD CSV
//   // ==============================
//   const downloadCSV = () => {
//     const headers = ["Date", "Description", "Category", "Amount"];

//     const rows = transactions.map((t) => [
//       t.date,
//       t.description,
//       t.category,
//       t.amount,
//     ]);

//     const csv =
//       "data:text/csv;charset=utf-8," +
//       [headers, ...rows].map((e) => e.join(",")).join("\n");

//     const link = document.createElement("a");
//     link.href = encodeURI(csv);
//     link.download = "transactions.csv";
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
//       <Navbar />

//       <div className="p-6 max-w-6xl mx-auto">
//         <h1 className="text-3xl font-semibold mb-6">Transactions</h1>

//         {/* UPLOAD + DOWNLOAD */}
//         <div className="flex gap-4 mb-6 flex-wrap">
//           <input type="file" onChange={(e) => setFile(e.target.files[0])} />

//           <button
//             onClick={handleUpload}
//             className="bg-blue-600 px-4 py-2 rounded-xl hover:scale-105 transition"
//           >
//             Upload CSV
//           </button>

//           <button
//             onClick={downloadCSV}
//             className="bg-green-600 px-4 py-2 rounded-xl hover:scale-105 transition"
//           >
//             Download CSV
//           </button>
//         </div>

//         {/* FILTERS */}
//         <div className="flex flex-wrap gap-3 mb-6">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
//           />

//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
//           >
//             <option value="">All Categories</option>
//             <option value="Food">Food</option>
//             <option value="Transport">Transport</option>
//             <option value="Shopping">Shopping</option>
//             <option value="Entertainment">Entertainment</option>
//             <option value="Others">Others</option>
//           </select>

//           <select
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
//           >
//             <option value="">All Types</option>
//             <option value="income">Income</option>
//             <option value="expense">Expense</option>
//           </select>

//           <select
//             value={sort}
//             onChange={(e) => setSort(e.target.value)}
//             className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
//           >
//             <option value="desc">Latest</option>
//             <option value="asc">Oldest</option>
//           </select>
//         </div>

//         {/* TABLE */}
//         <div className="bg-gray-900/60 border border-gray-800 rounded-2xl backdrop-blur max-h-[500px] overflow-y-auto">

//           {/* HEADER */}
//           <div className="grid grid-cols-5 px-5 py-3 text-sm text-gray-400 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
//             <span>Date</span>
//             <span>Description</span>
//             <span>Category</span>
//             <span>Type</span>
//             <span className="text-right">Amount</span>
//           </div>

//           {/* DATA */}
//           {Object.keys(grouped).length === 0 ? (
//             <p className="p-5 text-gray-400">
//               No transactions — upload your CSV 🚀
//             </p>
//           ) : (
//             Object.keys(grouped).map((month, i) => (
//               <div key={i}>
//                 <div className="px-5 py-2 text-sm text-gray-500 bg-gray-800/40">
//                   {month}
//                 </div>

//                 {grouped[month].map((tx) => (
//                   <div
//                     key={tx.id}
//                     className="grid grid-cols-5 px-5 py-4 border-b border-gray-800 hover:bg-gray-800/40 transition"
//                   >
//                     <span>
//                       {new Date(tx.date).toLocaleDateString()}
//                     </span>

//                     <span>{tx.description}</span>

//                     <span>
//                       {categoryIcons[tx.category] || "📦"} {tx.category}
//                     </span>

//                     <span
//                       className={
//                         tx.type === "income"
//                           ? "text-green-400"
//                           : "text-red-400"
//                       }
//                     >
//                       {tx.type}
//                     </span>

//                     <span
//                       className={`text-right font-semibold ${
//                         tx.type === "income"
//                           ? "text-green-400"
//                           : "text-red-400"
//                       }`}
//                     >
//                       ₹ {Math.abs(tx.amount)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Transactions;





import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [file, setFile] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("desc");

  const categoryIcons = {
    Food: "🍔",
    Shopping: "🛒",
    Travel: "✈️",
    Transport: "🚌",
    Entertainment: "🎮",
    Income: "💰",
    Others: "📦",
  };

  // FETCH
  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions", {
        params: { search, category, type, sort },
      });

      setTransactions(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, category, type, sort]);

  // UPLOAD
  const handleUpload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/transactions/upload", formData);
      alert("Upload successful 🎉");
      fetchTransactions();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  // GROUP
  const grouped = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[month]) acc[month] = [];
    acc[month].push(t);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      <Navbar />

      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* TITLE */}
        <h1 className="text-xl sm:text-3xl font-semibold mb-6">
          Transactions
        </h1>

        {/* UPLOAD + DOWNLOAD */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <button
            onClick={handleUpload}
            className="bg-blue-600 px-4 py-2 rounded-xl"
          >
            Upload CSV
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Others">Others</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
          >
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px] bg-gray-900/60 border border-gray-800 rounded-2xl">

            {/* HEADER */}
            <div className="grid grid-cols-5 px-4 py-3 text-xs sm:text-sm text-gray-400 border-b border-gray-800">
              <span>Date</span>
              <span>Description</span>
              <span>Category</span>
              <span>Type</span>
              <span className="text-right">Amount</span>
            </div>

            {/* DATA */}
            {Object.keys(grouped).length === 0 ? (
              <p className="p-5 text-gray-400">
                No transactions — upload your CSV 🚀
              </p>
            ) : (
              Object.keys(grouped).map((month, i) => (
                <div key={i}>
                  <div className="px-4 py-2 text-xs sm:text-sm text-gray-500 bg-gray-800/40">
                    {month}
                  </div>

                  {grouped[month].map((tx) => (
                    <div
                      key={tx.id}
                      className="grid grid-cols-5 px-4 py-3 text-xs sm:text-sm border-b border-gray-800"
                    >
                      <span>
                        {new Date(tx.date).toLocaleDateString()}
                      </span>

                      <span>{tx.description}</span>

                      <span>
                        {categoryIcons[tx.category] || "📦"} {tx.category}
                      </span>

                      <span
                        className={
                          tx.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {tx.type}
                      </span>

                      <span className="text-right font-semibold">
                        ₹ {Math.abs(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;