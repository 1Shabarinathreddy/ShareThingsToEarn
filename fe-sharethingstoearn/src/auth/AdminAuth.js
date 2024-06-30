import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminAuth = ({ children }) => {
  const { isAuthenticated, profileDate } = useAuth();
  return isAuthenticated && profileDate?.role === "Admin" ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminAuth;
