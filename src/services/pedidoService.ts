// src/services/pedidoService.ts
import api from "./api";
import type { PedidoWeb } from "../models/PedidoWeb";

export async function confirmarPedido(
  carritoId: number,
  observaciones?: string
): Promise<PedidoWeb> {
  const response = await api.post("/mercadito/pedidos/confirmar", {
    carrito_id: carritoId,
    observaciones: observaciones ?? null,
  });
  return response.data.data;
}

export async function getPedidos(): Promise<PedidoWeb[]> {
  const response = await api.get("/mercadito/pedidos");
  return response.data.data;
}

export async function getPedido(id: number): Promise<PedidoWeb> {
  const response = await api.get(`/mercadito/pedidos/${id}`);
  return response.data.data;
}