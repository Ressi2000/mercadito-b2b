// src/services/notificacionService.ts
import api from "./api";
import type { NotificacionesResponse } from "../models/Notificacion";

interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
}

export const getNotificaciones = async (): Promise<NotificacionesResponse> => {
  const response = await api.get<ApiResponse<NotificacionesResponse>>("/mercadito/notificaciones");
  return response.data.data ?? { notificaciones: [], no_leidas: 0 };
};

export const marcarNotificacionLeida = async (id: number): Promise<void> => {
  await api.patch(`/mercadito/notificaciones/${id}/leer`);
};

export const marcarTodasLeidas = async (): Promise<void> => {
  await api.post("/mercadito/notificaciones/leer-todas");
};
