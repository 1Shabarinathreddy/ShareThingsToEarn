// src/services/userService.js
import axiosInstance from "../api/axiosInstance";

export const postLogin = async () => {
  try {
    const response = await axiosInstance.post("/login", {
      username: "saran",
      password: "123",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
