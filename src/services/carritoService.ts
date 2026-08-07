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
import type { Carrito, CarritoItem } from "../models/Carrito";

// Respuesta del nuevo agregarItem del backend
interface AgregarItemResponse {
  item: CarritoItem;
  carrito_id: number;
  codigo_pedido_web: string;
  total_estimado: number;
  mercancia_id: number;
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
): Promise<void> {
  await api.patch(`/mercadito/carrito/items/${itemId}`, { cantidad });
}

export async function eliminarItem(itemId: number): Promise<void> {
  await api.delete(`/mercadito/carrito/items/${itemId}`);
}

export async function vaciarCarrito(empresaId: number): Promise<void> {
  await api.delete(`/mercadito/carrito/${empresaId}`);
}

// ── Debounced updater ─────────────────────────────────────────────────────────

export interface ActualizadorDebounced {
  schedule: (itemId: number, cantidad: number) => void;
  cancelAll: () => void;
}

export function crearActualizadorDebounced(delayMs = 600): ActualizadorDebounced {
  const timers: Record<number, ReturnType<typeof setTimeout>> = {};

  const schedule = (itemId: number, cantidad: number) => {
    if (timers[itemId]) clearTimeout(timers[itemId]);
    timers[itemId] = setTimeout(async () => {
      delete timers[itemId];
      try {
        await actualizarCantidad(itemId, cantidad);
      } catch {
        if (import.meta.env.DEV) {
          console.warn(`[carritoService] Error sincronizando ítem ${itemId}`);
        }
      }
    }, delayMs);
  };

  const cancelAll = () => {
    Object.values(timers).forEach(clearTimeout);
  };

  return { schedule, cancelAll };
}
