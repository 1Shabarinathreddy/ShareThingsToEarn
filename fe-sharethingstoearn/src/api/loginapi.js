import axios from "axios";
import axiosInstance from "../api/axiosInstance";

//Logi API
export const postLogin = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

//Sign Up API
export const createAccount = async (data) => {
  try {
    const response = await axiosInstance.post("/register", data);
    return response.data;
  } catch (error) {
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

//list of books
export const getItems = async () => {
  try {
    const response = await axiosInstance.get("/itemsToBook");
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
    console.error("Error fetching user data:", error);
    throw error;
  }
};

//single items todo
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
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const editItem = async (data, id) => {
  try {
    const response = await axios.put(`"ttp://localhost:3000/item/${id}`, data, {
      headers: {
        Authorization: localStorage.getItem("authToken"),
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`/item/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

//get user added Products
export const getUserProducts = async () => {
  try {
    const response = await axiosInstance.get("/item");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

//profile
export const editProfile = async (data) => {
  try {
    const response = await axiosInstance.put("/profile", data);
    return response.data;
  } catch (error) {
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

export const returnItem = async (id) => {
  try {
    const response = await axiosInstance.put(`/return-item/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

//requested items
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
    console.error("Error fetching user data:", error);
    throw error;
  }
};
