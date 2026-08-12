// src/models/Dashboard.ts

export interface CreditoResumen {
  mercancia_id: number;
  nombre_mercancia: string;
  limite_credito: number;
  credito_usado: number;
  disponible: number;
  moneda: string;
}

export interface UltimoPedido {
  id: number;
  codigo_pedido_web: string;
  empresa: string;
  total: number;
  moneda: string;
  status: "pendiente" | "aprobado" | "rechazado";
  fecha: string;
}

export interface UbicacionCliente {
  latitud: string | number | null;
  longitud: string | number | null;
  direccion: string | null;
  poblacion: string | null;
  estado: string | null;
}

export interface ClienteInfo {
  razon_social: string | null;
  rif: string | null;
}

export interface DashboardData {
  creditos: CreditoResumen[];
  pedidos_abiertos: number;
  ultimo_pedido: UltimoPedido | null;
  empresas_activas: number;
  cliente: ClienteInfo | null;
  ubicacion: UbicacionCliente | null;
}

export interface TasaBcv {
  tasa: number;
  fecha: string;
  fuente: string;
}

export interface VisitaComercial {
  fecha: string;
  vendedor: string;
  tipo_visita?: string;
  presencial?: boolean;
  observaciones?: string | null;
}

export interface ProximaVisita {
  fecha: string;
  vendedor: string;
}

export interface ProductoDescuento {
  id: number;
  material_id: string;
  nombre: string;
  foto: string | null;
  precio_neto: number;
  precio_bruto: number;
  porc_descuento: number;
  moneda: string;
  unidad_medida: string;
  empresa_id: number;
  empresa_nombre: string | null;
}
