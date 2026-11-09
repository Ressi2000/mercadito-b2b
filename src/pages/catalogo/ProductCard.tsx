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
import type { FavoritoSnapshot } from "../../hooks/useFavoritos";

interface ProductCardProps {
  material: Material;
  empresaId: number;
  empresaNombre: string;
  style?: React.CSSProperties;
  isFavorito: boolean;
  onToggleFavorito: (snapshot: FavoritoSnapshot) => void;
}

function ImagePlaceholder({ nombre }: { nombre: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-neutral-100 to-brand-neutral-200">
      <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center text-2xl font-bold text-brand-primary-600">
        {nombre?.charAt(0).toUpperCase() ?? "M"}
      </div>
      <span className="text-xs text-brand-neutral-400 font-medium">Sin imagen</span>
    </div>
  );
}

export default function ProductCard({ material, empresaId, empresaNombre, style, isFavorito, onToggleFavorito }: ProductCardProps) {
  const { carrito, carritosPorEmpresa, agregar, actualizarLocal, eliminar, sincronizarTotales, iniciarSync, terminarSync } = useCarrito();
  const [agregando, setAgregando] = useState(false);

  const updater = useRef(
    crearActualizadorDebounced(
      500,
      (_, totales) => sincronizarTotales(empresaId, totales.total_estimado, totales.desglose),
      { onStart: iniciarSync, onFinally: terminarSync }
    )
  );
  // flushAll (no cancelAll): si la card se desmonta (scroll, filtro, cambio
  // de empresa) dentro de la ventana de debounce, el último ajuste de
  // cantidad se envía ya mismo en vez de perderse en silencio.
  useEffect(() => () => updater.current.flushAll(), []);

  const tienePrecio = material.PrecioNeto !== undefined && material.PrecioNeto !== null;

  // precio_bruto/porc_descuento pueden llegar como string (DECIMAL de SAP
  // sin cast numérico en el backend) — se normalizan acá para no romper
  // con .toFixed() si el backend todavía no está actualizado.
  const precioBruto = material.precio_bruto != null ? Number(material.precio_bruto) : null;
  const porcDescuento = material.porc_descuento != null ? Number(material.porc_descuento) : null;
  const tieneDescuento =
    porcDescuento !== null && !isNaN(porcDescuento) && porcDescuento > 0 &&
    precioBruto !== null && !isNaN(precioBruto);

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
        porc_impuesto: material.PorcImpuesto ?? 0,
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
      // Cancelar cualquier ajuste de cantidad pendiente de ESTE ítem antes
      // de eliminarlo — si no, un PATCH ya programado podía llegar después
      // del DELETE, sobre un ítem que ya no existe (404 sin manejar).
      updater.current.cancel(itemEnCarrito.id);
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
      <div className="h-44 rounded-xl overflow-hidden bg-brand-neutral-100 relative">
        {material.foto?.foto ? (
          <img
            src={material.foto.foto}
            alt={material.TextoMaterial}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder nombre={material.TextoMaterial} />
        )}
        {material.UnidadMed && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-brand-neutral-900/70 backdrop-blur-sm text-xs font-mono text-brand-neutral-300 border border-white/10">
            {material.UnidadMed}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito({
              id: material.id,
              materialId: material.MaterialId,
              nombre: material.TextoMaterial,
              precio: material.PrecioNeto ?? null,
              moneda: material.MonedaId ?? "$",
              foto: material.foto?.foto ?? null,
              unidadMedida: material.UnidadMed ?? "und",
              porcImpuesto: material.PorcImpuesto ?? 0,
              empresaId,
              empresaNombre,
            });
          }}
          aria-label={isFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          aria-pressed={isFavorito}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-transform duration-150 active:scale-90 hover:scale-105 ${
            isFavorito ? "text-red-600" : "text-brand-neutral-400"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill={isFavorito ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6.716-4.35-9.428-8.209C.688 10.075 1.5 6 5.25 5.25 7.5 4.8 9.6 5.7 12 8.4c2.4-2.7 4.5-3.6 6.75-3.15 3.75.75 4.562 4.825 2.678 7.541C18.716 16.65 12 21 12 21z" />
          </svg>
        </button>
        {itemEnCarrito && (
          <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-primary-500/90 backdrop-blur-sm text-xs font-semibold text-white">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {itemEnCarrito.cantidad} en carrito
          </span>
        )}
      </div>

      <div className="space-y-1 flex-1">
        <h3 className="text-base font-semibold text-brand-neutral-900 group-hover:text-brand-primary-700 transition-colors duration-200 line-clamp-2">
          {material.TextoMaterial}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-400" />
          <p className="text-xs text-brand-neutral-500 font-medium font-mono">{material.MaterialId}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-brand-neutral-100">
        <div>
          {tienePrecio ? (
            <>
              {tieneDescuento && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs text-brand-neutral-400 line-through">
                    {material.MonedaId ?? "$"} {precioBruto!.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600">
                    -{porcDescuento!.toFixed(1)}%
                  </span>
                </div>
              )}
              <span className={`text-xl font-bold ${tieneDescuento ? "text-red-600" : "text-brand-primary-600"}`}>
                {material.MonedaId ?? "$"} {Number(material.PrecioNeto).toFixed(2)}
              </span>
              {material.UnidadMed && (
                <p className="text-xs text-brand-neutral-400">por {material.UnidadMed}</p>
              )}
            </>
          ) : (
            <span className="text-sm text-brand-neutral-400 italic">Sin precio</span>
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
              className="w-8 h-8 rounded-lg bg-brand-neutral-100 hover:bg-brand-neutral-200 disabled:opacity-40 flex items-center justify-center transition-colors duration-150 active:scale-95"
              aria-label="Restar uno"
            >
              <svg className="w-4 h-4 text-brand-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm font-bold text-brand-primary-600 tabular-nums">
              {itemEnCarrito.cantidad}
            </span>
            <button
              onClick={handleSumar}
              className="w-8 h-8 rounded-lg bg-brand-primary-500 hover:bg-brand-primary-600 disabled:opacity-40 flex items-center justify-center transition-colors duration-150 active:scale-95"
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
