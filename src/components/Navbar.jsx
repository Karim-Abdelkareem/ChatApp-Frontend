import React from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const user = decodedToken;
  console.log(user);
  const navigate = useNavigate();
  return (
    <div className="flex bg-gray-800 text-white justify-between items-center px-6 py-2 shadow-lg">
      <div className="flex items-center gap-3">
        <img
          src={user.image}
          alt={user.name}
          className="w-12 h-12 rounded-full border-2 border-blue-500"
        />
        <h1 className="text-xl font-semibold text-gray-100">{user.name}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
