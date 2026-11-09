import api from "./api";
import axios from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    cliente_id: number;
    email: string;
  };
}

// /sanctum/csrf-cookie vive en la raíz de la API, no bajo /api — se deriva
// de la misma VITE_API_BASE_URL que usa el resto de los requests en vez de
// hardcodear un host. Antes esto apuntaba fijo a 127.0.0.1:8000: funcionaba
// en local por pura coincidencia, pero rompía el login en cualquier otro
// entorno (Render, AKS) porque el navegador del usuario intentaba pegarle
// a su propia localhost.
const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api"
).replace(/\/api\/?$/, "");

export const fetchCsrfToken = async () => {
  await axios.get(`${API_ROOT}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

export const loginRequest = async (data: LoginPayload) => {
  await fetchCsrfToken();
  const response = await api.post<AuthResponse>("/mercadito/login", data);
  return response.data;
};

export const logoutRequest = async () => {
  const response = await api.post<AuthResponse>("/mercadito/logout");
  return response.data;
};

export const checkAuth = async () => {
  const response = await api.get("/mercadito/auth/ping");
  return response.data;
};

export const solicitarRecuperacion = async (email: string) => {
  const response = await api.post<AuthResponse>("/mercadito/password/olvide", {
    email,
  });
  return response.data;
};

export interface RestablecerPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const restablecerPassword = async (
  data: RestablecerPasswordPayload
) => {
  const response = await api.post<AuthResponse>(
    "/mercadito/password/resetear",
    data
  );
  return response.data;
};
