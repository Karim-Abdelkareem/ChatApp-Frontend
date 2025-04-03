import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/signup",
        {
          name,
          email,
        }
      );

      if (response.data.status === "success") {
        setLoading(false);
        navigate("/login");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response.data.error);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg border border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6 sm:mb-8">
          Create New Account
        </h1>
        {error && <p className="text-sm text-red-500 pb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 sm:py-3 border border-gray-600 focus:outline-none focus:border-indigo-500 transition-colors text-sm sm:text-base"
              placeholder="Enter your name"
              required
            />
          </div>
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
            {loading ? "Creating Account..." : "Create Account"}
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
    </div>
  );
}
