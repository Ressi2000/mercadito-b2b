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

const SpinnerIcon = () => (
  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/**
 * Botón compacto de "agregar 1 al carrito" para usar en cards chicas
 * (carruseles de descuentos, favoritos) donde no entra el stepper +/-
 * completo de ProductCard. Solo suma — para bajar cantidad o quitar el
 * ítem, el catálogo/carrito de siempre. Muestra cuántos ya hay en el
 * carrito de esa empresa como una píldora al lado.
 *
 * Mismo patrón optimista que el stepper de ProductCard: una vez que el
 * ítem ya existe en el carrito, cada click suma en el estado LOCAL al
 * toque (actualizarLocal) y sincroniza con el servidor de fondo con
 * debounce — nunca espera la red ni deshabilita el botón. Antes esto
 * esperaba cada POST antes de dejar clickear de nuevo, lo cual se sentía
 * lento; ahora solo el primer click (crear el ítem, necesita el id real
 * que devuelve el backend) espera — de ahí en más es instantáneo.
 */
export default function AgregarRapidoButton({ empresaId, materialId, snapshot, disabled }: AgregarRapidoButtonProps) {
  const { carrito, carritosPorEmpresa, agregar, actualizarLocal, sincronizarTotales, iniciarSync, terminarSync } = useCarrito();
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

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    // Ya está en el carrito: sumar en local ya mismo, sin esperar red.
    if (itemEnCarrito) {
      const nueva = itemEnCarrito.cantidad + 1;
      actualizarLocal(itemEnCarrito.id, nueva);
      // Solo hacer request si el id ya es real (positivo) — igual que en
      // ProductCard: mientras el primer POST sigue en vuelo, estos clicks
      // quedan en local y se reconcilian solos cuando ese POST resuelve.
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

  const cantidadEnCarrito = itemEnCarrito?.cantidad ?? 0;

  return (
    <div className="flex items-center gap-1 shrink-0">
      {cantidadEnCarrito > 0 && (
        <span className="text-[10px] font-bold text-brand-primary-600 bg-brand-primary-50 rounded-full px-1.5 py-0.5 tabular-nums">
          {cantidadEnCarrito}
        </span>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || agregando}
        aria-label="Agregar al carrito"
        title="Agregar al carrito"
        className="w-7 h-7 shrink-0 rounded-full bg-brand-primary-600 hover:bg-brand-primary-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center justify-center text-white transition-transform duration-150 active:scale-90 hover:scale-105"
      >
        {agregando ? <SpinnerIcon /> : <PlusIcon />}
      </button>
    </div>
  );
}
