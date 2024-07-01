// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import PublicRoute from "./auth/PublicAuth";
import PrivateRoute from "./auth/PrivateAuth";
import Dashboard from "./features/dashboard/Dashboard";
import Layout from "./features/layout/Layout";
import Products from "./features/products/Products";
import UserRentedItems from "./features/userrenteditems/UserRentedItems";
import UserProducts from "./features/userproducts/UserProducts";
import RentedRequests from "./features/rentedRequests/RentedRequests";
import Profile from "./features/profile/Profile";
import NavBar from "./features/navbar/Navbar";
import AdminAuth from "./auth/AdminAuth";
import UserList from "./features/admin/UserList";
import RentedItems from "./features/admin/RentalItems";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route
              path="products"
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="rented-items"
              element={
                <PrivateRoute>
                  <UserRentedItems />
                </PrivateRoute>
              }
            />
            <Route
              path="user-items"
              element={
                <PrivateRoute>
                  <UserProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="rental-requests"
              element={
                <PrivateRoute>
                  <RentedRequests />
                </PrivateRoute>
              }
            />
            <Route
              path="profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="adminprofile"
              element={
                <AdminAuth>
                  <Profile />
                </AdminAuth>
              }
            />
            <Route
              path="users"
              element={
                <AdminAuth>
                  <UserList />
                </AdminAuth>
              }
            />
            <Route
              path="adminproducts"
              element={
                <AdminAuth>
                  <Products />
                </AdminAuth>
              }
            />
            <Route
              path="rentals"
              element={
                <AdminAuth>
                  <RentedItems />
                </AdminAuth>
              }
            />
          </Route>
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
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
