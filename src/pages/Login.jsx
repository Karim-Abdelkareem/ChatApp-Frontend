import Dialog from "@/components/Dialog";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  let localhost = "http://localhost:5000/";
  let publichost = "https://chat-app-backend-smoky.vercel.app/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${publichost}api/v1/users/login`, {
        email,
      });
      console.log(response);
      if (response.data.status === "success") {
        setShowOtp(true);
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.error);
    }

    console.log(email);
  };

  const handleCloseDialog = () => {
    setShowOtp(false);
    setLoading(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg border border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6 sm:mb-8">
          Login
        </h1>
        {error && <p className="text-sm text-red-500 pb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 sm:py-3 border border-gray-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm sm:text-base"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full bg-gray-700 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold border border-gray-600 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            Back to Home
          </button>
        </form>
      </div>
      {showOtp && <Dialog onClose={handleCloseDialog} email={email} />}
    </div>
  );
}
