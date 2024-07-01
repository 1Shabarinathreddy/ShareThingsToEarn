import axios from "axios";
import axiosInstance from "../api/axiosInstance";

import { toast } from "react-toastify";

const handleError = (error) => {
  toast.error(
    error?.response?.data?.messsage ||
      error?.response?.data?.error ||
      error?.message ||
      error?.error?.error ||
      "Something went wrong"
  );
};

export const postLogin = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data);
    return response.data;
  } catch (error) {
    handleError(error);
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const createAccount = async (data) => {
  try {
    const response = await axiosInstance.post("/register", data);
    return response.data;
  } catch (error) {
    handleError(error);
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getItems = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/itemsToBook${id ? `?categoryId=${id}` : ""}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const bookItem = async (data) => {
  try {
    const response = await axiosInstance.post("/book-item", data);
    return response.data;
  } catch (error) {
    handleError(error);
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const addItem = async (data) => {
  try {
    const response = await axios.post("http://localhost:3000/item", data, {
      headers: {
        Authorization: localStorage.getItem("authToken"),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);

    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const editItem = async (data, id) => {
  try {
    const response = await axios.put(`http://localhost:3000/item/${id}`, data, {
      headers: {
        Authorization: localStorage.getItem("authToken"),
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    handleError(error);

    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`/item/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);

    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getUserProducts = async () => {
  try {
    const response = await axiosInstance.get("/item");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const editProfile = async (data) => {
  try {
    const response = await axiosInstance.put("/profile", data);
    return response.data;
  } catch (error) {
    handleError(error);
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getProfile = async (data) => {
  try {
    const response = await axiosInstance.get("/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

//Rented items
export const getRentedItems = async (data) => {
  try {
    const response = await axiosInstance.get("/requested-items");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getAllRentedItems = async (data) => {
  try {
    const response = await axiosInstance.get("/rented-items");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const returnItem = async (id) => {
  try {
    const response = await axiosInstance.put(`/return-item/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);

    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getRequestedItems = async (data) => {
  try {
    const response = await axiosInstance.get("/rental-items");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const changeStatusRequestedItem = async (params, id) => {
  try {
    const response = await axiosInstance.put(`/update-status/${id}`, params);
    return response.data;
  } catch (error) {
    handleError(error);

    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getUsersData = async (data) => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
