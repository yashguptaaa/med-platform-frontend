import axios from "axios";
import { toCamelCase, toSnakeCase } from "./transform";

const INSTANCE_IP = process.env.EIP || "15.207.54.240";

const API_URL = typeof window !== "undefined" 
  ? "/api" 
  : `http://${INSTANCE_IP}:4000/api`;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = toCamelCase(response.data);
    }
    return response;
  },
  async (error) => {
    // Handle 401 (Unauthorized) - e.g., redirect to login or refresh token
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Optional: clear token and redirect
      }
    }
    return Promise.reject(error);
  }
);
