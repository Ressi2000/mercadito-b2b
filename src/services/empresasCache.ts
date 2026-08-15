// src/services/empresasCache.ts
import type { Empresa } from "../models/Empresa";

export const EMPRESAS_CACHE_TTL_MS = 60 * 1000;

let cache: { data: Empresa[]; timestamp: number } | null = null;

export function getEmpresasCache() {
  return cache;
}

export function setEmpresasCache(data: Empresa[]) {
  cache = { data, timestamp: Date.now() };
}

// Se llama al cerrar sesión (o al perderla por un 401) para que el próximo
// usuario en el mismo navegador no vea, ni por un instante, las empresas
// de la cuenta anterior mientras se refresca — mismo motivo que
// clearDashboardCache().
export function clearEmpresasCache() {
  cache = null;
}
