// src/services/api.ts
import axios from "axios";
import { router } from "../app/routes";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// 🔥 Interceptor global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      router.navigate("/");
    }

    return Promise.reject(error);
  }
);


export default api;