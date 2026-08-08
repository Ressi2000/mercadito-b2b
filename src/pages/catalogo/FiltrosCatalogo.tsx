// src/pages/catalogo/FiltrosCatalogo.tsx
import type { MaterialCategoria } from "../../models/Material";

export type OrdenCatalogo = "relevancia" | "nombre_asc" | "nombre_desc" | "precio_asc" | "precio_desc";

export interface FiltrosState {
  categoriaId: number | null;
  precioMin: string;
  precioMax: string;
  orden: OrdenCatalogo;
}

interface FiltrosCatalogoProps {
  categorias: MaterialCategoria[];
  filtros: FiltrosState;
  onChange: (filtros: FiltrosState) => void;
  activo: boolean;
  onLimpiar: () => void;
}

const selectClass =
  "w-full rounded-xl border border-brand-neutral-300 bg-white/70 backdrop-blur-md px-3.5 py-2.5 text-sm text-brand-neutral-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent";

const numberClass =
  "w-full rounded-xl border border-brand-neutral-300 bg-white/70 backdrop-blur-md px-3.5 py-2.5 text-sm text-brand-neutral-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent";

export default function FiltrosCatalogo({ categorias, filtros, onChange, activo, onLimpiar }: FiltrosCatalogoProps) {
  return (
    <div className="rounded-2xl border border-brand-neutral-200 bg-white/60 backdrop-blur-md p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        {/* Categoría */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <label htmlFor="filtro-categoria" className="block text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide">
            Categoría
          </label>
          <select
            id="filtro-categoria"
            className={selectClass}
            value={filtros.categoriaId ?? ""}
            onChange={(e) => onChange({ ...filtros, categoriaId: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {/* Rango de precio */}
        <div className="flex gap-3 sm:w-56 shrink-0">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="filtro-precio-min" className="block text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide">
              Precio mín.
            </label>
            <input
              id="filtro-precio-min"
              type="number"
              min={0}
              placeholder="0"
              className={numberClass}
              value={filtros.precioMin}
              onChange={(e) => onChange({ ...filtros, precioMin: e.target.value })}
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <label htmlFor="filtro-precio-max" className="block text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide">
              Precio máx.
            </label>
            <input
              id="filtro-precio-max"
              type="number"
              min={0}
              placeholder="Sin límite"
              className={numberClass}
              value={filtros.precioMax}
              onChange={(e) => onChange({ ...filtros, precioMax: e.target.value })}
            />
          </div>
        </div>

        {/* Orden */}
        <div className="sm:w-52 shrink-0 space-y-1.5">
          <label htmlFor="filtro-orden" className="block text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide">
            Ordenar por
          </label>
          <select
            id="filtro-orden"
            className={selectClass}
            value={filtros.orden}
            onChange={(e) => onChange({ ...filtros, orden: e.target.value as OrdenCatalogo })}
          >
            <option value="relevancia">Relevancia</option>
            <option value="nombre_asc">Nombre (A-Z)</option>
            <option value="nombre_desc">Nombre (Z-A)</option>
            <option value="precio_asc">Precio (menor a mayor)</option>
            <option value="precio_desc">Precio (mayor a menor)</option>
          </select>
        </div>

        {activo && (
          <button
            onClick={onLimpiar}
            className="shrink-0 h-[42px] px-4 rounded-xl text-sm font-medium text-brand-primary-600 hover:bg-brand-primary-50 border border-transparent hover:border-brand-primary-100 transition-colors duration-200"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
