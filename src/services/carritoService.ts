// src/services/carritoService.ts
//
// CAMBIOS:
// ─────────────────────────────────────────────────────────────────────────────
// 1. agregarItem ahora recibe la respuesta nueva del backend:
//    { item, carrito_id, codigo_pedido_web, total_estimado, mercancia_id }
//    En lugar del carrito completo. Más rápido porque el backend no recarga
//    todos los items con sus relaciones — solo el item nuevo.
//
// 2. getCarrito maneja el caso de carrito null (cuando el backend devuelve
//    id: null porque el carrito aún no existe para esa empresa).
// ─────────────────────────────────────────────────────────────────────────────

import api from "./api";
import type { Carrito, CarritoItem, DesgloseCarrito } from "../models/Carrito";

// Respuesta del nuevo agregarItem del backend
interface AgregarItemResponse {
  item: CarritoItem;
  carrito_id: number;
  codigo_pedido_web: string;
  total_estimado: number;
  mercancia_id: number;
  desglose: DesgloseCarrito | null;
}

export interface TotalesCarrito {
  total_estimado: number;
  desglose: DesgloseCarrito | null;
}

export async function getCarrito(empresaId: number): Promise<Carrito> {
  const response = await api.get(`/mercadito/carrito/${empresaId}`);
  return response.data.data; // puede tener id: null si no existe aún
}

export async function agregarItem(
  empresaId: number,
  material_id: number,
  cantidad: number
): Promise<AgregarItemResponse> {
  const response = await api.post(`/mercadito/carrito/${empresaId}/items`, {
    material_id,
    cantidad,
  });
  return response.data.data;
}

export async function actualizarCantidad(
  itemId: number,
  cantidad: number
): Promise<TotalesCarrito> {
  const response = await api.patch(`/mercadito/carrito/items/${itemId}`, { cantidad });
  return response.data.data;
}

export async function eliminarItem(itemId: number): Promise<TotalesCarrito> {
  const response = await api.delete(`/mercadito/carrito/items/${itemId}`);
  return response.data.data;
}

export async function vaciarCarrito(empresaId: number): Promise<void> {
  await api.delete(`/mercadito/carrito/${empresaId}`);
}

// ── Debounced updater ─────────────────────────────────────────────────────────

export interface ActualizadorDebounced {
  schedule: (itemId: number, cantidad: number) => void;
  cancelAll: () => void;
  flushAll: () => void;
}

export function crearActualizadorDebounced(
  delayMs = 600,
  onSuccess?: (itemId: number, totales: TotalesCarrito) => void
): ActualizadorDebounced {
  const timers: Record<number, ReturnType<typeof setTimeout>> = {};
  // Última cantidad programada por ítem — se necesita aparte del timer para
  // poder enviarla de inmediato en flushAll() en vez de esperar el delay.
  const pendientes: Record<number, number> = {};

  const enviar = async (itemId: number, cantidad: number) => {
    delete timers[itemId];
    delete pendientes[itemId];
    try {
      const totales = await actualizarCantidad(itemId, cantidad);
      onSuccess?.(itemId, totales);
    } catch {
      if (import.meta.env.DEV) {
        console.warn(`[carritoService] Error sincronizando ítem ${itemId}`);
      }
    }
  };

  const schedule = (itemId: number, cantidad: number) => {
    if (timers[itemId]) clearTimeout(timers[itemId]);
    pendientes[itemId] = cantidad;
    timers[itemId] = setTimeout(() => enviar(itemId, cantidad), delayMs);
  };

  const cancelAll = () => {
    Object.values(timers).forEach(clearTimeout);
    Object.keys(timers).forEach((k) => delete timers[+k]);
    Object.keys(pendientes).forEach((k) => delete pendientes[+k]);
  };

  // Envía YA cualquier cambio de cantidad que estuviera esperando el debounce,
  // en vez de descartarlo. Se usa al desmontar la fila del carrito (navegar
  // fuera de /carrito) para no perder el último ajuste del usuario — antes
  // cancelAll() lo tiraba sin enviarlo si el desmontaje caía dentro de la
  // ventana de debounce.
  const flushAll = () => {
    Object.keys(timers).forEach((key) => {
      const itemId = Number(key);
      clearTimeout(timers[itemId]);
      const cantidad = pendientes[itemId];
      delete timers[itemId];
      if (cantidad !== undefined) enviar(itemId, cantidad);
    });
  };

  return { schedule, cancelAll, flushAll };
}
