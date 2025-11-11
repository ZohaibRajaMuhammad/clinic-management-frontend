import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "./config";

export const signupApi = async (form) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to signup try later");
    throw error;
  }
};

export const loginApi = async (form) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, form, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to signin try later");
    throw error;
  }
};

export const forgetpasswordApi = async (form) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/forgetpassword`,
      form,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    
    toast.error( error.message || "Failed to forgetpassword try later");
    throw error;
  }
};

export const resetPasswordApi = async (password, token ) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/resetpassword/${token}`,
      {
        password,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to resetpassword try later");
    throw error;
  }
};


export const setPasswordApi = async (password, token ) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/setpassword/${token}`,
      {
        password,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to set password try later");
    throw error;
  }
};