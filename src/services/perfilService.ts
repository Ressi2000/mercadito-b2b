// src/services/perfilService.ts
import api from "./api";

// ── Tipos de respuesta del backend ───────────────────────────────────

export interface ClienteInfo {
  codigo_cliente: string;
  razon_social_cliente: string;
  rif_cliente: string;
  direccion_cliente: string;
  telefono_cliente: string;
  contacto_cliente: string;
  poblacion_cliente: string;
  distrito_cliente: string;
  pais_cliente: string;
}

export interface ContactoInfo {
  ContactoId: string;
  Nombres: string;
  Telefono: string;
}

export interface CreditoInfo {
  mercancia_id: number;
  nombre_mercancia?: string;
  LimiteCred: number;
  TotalCred: number;
  FecultPago: string | null;
  ImpultPago: number;
  MonultPago: string;
  ComproTotal: number;
  ValComercial: number;
}

export interface PerfilData {
  usuario: {
    id: number;
    email: string;
    activo: boolean;
    last_login: string | null;
  };
  cliente: ClienteInfo;
  contactos: ContactoInfo[];
  creditos: CreditoInfo[];
}

export interface CambiarPasswordPayload {
  password_actual: string;
  password_nuevo: string;
  password_nuevo_confirmation: string;
}

interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

// ── Endpoints ────────────────────────────────────────────────────────

/** Trae toda la info del perfil del cliente autenticado */
export const getPerfil = async (): Promise<PerfilData> => {
  const response = await api.get<ApiResponse<PerfilData>>("/mercadito/perfil");
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message ?? "Error al cargar perfil");
  }
  return response.data.data;
};

/** Cambia solo la contraseña del usuario web */
export const cambiarPassword = async (
  payload: CambiarPasswordPayload
): Promise<string> => {
  const response = await api.post<ApiResponse>(
    "/mercadito/perfil/cambiar-password",
    payload
  );
  if (!response.data.success) {
    throw new Error(response.data.message ?? "Error al cambiar contraseña");
  }
  return response.data.message;
};
