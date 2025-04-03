import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router";

export default function ConfirmAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");

    const confirmAccount = async () => {
      try {
        const response = await axios.post(
          "https://chat-app-react-livid.vercel.app/api/v1/users/confirm-email",
          {
            email,
            otp,
          }
        );

        if (response.data.status === "success") {
          setMessage(
            "تم تأكيد بريدك الإلكتروني بنجاح! سيتم تحويلك إلى صفحة تسجيل الدخول..."
          );
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setError("حدث خطأ أثناء تأكيد البريد الإلكتروني");
        }
      } catch (e) {
        setError(
          e.response?.data?.error || "حدث خطأ أثناء تأكيد البريد الإلكتروني"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (email && otp) {
      confirmAccount();
    } else {
      setError("الرجاء التأكد من صحة رابط التأكيد");
      setIsLoading(false);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full border border-gray-700">
        <div className="text-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-gray-300">جاري تأكيد حسابك...</p>
            </div>
          ) : error ? (
            <div className="text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg mb-4">{error}</p>
              <button
                onClick={() => navigate("/signup")}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                إنشاء حساب جديد
              </button>
            </div>
          ) : (
            <div className="text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
