import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Dialog({ onClose, email }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const localhost = "http://localhost:5000/";
  const publichost = "https://blog-rntf.onrender.com/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${publichost}api/v1/users/verify-login`,
        {
          email,
          otp,
        }
      );
      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/chats");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md border border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-4 sm:mb-6">
          Enter the OTP
        </h2>
        <p className="text-gray-400 text-center mb-6 sm:mb-8 text-sm sm:text-base">
          OTP sent to your email
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center p-2 sm:p-4">
            <InputOTP
              maxLength={6}
              className="gap-1 sm:gap-2"
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup className="gap-1 sm:gap-2">
                <InputOTPSlot
                  index={0}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl font-bold bg-gray-700 border-gray-600 text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
                <InputOTPSlot
                  index={1}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl font-bold bg-gray-700 border-gray-600 text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
                <InputOTPSlot
                  index={2}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl font-bold bg-gray-700 border-gray-600 text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-1 sm:mx-2 text-gray-400" />
              <InputOTPGroup className="gap-1 sm:gap-2">
                <InputOTPSlot
                  index={3}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl font-bold bg-gray-700 border-gray-600 text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
                <InputOTPSlot
                  index={4}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl font-bold bg-gray-700 border-gray-600 text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
                <InputOTPSlot
                  index={5}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-xl sm:text-2xl font-bold bg-gray-700 border-gray-600 text-white rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
