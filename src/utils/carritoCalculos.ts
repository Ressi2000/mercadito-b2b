// src/utils/carritoCalculos.ts
//
// Cálculos puros del carrito, separados de CarritoContext para que sean
// testeables sin montar React/Context. Es la lógica exacta que corrigió
// el bug de "total mezclado entre productos concurrentes": el total y el
// desglose fiscal SIEMPRE se derivan de los ítems actuales en memoria,
// nunca de un snapshot de red que puede llegar desordenado.
import type { CarritoItem, DesgloseCarrito } from "../models/Carrito";

export function calcularTotal(items: CarritoItem[]): number {
  return items.reduce((acc, i) => acc + i.subtotal, 0);
}

// Recalcula el desglose fiscal en el cliente, en espejo de
// DesgloseFiscalService::calcular (GesRutasApi) — evita el salto visual
// donde cantidad y total se actualizan al toque pero el desglose (IVA,
// retención) queda "colgado" esperando el round-trip al servidor.
// `retencionPct` se cachea de la última respuesta real del backend, ya
// que el % de retención del cliente no viaja en cada ítem.
export function calcularDesgloseLocal(items: CarritoItem[], retencionPct: number): DesgloseCarrito | null {
  if (items.length === 0) return null;

  let subtotal16 = 0;
  let subtotal8 = 0;
  let subtotalExento = 0;

  for (const item of items) {
    const porc = item.porc_impuesto ?? 0;
    if (porc >= 15) subtotal16 += item.subtotal;
    else if (porc >= 5) subtotal8 += item.subtotal;
    else subtotalExento += item.subtotal;
  }

  const iva16 = +(subtotal16 * 0.16).toFixed(2);
  const iva8 = +(subtotal8 * 0.08).toFixed(2);
  const totalConIva = subtotal16 + subtotal8 + subtotalExento + iva16 + iva8;
  const retencion = +(totalConIva * (retencionPct / 100)).toFixed(2);

  return {
    subtotal_16: +subtotal16.toFixed(2),
    subtotal_8: +subtotal8.toFixed(2),
    subtotal_exento: +subtotalExento.toFixed(2),
    iva_16: iva16,
    iva_8: iva8,
    retencion,
    total_retencion: +(totalConIva - retencion).toFixed(2),
  };
}
