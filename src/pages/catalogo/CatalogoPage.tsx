// src/pages/catalogo/CatalogoPage.tsx

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import Breadcrumb from "../../components/ui/Breadcrumb";
import ProductCard from "./ProductCard";
import FiltrosCatalogo, { type FiltrosState } from "./FiltrosCatalogo";
import { useCatalogo } from "../../contexts/CatalogoContext";
import { useCarrito } from "../../contexts/CarritoContext";
import { useFavoritos } from "../../hooks/useFavoritos";
import type { MaterialCategoria } from "../../models/Material";

const FILTROS_INICIALES: FiltrosState = {
  categoriaId: null,
  precioMin: null,
  precioMax: null,
  orden: "relevancia",
  soloFavoritos: false,
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="rounded-2xl bg-white/60 border border-white/20 shadow-xl p-6 space-y-4 animate-pulse">
      <div className="h-44 rounded-xl bg-brand-neutral-200" />
      <div className="space-y-2">
        <div className="h-4 bg-brand-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-brand-neutral-100 rounded w-1/3" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-brand-neutral-100">
        <div className="h-6 bg-brand-neutral-200 rounded w-1/3" />
        <div className="h-9 bg-brand-neutral-100 rounded-xl w-24" />
      </div>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────

export default function CatalogoPage() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const empresaIdNum = Number(empresaId);

  const {
    materiales,
    loading: loadingCatalogo,
    refreshing,
    error,
    fetchCatalogo,
  } = useCatalogo();

  const {
    fetchCarrito,
    setCarritoActivo,
    loadingCarrito,
  } = useCarrito();

  const [search, setSearch] = useState("");
  const [filtros, setFiltros] = useState<FiltrosState>(FILTROS_INICIALES);
  const { esFavorito, toggleFavorito } = useFavoritos();

  useEffect(() => {
    if (!empresaIdNum) return;

    // 1. Activar carrito en memoria inmediatamente (si ya existe, es instantáneo)
    setCarritoActivo(empresaIdNum);

    // 2. Catálogo y carrito en paralelo — completamente independientes
    //    fetchCatalogo usa su propio caché de 5 min
    //    fetchCarrito usa su propio caché de 30s
    fetchCatalogo(empresaIdNum);
    fetchCarrito(empresaIdNum);

  }, [empresaIdNum]); // eslint-disable-line react-hooks/exhaustive-deps
  // Nota: [] intencional — solo re-ejecutar si cambia la empresa

  // Categorías disponibles a partir de los materiales cargados
  const categorias = useMemo(() => {
    const mapa = new Map<number, MaterialCategoria>();
    materiales.forEach((m) => {
      if (m.categoria) mapa.set(m.categoria.id, m.categoria);
    });
    return Array.from(mapa.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [materiales]);

  // Rango de precios disponible en el catálogo cargado.
  // PrecioNeto puede llegar como string desde el backend (columnas DECIMAL
  // de SAP sin cast numérico) — Number() lo normaliza en vez de descartarlo.
  const bounds = useMemo(() => {
    const precios = materiales
      .map((m) => Number(m.PrecioNeto))
      .filter((p) => !isNaN(p));
    if (precios.length === 0) return { min: 0, max: 0 };
    return { min: Math.floor(Math.min(...precios)), max: Math.ceil(Math.max(...precios)) };
  }, [materiales]);

  const moneda = materiales.find((m) => m.MonedaId)?.MonedaId ?? "USD";

  const filtrosActivos =
    filtros.categoriaId !== null ||
    (filtros.precioMin !== null && filtros.precioMin > bounds.min) ||
    (filtros.precioMax !== null && filtros.precioMax < bounds.max) ||
    filtros.orden !== "relevancia" ||
    filtros.soloFavoritos;

  const limpiarFiltros = () => setFiltros(FILTROS_INICIALES);

  const filteredMateriales = useMemo(() => {
    const min = filtros.precioMin;
    const max = filtros.precioMax;

    let resultado = materiales.filter((m) => {
      const coincideBusqueda =
        m.TextoMaterial.toLowerCase().includes(search.toLowerCase()) ||
        m.MaterialId.toLowerCase().includes(search.toLowerCase());
      if (!coincideBusqueda) return false;

      if (filtros.categoriaId !== null && m.categoria?.id !== filtros.categoriaId) return false;
      if (filtros.soloFavoritos && !esFavorito(m.id)) return false;

      const precio = m.PrecioNeto !== undefined && m.PrecioNeto !== null ? Number(m.PrecioNeto) : null;
      if (min !== null && (precio === null || isNaN(precio) || precio < min)) return false;
      if (max !== null && (precio === null || isNaN(precio) || precio > max)) return false;

      return true;
    });

    switch (filtros.orden) {
      case "nombre_asc":
        resultado = [...resultado].sort((a, b) => a.TextoMaterial.localeCompare(b.TextoMaterial));
        break;
      case "nombre_desc":
        resultado = [...resultado].sort((a, b) => b.TextoMaterial.localeCompare(a.TextoMaterial));
        break;
      case "precio_asc":
        resultado = [...resultado].sort((a, b) => Number(a.PrecioNeto ?? 0) - Number(b.PrecioNeto ?? 0));
        break;
      case "precio_desc":
        resultado = [...resultado].sort((a, b) => Number(b.PrecioNeto ?? 0) - Number(a.PrecioNeto ?? 0));
        break;
    }

    return resultado;
  }, [materiales, search, filtros, esFavorito]);

  return (
    <div className="space-y-10 animate-fade-in">

      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: "Inicio", to: "/inicio" }, { label: "Catálogo" }]} />}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h5.17a2 2 0 011.42.59l8.82 8.82a2 2 0 010 2.82l-6.76 6.76a2 2 0 01-2.82 0l-8.82-8.82A2 2 0 013 11.17V6a3 3 0 013-3z" />
            <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        }
        title="Catálogo de Productos"
        subtitle="Agrega productos a tu pedido directamente desde aquí."
        titleExtra={
          refreshing && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary-50 border border-brand-primary-100 text-[11px] font-medium text-brand-primary-600 animate-fade-in">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-brand-primary-400 border-t-transparent animate-spin" />
              Actualizando
            </span>
          )
        }
      />

      {/* ── Filtros ── */}
      <FiltrosCatalogo
        search={search}
        onSearchChange={setSearch}
        categorias={categorias}
        filtros={filtros}
        onChange={setFiltros}
        activo={filtrosActivos}
        onLimpiar={limpiarFiltros}
        bounds={bounds}
        moneda={moneda}
      />

      {/* ── Error ── */}
      {error && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.20)",
          }}
        >
          <svg
            className="w-5 h-5 text-red-400 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-600 font-medium flex-1">{error}</p>
          <button
            onClick={() => fetchCatalogo(empresaIdNum, true)}
            className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      {loadingCatalogo ? (
        // Skeleton solo en carga inicial real
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ProductSkeleton key={n} />
          ))}
        </div>
      ) : filteredMateriales.length === 0 ? (

        /* Estado vacío */
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-neutral-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-brand-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0z" />
            </svg>
          </div>
          <p className="text-brand-neutral-500 font-medium">
            {search
              ? `Sin resultados para "${search}"`
              : filtrosActivos
                ? "Ningún producto coincide con los filtros aplicados."
                : "No hay productos disponibles."}
          </p>
          {(search || filtrosActivos) && (
            <button
              onClick={() => {
                setSearch("");
                limpiarFiltros();
              }}
              className="text-sm text-brand-primary-600 hover:text-brand-primary-700 font-medium transition-colors"
            >
              Limpiar búsqueda y filtros
            </button>
          )}
        </div>

      ) : (

        /* Grid de productos */
        <>
          <div className="flex items-center justify-between -mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-xs font-semibold shadow-sm shadow-emerald-700/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
                <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
                <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
                <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
              </svg>
              {filteredMateriales.length}{" "}
              {filteredMateriales.length === 1 ? "producto encontrado" : "productos encontrados"}
            </span>
            {/* Indicador de carga del carrito — solo informativo, no bloquea */}
            {loadingCarrito && (
              <p className="text-xs text-brand-neutral-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-brand-neutral-300 border-t-transparent animate-spin" />
                Cargando carrito…
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMateriales.map((material, i) => (
              <ProductCard
                key={material.id}
                material={material}
                empresaId={empresaIdNum}
                style={{ animationDelay: `${i * 60}ms` }}
                isFavorito={esFavorito(material.id)}
                onToggleFavorito={toggleFavorito}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}