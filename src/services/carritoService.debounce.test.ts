// src/services/carritoService.debounce.test.ts
//
// Tests de regresión para dos bugs reales de esta sesión:
//  1. El debounce de +/- cancelaba (no enviaba) el último ajuste pendiente
//     si el componente se desmontaba dentro de la ventana de debounce —
//     "pedí 30, se guardaron 12". flushAll() lo reemplazó.
//  2. Hasta el primer click esperaba el delay completo, sintiéndose lento;
//     ahora el primer ajuste después de estar quieto se manda ya.
//
// Se mockea el módulo api.ts (la instancia de axios) — es el único punto
// real de red, tanto para el debounce como para actualizarCantidad — así
// no hay ninguna petición real y los timers son controlables a mano.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("./api", () => ({
  default: { patch: vi.fn() },
}));

import api from "./api";
import { crearActualizadorDebounced } from "./carritoService";

const patchMock = vi.mocked(api.patch);

function respuestaPatch(cantidad: number) {
  return { data: { data: { total_estimado: cantidad * 10, desglose: null } } };
}

beforeEach(() => {
  vi.useFakeTimers();
  patchMock.mockReset();
  patchMock.mockImplementation(async (_url, body: any) => respuestaPatch(body.cantidad));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("crearActualizadorDebounced", () => {
  it("el primer ajuste después de estar quieto se envía de inmediato, sin esperar el delay", async () => {
    const updater = crearActualizadorDebounced(500);
    updater.schedule(900, 11);

    await vi.advanceTimersByTimeAsync(10); // mucho menos que el delay
    expect(patchMock).toHaveBeenCalledTimes(1);
    expect(patchMock).toHaveBeenCalledWith("/mercadito/carrito/items/900", { cantidad: 11 });
  });

  it("clicks repetidos dentro de la ventana de debounce se agrupan en UN solo envío, con la última cantidad", async () => {
    const updater = crearActualizadorDebounced(500);

    updater.schedule(900, 11); // se envía ya (primer ajuste)
    await vi.advanceTimersByTimeAsync(10);
    expect(patchMock).toHaveBeenCalledTimes(1);

    // Ráfaga rápida, todavía dentro de los 500ms desde el envío anterior.
    updater.schedule(900, 12);
    await vi.advanceTimersByTimeAsync(100);
    updater.schedule(900, 13);
    await vi.advanceTimersByTimeAsync(100);
    updater.schedule(900, 14);

    // Todavía no debería haber una segunda request (el debounce sigue esperando).
    expect(patchMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(500);
    expect(patchMock).toHaveBeenCalledTimes(2);
    expect(patchMock).toHaveBeenLastCalledWith("/mercadito/carrito/items/900", { cantidad: 14 });
  });

  it("flushAll envía YA cualquier cambio pendiente, en vez de perderlo (bug real: 30 pedidos, 12 guardados)", async () => {
    const updater = crearActualizadorDebounced(500);

    updater.schedule(900, 11); // inmediato
    await vi.advanceTimersByTimeAsync(10);
    updater.schedule(900, 30); // queda pendiente en el debounce (ventana de 500ms)

    expect(patchMock).toHaveBeenCalledTimes(1); // todavía no se mandó el 30

    updater.flushAll(); // ej.: el usuario navega fuera de /carrito
    await vi.advanceTimersByTimeAsync(10);

    expect(patchMock).toHaveBeenCalledTimes(2);
    expect(patchMock).toHaveBeenLastCalledWith("/mercadito/carrito/items/900", { cantidad: 30 });
  });

  it("cancelAll SÍ descarta el cambio pendiente (comportamiento explícito, distinto de flushAll)", async () => {
    const updater = crearActualizadorDebounced(500);

    updater.schedule(900, 11);
    await vi.advanceTimersByTimeAsync(10);
    updater.schedule(900, 30);

    updater.cancelAll();
    await vi.advanceTimersByTimeAsync(1000);

    expect(patchMock).toHaveBeenCalledTimes(1); // el 30 nunca se envió
  });

  it("onStart/onFinally se llaman alrededor del request real (inmediato), para un indicador de 'sincronizando'", async () => {
    const onStart = vi.fn();
    const onFinally = vi.fn();
    const updater = crearActualizadorDebounced(500, undefined, { onStart, onFinally });

    // Primer ajuste: se envía sin esperar el delay, así que onStart ya
    // dispara en el mismo tick de schedule() — es lo que hace que el
    // indicador de "sincronizando" aparezca al instante, no con retraso.
    updater.schedule(900, 11);
    expect(onStart).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(10); // dejar resolver la promesa del request
    expect(onFinally).toHaveBeenCalledTimes(1);
  });

  it("onStart/onFinally también se llaman en un envío agrupado por debounce (no inmediato)", async () => {
    const onStart = vi.fn();
    const onFinally = vi.fn();
    const updater = crearActualizadorDebounced(500, undefined, { onStart, onFinally });

    updater.schedule(900, 11); // inmediato
    await vi.advanceTimersByTimeAsync(10);
    onStart.mockClear();
    onFinally.mockClear();

    updater.schedule(900, 12); // ahora sí cae en la ventana de debounce
    expect(onStart).not.toHaveBeenCalled(); // recién arranca cuando el timer dispare

    await vi.advanceTimersByTimeAsync(500);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onFinally).toHaveBeenCalledTimes(1);
  });
});
