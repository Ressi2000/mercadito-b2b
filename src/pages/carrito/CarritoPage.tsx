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
import PageHeader from "../../components/ui/PageHeader";
import Breadcrumb from "../../components/ui/Breadcrumb";
import type { CarritoItem } from "../../models/Carrito";

function CarritoItemRow({ item, empresaId }: { item: CarritoItem; empresaId: number }) {
  const { actualizarLocal, eliminar, loadingItemId, sincronizarTotales } = useCarrito();

  const updater = useRef(
    crearActualizadorDebounced(500, (_, totales) => {
      sincronizarTotales(empresaId, totales.total_estimado, totales.desglose);
    })
  );
  // flushAll (no cancelAll): si el usuario navega fuera de /carrito dentro
  // de la ventana de debounce, el último ajuste de cantidad se envía ya
  // mismo en vez de perderse en silencio.
  useEffect(() => () => updater.current.flushAll(), []);

  const isSyncing = loadingItemId === item.id;
  const tieneDescuento = !!item.porc_descuento && item.porc_descuento > 0;

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
        <p className="text-xs text-brand-neutral-500 mt-0.5 flex items-center gap-1.5">
          {tieneDescuento && (
            <span className="text-brand-neutral-400 line-through">
              {item.moneda ?? "$"} {item.precio_bruto!.toFixed(2)}
            </span>
          )}
          <span>{item.moneda ?? "$"} {item.precio_unitario.toFixed(2)} / {item.unidad_medida ?? "und"}</span>
          {tieneDescuento && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
              -{item.porc_descuento!.toFixed(1)}%
            </span>
          )}
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
      <PageHeader
        breadcrumb={
          <Breadcrumb
            items={[
              { label: "Inicio", to: "/inicio" },
              ...(carrito?.mercancia_id ? [{ label: "Catálogo", to: `/catalogo/${carrito.mercancia_id}` }] : []),
              { label: "Carrito" },
            ]}
          />
        }
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
            <circle cx="9" cy="20" r="1" fill="currentColor" stroke="none" />
            <circle cx="17" cy="20" r="1" fill="currentColor" stroke="none" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 12.2a1.5 1.5 0 001.48 1.3h7.24a1.5 1.5 0 001.47-1.18L20 8H6" />
          </svg>
        }
        title="Mi Carrito"
        subtitle={carrito?.nombre_mercancia && <span>{carrito.nombre_mercancia}</span>}
        action={
          carrito?.codigo_pedido_web && (
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-neutral-900 shadow-md shadow-brand-neutral-900/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-brand-primary-400 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <div className="leading-none">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-neutral-400">Código de pedido</p>
                <p className="text-sm font-mono font-bold text-white mt-1">{carrito.codigo_pedido_web}</p>
              </div>
            </div>
          )
        }
      />

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
          <img src="/carrito/empty.svg" alt="" aria-hidden="true" className="w-28 h-28" />
          <p className="text-brand-neutral-500 font-medium">
            {carrito?.nombre_mercancia
              ? <>El carrito de <span className="font-semibold text-brand-neutral-700">{carrito.nombre_mercancia}</span> está vacío.</>
              : "El carrito de esta empresa está vacío."}
          </p>
          <Button variant="primary" onClick={() => navigate("/inicio")}>
            Explorar empresas
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 px-6">
            {carrito.items.map((item) => (
              <CarritoItemRow key={item.id} item={item} empresaId={carrito.mercancia_id} />
            ))}
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 space-y-5 sticky top-8">
            <h2 className="text-lg font-display font-bold text-brand-neutral-900">Resumen del pedido</h2>
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

            {carrito.desglose && (
              <div className="p-4 rounded-xl bg-brand-neutral-50 space-y-1.5">
                <p className="text-xs font-semibold text-brand-neutral-500 mb-1">Desglose fiscal estimado</p>
                {[
                  ["Base imponible 16%", carrito.desglose.subtotal_16],
                  ["IVA 16%", carrito.desglose.iva_16],
                  ["Base imponible 8%", carrito.desglose.subtotal_8],
                  ["IVA 8%", carrito.desglose.iva_8],
                  ["Base exenta", carrito.desglose.subtotal_exento],
                  ["Retención", carrito.desglose.retencion],
                ].map(([label, valor]) => (
                  <div key={label as string} className="flex items-center justify-between text-sm">
                    <span className="text-brand-neutral-500">{label}</span>
                    <span className="text-brand-neutral-800 font-medium tabular-nums">
                      {carrito.items[0]?.moneda ?? "$"} {(valor as number).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

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
