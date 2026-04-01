import { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white flex items-center justify-center px-6">
      
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* 🔥 LEFT SIDE (BRANDING) */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Join <br />
            <span className="text-green-400">
              Smart Personal Finance Autopilot
            </span>
          </h1>

          <p className="text-gray-400 text-lg">
            Take control of your money, track every expense, and unlock powerful insights.
          </p>

          <div className="space-y-2 text-gray-400 text-sm">
            <p>✔ Track your spending effortlessly</p>
            <p>✔ Set budgets & stay on track</p>
            <p>✔ Get smart financial insights</p>
          </div>
        </div>

        {/* 🔐 RIGHT SIDE (SIGNUP CARD) */}
        <form
          onSubmit={handleSignup}
          className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Create your account
          </h2>

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 mb-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            className="w-full p-3 mb-5 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Sign Up
          </button>

          {/* LOGIN LINK */}
          <p className="text-sm mt-5 text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-green-400 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;