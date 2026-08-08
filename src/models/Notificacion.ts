// src/models/Notificacion.ts

export interface Notificacion {
  id: number;
  cliente_web_user_id: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  data?: {
    pedido_id?: number;
    codigo_pedido_web?: string;
    motivo?: string | null;
    pedido_sap?: string | null;
  } | null;
  leida: boolean;
  created_at: string;
}

export interface NotificacionesResponse {
  notificaciones: Notificacion[];
  no_leidas: number;
}
