// src/pages/catalogo/FiltrosCatalogo.tsx
import type { MaterialCategoria } from "../../models/Material";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import RangoPrecio from "./RangoPrecio";

export type OrdenCatalogo = "relevancia" | "nombre_asc" | "nombre_desc" | "precio_asc" | "precio_desc";

export interface FiltrosState {
  categoriaId: number | null;
  precioMin: number | null;
  precioMax: number | null;
  orden: OrdenCatalogo;
  soloFavoritos: boolean;
}

interface FiltrosCatalogoProps {
  search: string;
  onSearchChange: (search: string) => void;
  categorias: MaterialCategoria[];
  filtros: FiltrosState;
  onChange: (filtros: FiltrosState) => void;
  activo: boolean;
  onLimpiar: () => void;
  bounds: { min: number; max: number };
  moneda?: string;
}

const selectClass =
  "w-full rounded-xl border border-brand-neutral-300 bg-white/70 backdrop-blur-md px-3.5 py-2.5 text-sm text-brand-neutral-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0z" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6.716-4.35-9.428-8.209C.688 10.075 1.5 6 5.25 5.25 7.5 4.8 9.6 5.7 12 8.4c2.4-2.7 4.5-3.6 6.75-3.15 3.75.75 4.562 4.825 2.678 7.541C18.716 16.65 12 21 12 21z" />
  </svg>
);

export default function FiltrosCatalogo({
  search,
  onSearchChange,
  categorias,
  filtros,
  onChange,
  activo,
  onLimpiar,
  bounds,
  moneda,
}: FiltrosCatalogoProps) {
  return (
    <Card border="gold" className="space-y-5">
      {/* Buscador */}
      <Input
        placeholder="Buscar por nombre o código..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        leftIcon={<SearchIcon />}
      />

      <div className="flex flex-col sm:flex-row sm:items-end gap-5">
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
        <div className="sm:w-64 shrink-0 space-y-1.5">
          <label className="block text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide">
            Rango de precio
          </label>
          <RangoPrecio
            min={bounds.min}
            max={bounds.max}
            valueMin={filtros.precioMin ?? bounds.min}
            valueMax={filtros.precioMax ?? bounds.max}
            onChange={(min, max) => onChange({ ...filtros, precioMin: min, precioMax: max })}
            moneda={moneda}
          />
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

        {/* Solo favoritos */}
        <button
          type="button"
          onClick={() => onChange({ ...filtros, soloFavoritos: !filtros.soloFavoritos })}
          aria-pressed={filtros.soloFavoritos}
          className={`shrink-0 h-[42px] px-4 rounded-xl text-sm font-medium border flex items-center gap-2 transition-colors duration-200 ${
            filtros.soloFavoritos
              ? "bg-red-50 border-red-200 text-red-600"
              : "border-brand-neutral-300 text-brand-neutral-600 hover:bg-brand-neutral-50"
          }`}
        >
          <HeartIcon filled={filtros.soloFavoritos} />
          Favoritos
        </button>

        {activo && (
          <button
            onClick={onLimpiar}
            className="shrink-0 h-[42px] px-4 rounded-xl text-sm font-medium text-brand-primary-600 hover:bg-brand-primary-50 border border-transparent hover:border-brand-primary-100 transition-colors duration-200"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </Card>
  );
}
