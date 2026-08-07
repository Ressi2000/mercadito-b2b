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

export interface PedidoWeb {
  id: number;
  codigo_pedido_web: string;
  empresa: string;
  mercancia_id: number;
  total: number;
  moneda?: string;
  status: "pendiente" | "aprobado" | "rechazado";
  observaciones?: string;
  motivo_rechazo?: string;
  fecha: string;
  items?: ItemPedidoWeb[];
}