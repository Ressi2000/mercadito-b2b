// src/components/ui/AgregarRapidoButton.tsx
import { useState } from "react";
import { useCarrito } from "../../contexts/CarritoContext";
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
 */
export default function AgregarRapidoButton({ empresaId, materialId, snapshot, disabled }: AgregarRapidoButtonProps) {
  const { carrito, carritosPorEmpresa, agregar } = useCarrito();
  const [agregando, setAgregando] = useState(false);

  const carritoActivo = carrito?.mercancia_id === empresaId ? carrito : carritosPorEmpresa[empresaId];
  const cantidadEnCarrito = carritoActivo?.items.find((i) => i.material_id === materialId)?.cantidad ?? 0;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || agregando) return;
    setAgregando(true);
    try {
      await agregar(empresaId, materialId, 1, snapshot);
    } catch {
      // Error disponible en el context del carrito — mismo patrón que ProductCard.
    } finally {
      setAgregando(false);
    }
  };

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
