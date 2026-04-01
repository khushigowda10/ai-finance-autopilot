import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white flex items-center justify-center px-6">
      
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* 🔥 LEFT SIDE (BRANDING) */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Smart Personal <br />
            <span className="text-green-400">Finance Autopilot</span>
          </h1>

          <p className="text-gray-400 text-lg">
            Track your expenses, control your budget, and gain powerful insights —
            all in one place.
          </p>

          <div className="space-y-2 text-gray-400 text-sm">
            <p>✔ Track income & expenses</p>
            <p>✔ Smart budget alerts</p>
            <p>✔ AI-powered insights</p>
          </div>
        </div>

        {/* 🔐 RIGHT SIDE (LOGIN CARD) */}
        <form
          onSubmit={handleLogin}
          className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Login to your account
          </h2>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Login
          </button>

          {/* SIGNUP */}
          <p className="text-sm mt-5 text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-green-400 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;





