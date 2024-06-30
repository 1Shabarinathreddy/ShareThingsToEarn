import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const isLogged = localStorage.getItem("authToken");
  const userData = localStorage.getItem("user");
  let user = null;
  try {
    user = JSON.parse(userData);
  } catch (e) {
    user = null;
  }
  const [isAuthenticated, setIsAuthenticated] = useState(!!isLogged);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, profileDate: user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
