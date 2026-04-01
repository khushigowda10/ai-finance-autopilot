import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-[#121826] p-6 text-white min-h-screen">
      <h2 className="text-xl font-bold mb-8 text-indigo-400">
        Finance AI 💸
      </h2>

      <ul className="space-y-4 text-gray-400">
        
        <li>
          <Link to="/" className="hover:text-white">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/analytics" className="hover:text-white">
            Analytics
          </Link>
        </li>

        <li>
          <Link to="/settings" className="hover:text-white">
            Settings
          </Link>
        </li>

      </ul>
    </div>
  );
}