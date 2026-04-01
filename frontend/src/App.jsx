// // import Dashboard from "./pages/Dashboard";

// // export default function App() {
// //   return <Dashboard />;
  
// // }


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // pages
// import Dashboard from "./pages/Dashboard";
// import Transactions from "./pages/Transactions";
// import Insights from "./pages/Insights";
// import Budgets from "./pages/Budgets";
// import Settings from "./pages/Settings";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";

// // component
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <Router>
//       <Routes>

//         {/* PUBLIC ROUTES */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* PROTECTED ROUTES */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/transactions" element={<Transactions />} />
//           <Route path="/insights" element={<Insights />} />
//           <Route path="/budgets" element={<Budgets />} />
//           <Route path="/settings" element={<Settings />} />
//         </Route>

//       </Routes>
//     </Router>
//   );
// }

// export default App;












import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Budgets from "./pages/Budgets";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;