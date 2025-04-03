import React from "react";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg transform transition-all hover:scale-105 border border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6 sm:mb-8">
          Welcome to Chat App
        </h1>
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full bg-gray-700 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold border border-gray-600 hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
