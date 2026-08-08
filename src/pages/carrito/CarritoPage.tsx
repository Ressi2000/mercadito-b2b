// src/pages/carrito/CarritoPage.tsx
//
// FIX CRÍTICO:
// ─────────────────────────────────────────────────────────────────────────────
// BUG: El debounce enviaba requests con ID temporal negativo (-1, -2, etc)
//      que el backend no encontraba (404).
// FIX: Solo llamar updater.schedule() cuando item.id > 0 (ID real del backend).
//      Mientras el ítem tiene ID temporal, solo se actualiza el estado local
//      (optimista). Cuando llega la respuesta del backend y el ID se vuelve
//      positivo, recién ahí los clicks +/- empiezan a hacer requests.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../contexts/CarritoContext";
import { crearActualizadorDebounced } from "../../services/carritoService";
import Button from "../../components/ui/Button";
import type { CarritoItem } from "../../models/Carrito";

function CarritoItemRow({ item }: { item: CarritoItem }) {
  const { actualizarLocal, eliminar, loadingItemId } = useCarrito();

  const updater = useRef(crearActualizadorDebounced(500));
  useEffect(() => () => updater.current.cancelAll(), []);

  const isSyncing = loadingItemId === item.id;

  const handleMenos = () => {
    if (item.cantidad <= 1) return;
    const nueva = item.cantidad - 1;
    actualizarLocal(item.id, nueva);
    // Solo hacer request si el ID es real (positivo)
    if (item.id > 0) {
      updater.current.schedule(item.id, nueva);
    }
  };

  const handleMas = () => {
    const nueva = item.cantidad + 1;
    actualizarLocal(item.id, nueva);
    // Solo hacer request si el ID es real (positivo)
    if (item.id > 0) {
      updater.current.schedule(item.id, nueva);
    }
  };

  return (
    <div className="flex items-center gap-5 py-5 border-b border-brand-neutral-100 last:border-0 animate-fade-in">

      <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-neutral-100 shrink-0">
        {item.foto ? (
          <img src={item.foto} alt={item.nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-neutral-100 to-brand-neutral-200">
            <span className="text-lg font-bold text-brand-primary-600">
              {item.nombre?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-brand-neutral-900 truncate">{item.nombre}</p>
        <p className="text-xs text-brand-neutral-400 font-mono">{item.codigo}</p>
        <p className="text-xs text-brand-neutral-500 mt-0.5">
          {item.moneda ?? "$"} {item.precio_unitario.toFixed(2)} / {item.unidad_medida ?? "und"}
        </p>
        {isSyncing && (
          <p className="text-[10px] text-brand-primary-400 font-medium mt-0.5 animate-pulse">
            Guardando…
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleMenos}
          disabled={item.cantidad <= 1}
          className="w-8 h-8 rounded-lg bg-brand-neutral-100 hover:bg-brand-neutral-200 disabled:opacity-40 flex items-center justify-center transition-colors duration-150 active:scale-95"
        >
          <svg className="w-4 h-4 text-brand-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </button>

        <span className="w-10 text-center text-sm font-semibold text-brand-neutral-900 tabular-nums">
          {item.cantidad}
        </span>

        <button
          onClick={handleMas}
          className="w-8 h-8 rounded-lg bg-brand-neutral-100 hover:bg-brand-neutral-200 disabled:opacity-40 flex items-center justify-center transition-colors duration-150 active:scale-95"
        >
          <svg className="w-4 h-4 text-brand-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      <div className="text-right shrink-0 w-28">
        <p className="text-base font-bold text-brand-neutral-900 tabular-nums">
          {item.moneda ?? "$"} {item.subtotal.toFixed(2)}
        </p>
      </div>

      <button
        onClick={() => eliminar(item.id)}
        className="shrink-0 w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors duration-150 group disabled:opacity-40"
        title="Eliminar producto"
      >
        <svg className="w-4 h-4 text-brand-neutral-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  );
}

function CarritoSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-5 py-5 border-b border-brand-neutral-100 animate-pulse">
          <div className="w-16 h-16 rounded-xl bg-brand-neutral-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-brand-neutral-200 rounded w-2/3" />
            <div className="h-3 bg-brand-neutral-100 rounded w-1/4" />
          </div>
          <div className="w-24 h-8 bg-brand-neutral-100 rounded-lg" />
          <div className="w-20 h-6 bg-brand-neutral-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function CarritoPage() {
  const navigate = useNavigate();
  const { carrito, loadingCarrito, error, clearError, vaciar, fetchCarrito } = useCarrito();

  useEffect(() => {
    if (carrito?.mercancia_id) {
      sessionStorage.setItem("carritoEmpresaId", String(carrito.mercancia_id));
    }
  }, [carrito?.mercancia_id]);

  useEffect(() => {
    if (loadingCarrito) return;
    if (carrito) return;
    const empresaId = sessionStorage.getItem("carritoEmpresaId");
    if (empresaId) {
      fetchCarrito(+empresaId, true);
    } else {
      navigate("/inicio");
    }
  }, [loadingCarrito, carrito]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVaciar = async () => {
    if (!carrito) return;
    const confirmado = window.confirm("¿Vaciar el carrito por completo?");
    if (confirmado) await vaciar(carrito.mercancia_id);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col gap-1">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary-600 hover:text-brand-primary-700 uppercase tracking-widest transition-colors duration-200 w-fit"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver
        </button>
        <h1 className="text-3xl font-display font-extrabold text-brand-neutral-900">Mi Carrito</h1>
        {carrito?.codigo_pedido_web && (
          <p className="text-xs text-brand-neutral-400 font-mono">
            Pedido: {carrito.codigo_pedido_web}
          </p>
        )}
      </div>

      {error && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl animate-slide-up"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}
        >
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-600 font-medium flex-1">{error}</p>
          <button onClick={clearError} className="text-red-400 hover:text-red-600 transition-colors text-xs font-medium">
            Cerrar
          </button>
        </div>
      )}

      {loadingCarrito ? (
        <CarritoSkeleton />
      ) : !carrito || carrito.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-neutral-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <p className="text-brand-neutral-500 font-medium">Tu carrito está vacío.</p>
          <Button variant="primary" onClick={() => navigate("/inicio")}>
            Explorar empresas
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 px-6">
            {carrito.items.map((item) => (
              <CarritoItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 space-y-5 sticky top-8">
            <h2 className="text-lg font-semibold text-brand-neutral-900">Resumen del pedido</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-brand-neutral-600">
                <span>Productos ({carrito.items.length})</span>
                <span className="tabular-nums">
                  {carrito.items[0]?.moneda ?? "$"} {carrito.total_estimado.toFixed(2)}
                </span>
              </div>
              <div className="h-px bg-brand-neutral-100" />
              <div className="flex justify-between font-bold text-brand-neutral-900 text-base">
                <span>Total estimado</span>
                <span className="text-brand-primary-600 tabular-nums">
                  {carrito.items[0]?.moneda ?? "$"} {carrito.total_estimado.toFixed(2)}
                </span>
              </div>
            </div>
            <Button variant="primary" className="w-full" onClick={() => navigate("/confirmacion")}>
              Confirmar pedido
            </Button>
            <button
              onClick={() => navigate(-1)}
              className="w-full text-sm text-brand-neutral-500 hover:text-brand-primary-600 transition-colors duration-200 font-medium"
            >
              Seguir comprando
            </button>
            <div className="pt-2 border-t border-brand-neutral-100">
              <button
                onClick={handleVaciar}
                className="w-full text-xs text-brand-neutral-400 hover:text-red-500 transition-colors duration-200"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
