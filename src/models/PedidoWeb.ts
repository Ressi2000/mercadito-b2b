// src/models/PedidoWeb.ts

export interface ItemPedidoWeb {
  id: number;
  material_id: number;
  codigo: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  unidad_medida?: string;
  moneda?: string;
}

export type PedidoWebStatus = "pendiente" | "aprobado_vendedor" | "aprobado" | "rechazado" | "modificado";

export interface HistorialPedidoWeb {
  status_anterior: string;
  status_nuevo: string;
  actor_tipo: "vendedor" | "admin" | "cliente" | "sistema";
  motivo?: string | null;
  fecha: string;
}

export interface DesglosePedidoWeb {
  subtotal_16: number;
  subtotal_8: number;
  subtotal_exento: number;
  iva_16: number;
  iva_8: number;
  retencion: number;
  total_retencion: number;
}

export interface PedidoWeb {
  id: number;
  codigo_pedido_web: string;
  empresa: string;
  mercancia_id: number;
  total: number;
  moneda?: string;
  status: PedidoWebStatus;
  observaciones?: string;
  motivo_rechazo?: string;
  vendedor?: string | null;
  pedido_sap?: string | null;
  fecha: string;
  items?: ItemPedidoWeb[];
  historial?: HistorialPedidoWeb[];
  desglose?: DesglosePedidoWeb | null;
}