import ModuleCard from "../../../components/ui/ModuleCard";
import CarouselVertical from "../../../components/ui/CarouselVertical";
import type { FavoritoSnapshot } from "../../../hooks/useFavoritos";

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M12 21s-6.716-4.35-9.428-8.209C.688 10.075 1.5 6 5.25 5.25 7.5 4.8 9.6 5.7 12 8.4c2.4-2.7 4.5-3.6 6.75-3.15 3.75.75 4.562 4.825 2.678 7.541C18.716 16.65 12 21 12 21z" />
  </svg>
);

interface FavoritosWidgetProps {
  favoritos: FavoritoSnapshot[];
  onSelect: (f: FavoritoSnapshot) => void;
}

/** Widget lateral: lista vertical y compacta de favoritos (sin agrupar por empresa) — "a un ladito", como pidió la usuaria. */
export default function FavoritosWidget({ favoritos, onSelect }: FavoritosWidgetProps) {
  return (
    <ModuleCard title="Tus favoritos" icon={<HeartIcon />} iconAccent="red" iconSize="sm">
      {favoritos.length === 0 ? (
        <p className="text-sm text-brand-neutral-400">Aún no marcaste productos como favoritos.</p>
      ) : (
        <CarouselVertical>
          {favoritos.map((f) => (
            <button
              key={f.id}
              onClick={() => onSelect(f)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-brand-neutral-50 transition-colors duration-150 text-left group"
            >
              <div className="w-10 h-10 rounded-lg shrink-0 bg-gradient-to-br from-brand-neutral-100 to-brand-neutral-200 flex items-center justify-center overflow-hidden">
                {f.foto ? (
                  <img src={f.foto} alt={f.nombre} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-brand-primary-600">{f.nombre.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-brand-neutral-900 line-clamp-1 group-hover:text-brand-primary-700 transition-colors">
                  {f.nombre}
                </p>
                <p className="text-xs text-brand-neutral-400 line-clamp-1">{f.empresaNombre}</p>
              </div>
              <p className="text-xs font-bold text-brand-primary-600 shrink-0 tabular-nums">
                {f.precio != null ? `${f.moneda} ${f.precio.toFixed(2)}` : "—"}
              </p>
            </button>
          ))}
        </CarouselVertical>
      )}
    </ModuleCard>
  );
}
