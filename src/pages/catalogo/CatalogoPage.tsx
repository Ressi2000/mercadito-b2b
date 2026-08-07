// src/pages/catalogo/CatalogoPage.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import ProductCard from "./ProductCard";
import { useCatalogo } from "../../contexts/CatalogoContext";
import { useCarrito } from "../../contexts/CarritoContext";

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
  const navigate = useNavigate();
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

  const filteredMateriales = materiales.filter(
    (m) =>
      m.TextoMaterial.toLowerCase().includes(search.toLowerCase()) ||
      m.MaterialId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">

      {/* ── Encabezado ── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate("/inicio")}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary-600 hover:text-brand-primary-700 uppercase tracking-widest transition-colors duration-200 w-fit"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Inicio
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-brand-neutral-900">Catálogo de Productos</h1>
            {/* Indicador de refresco silencioso — no interrumpe al usuario */}
            {refreshing && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary-50 border border-brand-primary-100 text-[11px] font-medium text-brand-primary-600 animate-fade-in">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-brand-primary-400 border-t-transparent animate-spin" />
                Actualizando
              </span>
            )}
          </div>

          <p className="text-brand-neutral-500 mt-1">
            Agrega productos a tu pedido directamente desde aquí.
          </p>
        </div>

        {/* Buscador */}
        <div className="w-full md:w-80 shrink-0">
          <Input
            placeholder="Buscar por nombre o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

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
              : "No hay productos disponibles."}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-sm text-brand-primary-600 hover:text-brand-primary-700 font-medium transition-colors"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>

      ) : (

        /* Grid de productos */
        <>
          <div className="flex items-center justify-between -mt-4">
            <p className="text-sm text-brand-neutral-400">
              {filteredMateriales.length}{" "}
              {filteredMateriales.length === 1 ? "producto encontrado" : "productos encontrados"}
            </p>
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
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}