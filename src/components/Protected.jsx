import React from "react";
import { Navigate } from "react-router";

export default function Protected({ children }) {
  let user = localStorage.getItem("token");
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}
