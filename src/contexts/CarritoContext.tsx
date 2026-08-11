// src/contexts/CarritoContext.tsx
//
// CAMBIOS EN ESTA VERSIÓN:
// ─────────────────────────────────────────────────────────────────────────────
// 1. agregar() usa la nueva respuesta del backend (item + metadatos del carrito)
//    en lugar del carrito completo. El ítem optimista se reemplaza con el real
//    usando el material_id como clave (no el id temporal).
//    Los botones +/- ya NO dependen del id positivo para habilitarse —
//    se habilitan en cuanto el ítem aparece en el estado (optimista o real).
//
// 2. PERSISTENCIA EN sessionStorage: carritosPorEmpresa se guarda en
//    sessionStorage en cada cambio. Al recargar la página en cualquier ruta
//    (/catalogo/2, /carrito, etc.), se restaura el estado completo de todos
//    los carritos sin necesidad de volver a EmpresasPage.
//    sessionStorage se limpia al hacer logout (clearCarrito).
//
// 3. fetchTodosLosCarritos ya NO crea carritos vacíos en BD porque el backend
//    ahora devuelve { id: null, items: [] } cuando no existe el carrito.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { Carrito, CarritoItem, DesgloseCarrito } from "../models/Carrito";
import {
  getCarrito,
  agregarItem,
  eliminarItem,
  vaciarCarrito,
} from "../services/carritoService";

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface CarritoContextType {
  carrito: Carrito | null;
  carritosPorEmpresa: Record<number, Carrito>;
  loadingCarrito: boolean;
  loadingItemId: number | null;
  loadingEmpresaId: number | null;
  error: string | null;
  totalItemsGlobal: number;

  fetchCarrito: (empresaId: number, force?: boolean) => Promise<void>;
  fetchTodosLosCarritos: (empresas: { id: number; nombre: string }[]) => Promise<void>;
  setCarritoActivo: (empresaId: number) => void;
  agregar: (empresaId: number, material_id: number, cantidad?: number, materialSnapshot?: Partial<CarritoItem>) => Promise<void>;
  actualizarLocal: (itemId: number, cantidad: number) => void;
  sincronizarTotales: (empresaId: number, total_estimado: number, desglose: DesgloseCarrito | null) => void;
  eliminar: (itemId: number) => Promise<void>;
  vaciar: (empresaId: number) => Promise<void>;
  clearCarrito: () => void;
  limpiarCarritoConfirmado: (empresaId: number) => void;
  clearError: () => void;
}

// ── sessionStorage helpers ────────────────────────────────────────────────────

const SESSION_KEY = "mercadito_carritos";

function guardarEnSession(data: Record<number, Carrito>) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch { /* cuota excedida u otro error — silencioso */ }
}

function restaurarDeSession(): Record<number, Carrito> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<number, Carrito>;
  } catch {
    return {};
  }
}

// ── Caché con TTL ─────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 30_000;

// ── Helpers puros ─────────────────────────────────────────────────────────────

function calcularTotal(items: CarritoItem[]): number {
  return items.reduce((acc, i) => acc + i.subtotal, 0);
}

