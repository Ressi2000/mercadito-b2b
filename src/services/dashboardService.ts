// src/services/dashboardService.ts
import api from "./api";
import type { DashboardData, TasaBcv, VisitaComercial, ProximaVisita, ProductoDescuento } from "../models/Dashboard";

interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

/** Trae el resumen agregado para la pantalla principal del cliente */
export const getDashboard = async (): Promise<DashboardData> => {
  const response = await api.get<ApiResponse<DashboardData>>("/mercadito/dashboard");
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message ?? "Error al cargar el dashboard");
  }
  return response.data.data;
};

/** Tasa BCV más reciente */
export const getTasaBcv = async (): Promise<TasaBcv | null> => {
  try {
    const response = await api.get<ApiResponse<TasaBcv>>("/mercadito/tasa-bcv");
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

/** Últimas 5 visitas comerciales realizadas */
export const getUltimasVisitas = async (): Promise<VisitaComercial[]> => {
  const response = await api.get<ApiResponse<VisitaComercial[]>>("/mercadito/visitas", {
    params: { tipo: "ultimas" },
  });
  return response.data.data ?? [];
};

/** Próxima visita comercial agendada */
export const getProximaVisita = async (): Promise<ProximaVisita | null> => {
  const response = await api.get<ApiResponse<ProximaVisita>>("/mercadito/visitas", {
    params: { tipo: "proxima" },
  });
  return response.data.data ?? null;
};

/** Top productos con descuento SAP vigente, entre todas las empresas del cliente */
export const getDescuentos = async (): Promise<ProductoDescuento[]> => {
  const response = await api.get<ApiResponse<ProductoDescuento[]>>("/mercadito/dashboard/descuentos");
  return response.data.data ?? [];
};
