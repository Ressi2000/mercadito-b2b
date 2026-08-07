// src/services/empresaService.ts
import api from "./api";
import type { Empresa } from "../models/Empresa";

export const getEmpresasByCliente = async (): Promise<Empresa[]> => {
  const response = await api.get("/mercadito/cliente/mercancias");
  return response.data;
};
