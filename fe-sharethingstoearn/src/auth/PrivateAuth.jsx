import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, profileDate } = useAuth();
  return isAuthenticated && profileDate?.role === "User" ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
