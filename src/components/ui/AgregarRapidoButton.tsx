// src/components/ui/AgregarRapidoButton.tsx
import { useEffect, useRef, useState } from "react";
import { useCarrito } from "../../contexts/CarritoContext";
import { crearActualizadorDebounced } from "../../services/carritoService";
import type { CarritoItem } from "../../models/Carrito";

type SnapshotMaterial = Pick<
  CarritoItem,
  "nombre" | "codigo" | "foto" | "precio_unitario" | "unidad_medida" | "moneda" | "porc_impuesto"
>;

interface AgregarRapidoButtonProps {
  empresaId: number;
  materialId: number;
  snapshot: SnapshotMaterial;
  /** Sin precio resuelto para este cliente — no se puede agregar. */
  disabled?: boolean;
}

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const MinusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/**
 * Control compacto de cantidad para cards chicas (carruseles de
 * descuentos, favoritos) donde no entra el stepper +/- completo de
 * ProductCard: mientras el producto no está en el carrito, un botón
 * "+" solo; en cuanto entra, se convierte en el mismo mini-stepper
 * (−, cantidad, +) — para poder corregir un click de más sin tener que
 * ir al catálogo o al carrito.
 *
 * Mismo patrón optimista que ProductCard: cada click suma/resta en el
 * estado LOCAL al toque (actualizarLocal) y sincroniza con el servidor
 * de fondo con debounce — nunca espera la red ni deshabilita el botón.
 * Solo el primer "+" de un producto nuevo espera (necesita el id real
 * que devuelve el backend); de ahí en más todo es instantáneo, incluido
 * bajar la cantidad o llegar a 0 (elimina el ítem).
 */
export default function AgregarRapidoButton({ empresaId, materialId, snapshot, disabled }: AgregarRapidoButtonProps) {
  const { carrito, carritosPorEmpresa, agregar, actualizarLocal, eliminar, sincronizarTotales, iniciarSync, terminarSync } = useCarrito();
  const [agregando, setAgregando] = useState(false);

  const updater = useRef(
    crearActualizadorDebounced(
      500,
      (_, totales) => sincronizarTotales(empresaId, totales.total_estimado, totales.desglose),
      { onStart: iniciarSync, onFinally: terminarSync }
    )
  );
  useEffect(() => () => updater.current.flushAll(), []);

  const carritoActivo = carrito?.mercancia_id === empresaId ? carrito : carritosPorEmpresa[empresaId];
  const itemEnCarrito = carritoActivo?.items.find((i) => i.material_id === materialId) ?? null;

  const handleSumar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (itemEnCarrito) {
      const nueva = itemEnCarrito.cantidad + 1;
      actualizarLocal(itemEnCarrito.id, nueva);
      if (itemEnCarrito.id > 0) {
        updater.current.schedule(itemEnCarrito.id, nueva);
      }
      return;
    }

    // Primera vez para este producto: sí hay que esperar el POST, porque
    // recién ahí se consigue el id real del ítem. Pasa una sola vez.
    if (agregando) return;
    setAgregando(true);
    try {
      await agregar(empresaId, materialId, 1, snapshot);
    } catch {
      // Error disponible en el context del carrito — mismo patrón que ProductCard.
    } finally {
      setAgregando(false);
    }
  };

  const handleRestar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!itemEnCarrito) return;

    if (itemEnCarrito.cantidad === 1) {
      eliminar(itemEnCarrito.id);
      return;
    }

    const nueva = itemEnCarrito.cantidad - 1;
    actualizarLocal(itemEnCarrito.id, nueva);
    if (itemEnCarrito.id > 0) {
      updater.current.schedule(itemEnCarrito.id, nueva);
    }
  };

  if (itemEnCarrito) {
    return (
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={handleRestar}
          aria-label="Restar uno"
          title="Restar uno"
          className="w-6 h-6 shrink-0 rounded-full bg-brand-neutral-100 hover:bg-brand-neutral-200 flex items-center justify-center text-brand-neutral-700 transition-transform duration-150 active:scale-90"
        >
          <MinusIcon />
        </button>
        <span className="text-[11px] font-bold text-brand-primary-600 tabular-nums w-4 text-center">
          {itemEnCarrito.cantidad}
        </span>
        <button
          type="button"
          onClick={handleSumar}
          aria-label="Sumar uno"
          title="Sumar uno"
          className="w-6 h-6 shrink-0 rounded-full bg-brand-primary-600 hover:bg-brand-primary-700 shadow-md flex items-center justify-center text-white transition-transform duration-150 active:scale-90"
        >
          <PlusIcon />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSumar}
      disabled={disabled || agregando}
      aria-label="Agregar al carrito"
      title="Agregar al carrito"
      className="w-7 h-7 shrink-0 rounded-full bg-brand-primary-600 hover:bg-brand-primary-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center text-white transition-transform duration-150 active:scale-90 hover:scale-105"
    >
      {agregando ? <SpinnerIcon /> : <PlusIcon />}
    </button>
  );
}
