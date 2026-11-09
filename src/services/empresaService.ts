// src/services/empresaService.ts
import api from "./api";
import type { Empresa } from "../models/Empresa";

export const getEmpresasByCliente = async (signal?: AbortSignal): Promise<Empresa[]> => {
  const response = await api.get("/mercadito/cliente/mercancias", { signal });
  return response.data;
};
