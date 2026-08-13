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

export const fetchCsrfToken = async () => {
  await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
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
