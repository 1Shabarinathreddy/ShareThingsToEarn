// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import PublicRoute from "./auth/PublicAuth";
import PrivateRoute from "./auth/PrivateAuth";

const App = () => {
  const login = false;
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {login ? (
            <Route path="/" element={<Navigate to="/dashboard" />} />
          ) : (
            <Route path="/" element={<Navigate to="/login" />} />
          )}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div>Dashboard</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
