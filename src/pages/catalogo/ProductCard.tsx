// src/pages/catalogo/ProductCard.tsx
//
// FIX CRÍTICO:
// ─────────────────────────────────────────────────────────────────────────────
// Mismo bug que en CarritoPage: el debounce enviaba requests con ID temporal.
// FIX: Solo llamar updater.schedule() cuando itemEnCarrito.id > 0 (ID real).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useRef, useEffect } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useCarrito } from "../../contexts/CarritoContext";
import { crearActualizadorDebounced } from "../../services/carritoService";
import type { Material } from "../../models/Material";

interface ProductCardProps {
  material: Material;
  empresaId: number;
  style?: React.CSSProperties;
}

function ImagePlaceholder({ nombre }: { nombre: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-slate-100 to-brand-slate-200">
      <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center text-2xl font-bold text-brand-teal-600">
        {nombre?.charAt(0).toUpperCase() ?? "M"}
      </div>
      <span className="text-xs text-brand-slate-400 font-medium">Sin imagen</span>
    </div>
  );
}

export default function ProductCard({ material, empresaId, style }: ProductCardProps) {
  const { carrito, carritosPorEmpresa, agregar, actualizarLocal, eliminar } = useCarrito();
  const [agregando, setAgregando] = useState(false);

  const updater = useRef(crearActualizadorDebounced(500));
  useEffect(() => () => updater.current.cancelAll(), []);

  const tienePrecio = material.PrecioNeto !== undefined && material.PrecioNeto !== null;

  const carritoActivo =
    carrito?.mercancia_id === empresaId ? carrito : carritosPorEmpresa[empresaId];

  const itemEnCarrito = useMemo(
    () => carritoActivo?.items.find((i) => i.material_id === material.id) ?? null,
    [carritoActivo, material.id]
  );

  const handleAgregar = async () => {
    if (!tienePrecio || agregando) return;
    setAgregando(true);
    try {
      await agregar(empresaId, material.id, 1, {
        nombre: material.TextoMaterial,
        codigo: material.MaterialId,
        foto: material.foto?.foto ?? null,
        precio_unitario: material.PrecioNeto ?? 0,
        unidad_medida: material.UnidadMed ?? "und",
        moneda: material.MonedaId ?? "$",
      });
    } catch {
      // Error disponible en context.error
    } finally {
      setAgregando(false);
    }
  };

  const handleSumar = () => {
    if (!itemEnCarrito) return;
    const nueva = itemEnCarrito.cantidad + 1;
    actualizarLocal(itemEnCarrito.id, nueva);
    // Solo hacer request si el ID es real (positivo)
    if (itemEnCarrito.id > 0) {
      updater.current.schedule(itemEnCarrito.id, nueva);
    }
  };

  const handleRestar = () => {
    if (!itemEnCarrito) return;
    if (itemEnCarrito.cantidad === 1) {
      eliminar(itemEnCarrito.id);
    } else {
      const nueva = itemEnCarrito.cantidad - 1;
      actualizarLocal(itemEnCarrito.id, nueva);
      // Solo hacer request si el ID es real (positivo)
      if (itemEnCarrito.id > 0) {
        updater.current.schedule(itemEnCarrito.id, nueva);
      }
    }
  };

  return (
    <Card
      variant="elevated"
      className="flex flex-col justify-between space-y-5 group cursor-pointer animate-slide-up"
      style={style}
    >
      <div className="h-44 rounded-xl overflow-hidden bg-brand-slate-100 relative">
        {material.foto?.foto ? (
          <img
            src={material.foto.foto}
            alt={material.TextoMaterial}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder nombre={material.TextoMaterial} />
        )}
        {material.UnidadMed && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-brand-slate-900/70 backdrop-blur-sm text-xs font-mono text-brand-slate-300 border border-white/10">
            {material.UnidadMed}
          </span>
        )}
        {itemEnCarrito && (
          <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-teal-500/90 backdrop-blur-sm text-xs font-semibold text-white">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {itemEnCarrito.cantidad} en carrito
          </span>
        )}
      </div>

      <div className="space-y-1 flex-1">
        <h3 className="text-base font-semibold text-brand-slate-900 group-hover:text-brand-teal-700 transition-colors duration-200 line-clamp-2">
          {material.TextoMaterial}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-400" />
          <p className="text-xs text-brand-slate-500 font-medium font-mono">{material.MaterialId}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-brand-slate-100">
        <div>
          {tienePrecio ? (
            <>
              <span className="text-xl font-bold text-brand-teal-600">
                {material.MonedaId ?? "$"} {material.PrecioNeto}
              </span>
              {material.UnidadMed && (
                <p className="text-xs text-brand-slate-400">por {material.UnidadMed}</p>
              )}
            </>
          ) : (
            <span className="text-sm text-brand-slate-400 italic">Sin precio</span>
          )}
        </div>

        {!itemEnCarrito ? (
          <Button
            variant="primary"
            className="text-sm min-w-[100px]"
            onClick={handleAgregar}
            disabled={!tienePrecio || agregando}
            isLoading={agregando}
          >
            Agregar
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestar}
              className="w-8 h-8 rounded-lg bg-brand-slate-100 hover:bg-brand-slate-200 disabled:opacity-40 flex items-center justify-center transition-colors duration-150 active:scale-95"
              aria-label="Restar uno"
            >
              <svg className="w-4 h-4 text-brand-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm font-bold text-brand-teal-600 tabular-nums">
              {itemEnCarrito.cantidad}
            </span>
            <button
              onClick={handleSumar}
              className="w-8 h-8 rounded-lg bg-brand-teal-500 hover:bg-brand-teal-600 disabled:opacity-40 flex items-center justify-center transition-colors duration-150 active:scale-95"
              aria-label="Sumar uno"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
