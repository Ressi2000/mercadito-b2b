// src/services/dashboardCache.ts
import type { DashboardData, TasaBcv, VisitaComercial, ProximaVisita, ProductoDescuento } from "../models/Dashboard";

export interface DashboardSnapshot {
  dashboard: DashboardData | null;
  tasa: TasaBcv | null;
  visitas: VisitaComercial[];
  proximaVisita: ProximaVisita | null;
  descuentos: ProductoDescuento[];
}

export const DASHBOARD_CACHE_TTL_MS = 60 * 1000;

let cache: { data: DashboardSnapshot; timestamp: number } | null = null;

export function getDashboardCache() {
  return cache;
}

export function setDashboardCache(data: DashboardSnapshot) {
  cache = { data, timestamp: Date.now() };
}

// Se llama al cerrar sesión (o al perderla por un 401) para que el próximo
// usuario en el mismo navegador no vea, ni por un instante, datos del
// dashboard de la cuenta anterior mientras se refresca.
export function clearDashboardCache() {
  cache = null;
}
