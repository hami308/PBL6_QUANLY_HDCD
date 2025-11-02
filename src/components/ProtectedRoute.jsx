import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token"); // Kiểm tra token đăng nhập

  if (!token) {
    alert("Vui lòng đăng nhập để tiếp tục!");
    return <Navigate to="/" replace />; 
  }

  return children; 
}

export default ProtectedRoute;