// Recalcula el desglose fiscal en el cliente, en espejo de
// DesgloseFiscalService::calcular (GesRutasApi) — evita el salto visual
// donde cantidad y total se actualizan al toque pero el desglose (IVA,
// retención) queda "colgado" esperando el round-trip al servidor.
// `retencionPct` se cachea de la última respuesta real del backend, ya
// que el % de retención del cliente no viaja en cada ítem.
function calcularDesgloseLocal(items: CarritoItem[], retencionPct: number): DesgloseCarrito | null {
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

function aplicarActualizacion(c: Carrito, itemId: number, cantidad: number, retencionPct: number): Carrito {
  const items = c.items.map((i) =>
    i.id === itemId
      ? { ...i, cantidad, subtotal: +(cantidad * i.precio_unitario).toFixed(2) }
      : i
  );
  return { ...c, items, total_estimado: calcularTotal(items), desglose: calcularDesgloseLocal(items, retencionPct) };
}

function aplicarEliminacion(c: Carrito, itemId: number, retencionPct: number): Carrito {
  const items = c.items.filter((i) => i.id !== itemId);
  return { ...c, items, total_estimado: calcularTotal(items), desglose: calcularDesgloseLocal(items, retencionPct) };
}

// ── Contexto ──────────────────────────────────────────────────────────────────

const CarritoContext = createContext<CarritoContextType | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  // Restaurar carritos de session al iniciar (sobrevive recarga de página)
  const [carritosPorEmpresa, setCarritosPorEmpresa] = useState<Record<number, Carrito>>(
    () => restaurarDeSession()
  );
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [loadingCarrito, setLoadingCarrito] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState<number | null>(null);
  const [loadingEmpresaId, setLoadingEmpresaId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Record<number, { timestamp: number }>>({});
  const tempIdRef = useRef(-1);
  const carritoRef = useRef(carrito);
  const carritosPorEmpresaRef = useRef(carritosPorEmpresa);
  // % de retención del cliente, derivado de la última respuesta real del
  // backend (no viaja por ítem) — se usa para el recálculo local instantáneo.
  const retencionPctRef = useRef(0);

  const actualizarRetencionCache = useCallback((desglose: DesgloseCarrito | null | undefined) => {
    if (!desglose) return;
    const totalConIva =
      desglose.subtotal_16 + desglose.subtotal_8 + desglose.subtotal_exento + desglose.iva_16 + desglose.iva_8;
    if (totalConIva > 0) {
      retencionPctRef.current = (desglose.retencion / totalConIva) * 100;
    }
  }, []);

  useEffect(() => { carritoRef.current = carrito; }, [carrito]);
  useEffect(() => {
    carritosPorEmpresaRef.current = carritosPorEmpresa;
    // Persistir en sessionStorage en cada cambio
    guardarEnSession(carritosPorEmpresa);
  }, [carritosPorEmpresa]);

  // ── Computed ──────────────────────────────────────────────────────────────

  const totalItemsGlobal = Object.values(carritosPorEmpresa).reduce(
    (acc, c) => acc + c.items.reduce((s, i) => s + i.cantidad, 0),
    0
  );

  // ── syncCarrito ───────────────────────────────────────────────────────────

  const syncCarrito = useCallback((data: Carrito, nombre?: string) => {
    const enriched = nombre ? { ...data, nombre_mercancia: nombre } : data;
    setCarrito(enriched);
    setCarritosPorEmpresa((prev) => ({ ...prev, [data.mercancia_id]: enriched }));
    actualizarRetencionCache(data.desglose);
    if (data.id) { // solo marcar caché si el carrito existe en BD
      cacheRef.current[data.mercancia_id] = { timestamp: Date.now() };
    }
  }, [actualizarRetencionCache]);

  // ── setCarritoActivo ──────────────────────────────────────────────────────

  const setCarritoActivo = useCallback((empresaId: number) => {
    const c = carritosPorEmpresaRef.current[empresaId];
    if (c) {
      setCarrito(c);
    } else {
      // Si no está en memoria, crear un carrito vacío local sin tocar BD
      const vacio: Carrito = {
        id: 0,
        mercancia_id: empresaId,
        codigo_pedido_web: "",
        estado: "draft",
        items: [],
        total_estimado: 0,
      };
      setCarrito(vacio);
    }
  }, []);

  // ── fetchCarrito ──────────────────────────────────────────────────────────

  const fetchCarrito = useCallback(async (empresaId: number, force = false) => {
    const cache = cacheRef.current[empresaId];
    const isFresh = cache && Date.now() - cache.timestamp < CACHE_TTL_MS;

    // Si hay caché fresco en memoria, usar ese
    if (!force && isFresh && carritosPorEmpresaRef.current[empresaId]) {
      setCarrito(carritosPorEmpresaRef.current[empresaId]);
      return;
    }

    // Si hay datos en session (de otra empresa o recarga), activar inmediatamente
    // mientras se verifica con el backend
    const enSession = carritosPorEmpresaRef.current[empresaId];
    if (enSession && !force) {
      setCarrito(enSession);
    }

    setLoadingCarrito(true);
    setError(null);
    try {
      const data = await getCarrito(empresaId);
      const nombre = carritosPorEmpresaRef.current[empresaId]?.nombre_mercancia;
      syncCarrito(data, nombre);
    } catch {
      setError("No se pudo cargar el carrito.");
    } finally {
      setLoadingCarrito(false);
    }
  }, [syncCarrito]);

  // ── fetchTodosLosCarritos ─────────────────────────────────────────────────
  // El backend ya NO crea carritos vacíos — devuelve id:null si no existe.
  // Solo actualiza los nombres de empresa en los carritos que ya estén en session.

  const fetchTodosLosCarritos = useCallback(
    async (empresas: { id: number; nombre: string }[]) => {
      // Primero: actualizar nombres en los carritos ya en memoria (de session)
      // Esto es instantáneo y no requiere red
      setCarritosPorEmpresa((prev) => {
        const next = { ...prev };
        empresas.forEach((e) => {
          if (next[e.id]) {
            next[e.id] = { ...next[e.id], nombre_mercancia: e.nombre };
          }
        });
        return next;
      });

      // Segundo: cargar en background solo los que NO están en caché fresco
      const pendientes = empresas.filter((e) => {
        const cache = cacheRef.current[e.id];
        return !cache || Date.now() - cache.timestamp >= CACHE_TTL_MS;
      });

      if (pendientes.length === 0) return;

      try {
        const results = await Promise.allSettled(pendientes.map((e) => getCarrito(e.id)));
        setCarritosPorEmpresa((prev) => {
          const next = { ...prev };
          results.forEach((r, i) => {
            if (r.status === "fulfilled") {
              const empresa = pendientes[i];
              // Preservar nombre y solo actualizar si hay items reales
              // (el backend devuelve id:null si no existe el carrito)
              if (r.value.id !== null) {
                next[empresa.id] = { ...r.value, nombre_mercancia: empresa.nombre };
                cacheRef.current[empresa.id] = { timestamp: Date.now() };
              } else if (!next[empresa.id]) {
                // No existe en BD ni en session → registrar como vacío con nombre
                next[empresa.id] = {
                  ...r.value,
                  nombre_mercancia: empresa.nombre,
                };
              }
            }
          });
          return next;
        });
      } catch { /* silencioso */ }
    },
    []
  );

  // ── agregar ───────────────────────────────────────────────────────────────
  // CAMBIO PRINCIPAL: usa la nueva respuesta del backend (item + metadatos).
  // Los botones +/- se habilitan inmediatamente con el ítem optimista
  // (ya no esperan el id real del backend).

  const agregar = useCallback(
    async (
      empresaId: number,
      material_id: number,
      cantidad = 1,
      materialSnapshot?: Partial<CarritoItem>
    ) => {
      const tempId = tempIdRef.current--;

      const itemOptimista: CarritoItem = {
        id: tempId,
        material_id,
        cantidad,
        nombre: materialSnapshot?.nombre ?? "Producto",
        codigo: materialSnapshot?.codigo ?? "",
        foto: materialSnapshot?.foto ?? null,
        precio_unitario: materialSnapshot?.precio_unitario ?? 0,
        subtotal: +(cantidad * (materialSnapshot?.precio_unitario ?? 0)).toFixed(2),
        unidad_medida: materialSnapshot?.unidad_medida ?? "",
        moneda: materialSnapshot?.moneda ?? "$",
        porc_impuesto: materialSnapshot?.porc_impuesto ?? 0,
      };

      const aplicarOptimista = (c: Carrito): Carrito => {
        const existente = c.items.find((i) => i.material_id === material_id);
        let items: CarritoItem[];
        if (existente) {
          const nuevaCantidad = existente.cantidad + cantidad;
          items = c.items.map((i) =>
            i.material_id === material_id
              ? { ...i, cantidad: nuevaCantidad, subtotal: +(nuevaCantidad * i.precio_unitario).toFixed(2) }
              : i
          );
        } else {
          items = [...c.items, itemOptimista];
        }
        return { ...c, items, total_estimado: calcularTotal(items), desglose: calcularDesgloseLocal(items, retencionPctRef.current) };
      };

      const carritoBase: Carrito = carritosPorEmpresaRef.current[empresaId] ?? {
        id: 0,
        mercancia_id: empresaId,
        codigo_pedido_web: "",
        estado: "draft",
        items: [],
        total_estimado: 0,
      };

      const carritoOptimista = aplicarOptimista(carritoBase);

      // Actualizar UI inmediatamente — los botones +/- se habilitan ya
      setCarrito(carritoOptimista);
      setCarritosPorEmpresa((prev) => ({ ...prev, [empresaId]: carritoOptimista }));
      setLoadingEmpresaId(empresaId);

      try {
        const resp = await agregarItem(empresaId, material_id, cantidad);

        // Reemplazar ítem optimista (por material_id) con el real (con id positivo)
        const reemplazarConReal = (c: Carrito): Carrito => {
          const items = c.items.map((i) =>
            i.material_id === material_id ? resp.item : i
          );
          return {
            ...c,
            id: resp.carrito_id,
            codigo_pedido_web: resp.codigo_pedido_web,
            total_estimado: resp.total_estimado,
            desglose: resp.desglose,
            items,
          };
        };

        const nombre = carritosPorEmpresaRef.current[empresaId]?.nombre_mercancia;
        const carritoReal = reemplazarConReal(carritoOptimista);
        const carritoRealConNombre = nombre ? { ...carritoReal, nombre_mercancia: nombre } : carritoReal;

        actualizarRetencionCache(resp.desglose);
        setCarrito(carritoRealConNombre);
        setCarritosPorEmpresa((prev) => ({ ...prev, [empresaId]: carritoRealConNombre }));
        cacheRef.current[empresaId] = { timestamp: Date.now() };
      } catch (err: any) {
        // Revertir
        setCarrito(carritoBase.id === 0 ? null : carritoBase);
        setCarritosPorEmpresa((prev) => ({ ...prev, [empresaId]: carritoBase }));
        const msg = err.response?.data?.message ?? "No se pudo agregar el producto.";
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoadingEmpresaId(null);
      }
    },
    [actualizarRetencionCache]
  );

  // ── actualizarLocal ───────────────────────────────────────────────────────

  const actualizarLocal = useCallback((itemId: number, cantidad: number) => {
    const pct = retencionPctRef.current;
    setCarrito((prev) => prev ? aplicarActualizacion(prev, itemId, cantidad, pct) : prev);
    setCarritosPorEmpresa((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[+k].items.some((i) => i.id === itemId)) {
          next[+k] = aplicarActualizacion(next[+k], itemId, cantidad, pct);
        }
      });
      return next;
    });
  }, []);

  // ── sincronizarTotales ────────────────────────────────────────────────────
  // Aplica un total_estimado/desglose recién calculado por el backend (tras
  // agregar/actualizar/eliminar un ítem) al carrito en memoria, para que el
  // resumen fiscal nunca quede desactualizado respecto al servidor (corrige
  // cualquier redondeo del recálculo local optimista).

  const sincronizarTotales = useCallback(
    (empresaId: number, total_estimado: number, desglose: DesgloseCarrito | null) => {
      actualizarRetencionCache(desglose);
      setCarrito((prev) =>
        prev && prev.mercancia_id === empresaId ? { ...prev, total_estimado, desglose } : prev
      );
      setCarritosPorEmpresa((prev) =>
        prev[empresaId] ? { ...prev, [empresaId]: { ...prev[empresaId], total_estimado, desglose } } : prev
      );
    },
    [actualizarRetencionCache]
  );

  // ── eliminar ──────────────────────────────────────────────────────────────

  const eliminar = useCallback(async (itemId: number) => {
    const prevCarrito = carritoRef.current;
    const prevMap = carritosPorEmpresaRef.current;
    const empresaId = Object.keys(prevMap)
      .map(Number)
      .find((k) => prevMap[k].items.some((i) => i.id === itemId));

    const pct = retencionPctRef.current;
    setCarrito((prev) => prev ? aplicarEliminacion(prev, itemId, pct) : prev);
    setCarritosPorEmpresa((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[+k].items.some((i) => i.id === itemId)) {
          next[+k] = aplicarEliminacion(next[+k], itemId, pct);
        }
      });
      return next;
    });
    setLoadingItemId(itemId);

    try {
      const totales = await eliminarItem(itemId);
      if (empresaId !== undefined) {
        sincronizarTotales(empresaId, totales.total_estimado, totales.desglose);
      }
    } catch {
      if (prevCarrito) setCarrito(prevCarrito);
      setCarritosPorEmpresa(prevMap);
      setError("No se pudo eliminar el producto. Intenta de nuevo.");
    } finally {
      setLoadingItemId(null);
    }
  }, [sincronizarTotales]);

  // ── vaciar ────────────────────────────────────────────────────────────────

  const vaciar = useCallback(async (empresaId: number) => {
    const prevCarrito = carritoRef.current;
    const prevMap = carritosPorEmpresaRef.current;

    const empty = (c: Carrito): Carrito => ({ ...c, items: [], total_estimado: 0 });
    setCarrito((prev) => prev ? empty(prev) : prev);
    setCarritosPorEmpresa((prev) => ({ ...prev, [empresaId]: empty(prev[empresaId]) }));

    try {
      await vaciarCarrito(empresaId);
      cacheRef.current[empresaId] = { timestamp: 0 };
    } catch {
      if (prevCarrito) setCarrito(prevCarrito);
      setCarritosPorEmpresa(prevMap);
      setError("No se pudo vaciar el carrito.");
    }
  }, []);

  // ── clear (logout) ────────────────────────────────────────────────────────

  const clearCarrito = useCallback(() => {
    setCarrito(null);
    setCarritosPorEmpresa({});
    setError(null);
    cacheRef.current = {};
    sessionStorage.removeItem(SESSION_KEY); // limpiar al cerrar sesión
  }, []);

  // ── limpiarCarritoConfirmado ──────────────────────────────────────────────
  // Igual que clearCarrito pero solo para UNA empresa — se usa al confirmar
  // un pedido. clearCarrito() (logout) borraba TODOS los carritos en memoria,
  // incluyendo los de otras empresas que el cliente tuviera en armado.

  const limpiarCarritoConfirmado = useCallback((empresaId: number) => {
    setCarrito((prev) => (prev && prev.mercancia_id === empresaId ? null : prev));
    setCarritosPorEmpresa((prev) => {
      if (!(empresaId in prev)) return prev;
      const next = { ...prev };
      delete next[empresaId];
      return next;
    });
    cacheRef.current[empresaId] = { timestamp: 0 };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        carritosPorEmpresa,
        loadingCarrito,
        loadingItemId,
        loadingEmpresaId,
        error,
        totalItemsGlobal,
        fetchCarrito,
        fetchTodosLosCarritos,
        setCarritoActivo,
        agregar,
        actualizarLocal,
        sincronizarTotales,
        eliminar,
        vaciar,
        clearCarrito,
        limpiarCarritoConfirmado,
        clearError,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
