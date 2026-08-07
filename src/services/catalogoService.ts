// src/services/catalogoService.ts
import api from "./api";
import type { Material } from "../models/Material";

/**
 * Obtiene los materiales de una empresa (mercancia) con sus precios
 * desde precio_materiales_b3, filtrados por el cliente autenticado.
 *
 * GET /mercadito/catalogo/:empresaId
 *
 * El backend se encarga de:
 *  - Filtrar materiales_mercancias por mercancia_id (empresaId)
 *  - Hacer join con precio_materiales_b3 usando ClienteId + OrgVentas
 *  - Traer foto del material si existe
 */
export async function getMaterialesByEmpresa(empresaId: number): Promise<Material[]> {
  const response = await api.get(`/mercadito/catalogo/${empresaId}`);
  return response.data.data;
}