// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useState } from "react";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [open, setOpen] = useState(false);

//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   const navItems = [
//     { name: "Dashboard", path: "/dashboard", icon: "📊" },
//     { name: "Transactions", path: "/transactions", icon: "💸" },
//     { name: "Budgets", path: "/budgets", icon: "📁" },
//     { name: "Insights", path: "/insights", icon: "🧠" },
//   ];

//   return (
//     <div className="sticky top-0 z-50 bg-gray-900/60 backdrop-blur-md border-b border-gray-800 shadow-sm">
      
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

//         {/* 🔥 LOGO */}
//         <div
//           onClick={() => navigate("/dashboard")}
//           className="flex items-center gap-2 cursor-pointer"
//         >
//           <span className="text-xl">💸</span>
//           <h1 className="text-lg font-semibold tracking-tight">
//             <span className="text-white">Smart</span>{" "}
//             <span className="text-green-400">Finance</span>
//           </h1>
//         </div>

//         {/* 🔗 NAV LINKS */}
//         <div className="hidden md:flex items-center gap-3">

//           {navItems.map((item) => {
//             const isActive = location.pathname === item.path;

//             return (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
//                   isActive
//                     ? "bg-green-500/20 text-green-400 border border-green-500/30"
//                     : "text-gray-400 hover:text-white hover:bg-gray-800"
//                 }`}
//               >
//                 <span>{item.icon}</span>
//                 {item.name}
//               </Link>
//             );
//           })}

//           {/* 👤 USER MENU */}
//           <div className="relative">
//             <button
//               onClick={() => setOpen(!open)}
//               className="ml-4 w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-700 transition"
//             >
//               👤
//             </button>

//             {open && (
//               <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
//                 <button
//                   onClick={logout}
//                   className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 📱 MOBILE ICON (optional placeholder) */}
//         <div className="md:hidden text-gray-400">
//           ☰
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Navbar;






import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [userOpen, setUserOpen] = useState(false); // profile dropdown

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Transactions", path: "/transactions", icon: "💸" },
    { name: "Budgets", path: "/budgets", icon: "📁" },
    { name: "Insights", path: "/insights", icon: "🧠" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-gray-900/60 backdrop-blur-md border-b border-gray-800 shadow-sm">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3">

        {/* LOGO */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-xl">💸</span>
          <h1 className="text-lg font-semibold tracking-tight">
            <span className="text-white">Smart</span>{" "}
            <span className="text-green-400">Finance</span>
          </h1>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-3">

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}

          {/* USER MENU */}
          <div className="relative">
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="ml-4 w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-700 transition"
            >
              👤
            </button>

            {userOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 📱 MOBILE HAMBURGER */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-gray-300"
        >
          ☰
        </button>

      </div>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3">

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-green-500/20 text-green-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="text-left px-3 py-2 text-red-400 hover:bg-gray-800 rounded-lg"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
};

export default Navbar;