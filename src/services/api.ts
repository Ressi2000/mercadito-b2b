// src/services/api.ts
import axios from "axios";
import { router } from "../app/routes";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Rutas que pueden recibir 401 de forma legítima (no redirigir)
const AUTH_ROUTES = ["/mercadito/auth/ping", "/mercadito/login"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const is401 = error.response?.status === 401;
    const isAuthRoute = AUTH_ROUTES.some((r) => url.includes(r));

    // Solo redirigir al login si es 401 en rutas protegidas (no en ping/login)
    if (is401 && !isAuthRoute) {
      localStorage.removeItem("mercadito_user");
      router.navigate("/");
    }

    return Promise.reject(error);
  }
);

export default api;