// src/models/Carrito.ts

export interface CarritoItem {
  id: number;         // negativo = temporal optimista, positivo = confirmado en BD
  material_id: number;
  nombre: string;
  codigo: string;
  foto?: string | null;
  cantidad: number;
  precio_unitario: number;
  precio_bruto?: number | null;
  porc_descuento?: number | null;
  subtotal: number;
  unidad_medida?: string;
  moneda?: string;
}

export interface DesgloseCarrito {
  subtotal_16: number;
  subtotal_8: number;
  subtotal_exento: number;
  iva_16: number;
  iva_8: number;
  retencion: number;
  total_retencion: number;
}

export interface Carrito {
  id: number | null;  // null = carrito aún no creado en BD (vacío por primera vez)
  codigo_pedido_web: string | null;
  mercancia_id: number;
  nombre_mercancia?: string;
  estado: "draft" | "confirmado" | "procesado" | "rechazado";
  total_estimado: number;
  items: CarritoItem[];
  desglose?: DesgloseCarrito | null;
}
