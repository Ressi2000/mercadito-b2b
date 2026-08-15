// src/utils/carritoCalculos.test.ts
//
// Test de regresión para el bug reportado en producción: 3 productos
// agregados/incrementados casi al mismo tiempo terminaban mostrando un
// total y un desglose fiscal que no correspondía a la suma real de los
// ítems (una respuesta de red desactualizada pisaba una más reciente).
// El fix fue dejar de confiar en el snapshot del servidor y recalcular
// SIEMPRE en local a partir de los ítems actuales — estas dos funciones
// son esa única fuente de verdad, así que son lo más importante de
// cubrir con tests.
import { describe, it, expect } from "vitest";
import { calcularTotal, calcularDesgloseLocal } from "./carritoCalculos";
import type { CarritoItem } from "../models/Carrito";

function item(overrides: Partial<CarritoItem> = {}): CarritoItem {
  return {
    id: 1,
    material_id: 1,
    nombre: "Producto",
    codigo: "500001",
    foto: null,
    cantidad: 1,
    precio_unitario: 10,
    subtotal: 10,
    unidad_medida: "UND",
    moneda: "USD",
    porc_impuesto: 16,
    ...overrides,
  };
}

describe("calcularTotal", () => {
  it("suma los subtotales de todos los ítems", () => {
    const items = [item({ subtotal: 100 }), item({ subtotal: 200 }), item({ subtotal: 300 })];
    expect(calcularTotal(items)).toBe(600);
  });

  it("devuelve 0 para un carrito vacío", () => {
    expect(calcularTotal([])).toBe(0);
  });

  it(
    "caso real reportado: 3 productos a cantidad 10 (precios 16.92/19.08/20.40) " +
      "dan el total exacto, no un valor mezclado de un instante intermedio",
    () => {
      const items = [
        item({ subtotal: 169.2 }),
        item({ subtotal: 190.8 }),
        item({ subtotal: 204.0 }),
      ];
      expect(calcularTotal(items)).toBeCloseTo(564.0, 2);
    }
  );
});

describe("calcularDesgloseLocal", () => {
  it("devuelve null para un carrito vacío", () => {
    expect(calcularDesgloseLocal([], 0)).toBeNull();
  });

  it("clasifica correctamente 16% / 8% / exento por ítem", () => {
    const items = [
      item({ subtotal: 100, porc_impuesto: 16 }),
      item({ subtotal: 50, porc_impuesto: 8 }),
      item({ subtotal: 25, porc_impuesto: 0 }),
    ];
    const desglose = calcularDesgloseLocal(items, 0)!;

    expect(desglose.subtotal_16).toBe(100);
    expect(desglose.subtotal_8).toBe(50);
    expect(desglose.subtotal_exento).toBe(25);
    expect(desglose.iva_16).toBeCloseTo(16, 2);
    expect(desglose.iva_8).toBeCloseTo(4, 2);
  });

  it("aplica el % de retención cacheado sobre el IVA (no sobre la factura completa)", () => {
    const items = [item({ subtotal: 100, porc_impuesto: 16 })];
    // iva = 16; retención 5% del IVA = 0.8 (no del total con iva, 116)
    const desglose = calcularDesgloseLocal(items, 5)!;

    expect(desglose.retencion).toBeCloseTo(0.8, 2);
    expect(desglose.total_retencion).toBeCloseTo(115.2, 2);
  });

  it(
    "caso real reportado: el desglose de 3 productos concurrentes siempre " +
      "cuadra con la suma de sus subtotales, sin importar el orden en que " +
      "cada uno se haya sincronizado con el servidor",
    () => {
      const items = [
        item({ subtotal: 169.2, porc_impuesto: 16 }),
        item({ subtotal: 190.8, porc_impuesto: 16 }),
        item({ subtotal: 204.0, porc_impuesto: 16 }),
      ];
      const desglose = calcularDesgloseLocal(items, 0)!;

      expect(desglose.subtotal_16).toBeCloseTo(564.0, 2);
      expect(desglose.subtotal_8).toBe(0);
      expect(desglose.subtotal_exento).toBe(0);
      expect(calcularTotal(items)).toBeCloseTo(564.0, 2);
    }
  );
});
