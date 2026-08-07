import Card from "../../../components/ui/Card";
import type { UbicacionCliente } from "../../../models/Dashboard";

interface MapaWidgetProps {
  ubicacion: UbicacionCliente | null;
  loading: boolean;
}

export default function MapaWidget({ ubicacion, loading }: MapaWidgetProps) {
  const lat = ubicacion?.latitud ? Number(ubicacion.latitud) : null;
  const lon = ubicacion?.longitud ? Number(ubicacion.longitud) : null;
  const tieneCoordenadas = lat !== null && lon !== null && !Number.isNaN(lat) && !Number.isNaN(lon) && lat !== 0 && lon !== 0;

  const delta = 0.01;
  const embedUrl = tieneCoordenadas
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lon! - delta}%2C${lat! - delta}%2C${lon! + delta}%2C${lat! + delta}&layer=mapnik&marker=${lat}%2C${lon}`
    : null;

  return (
    <Card variant="default" className="space-y-4">
      <h2 className="text-base font-semibold text-brand-neutral-900">Ubicación</h2>

      {loading ? (
        <div className="h-52 rounded-xl bg-brand-neutral-100 animate-pulse" />
      ) : tieneCoordenadas ? (
        <div className="rounded-xl overflow-hidden border border-brand-neutral-200 h-52">
          <iframe
            title="Ubicación del cliente"
            src={embedUrl!}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-52 rounded-xl bg-brand-neutral-50 border border-dashed border-brand-neutral-200 flex flex-col items-center justify-center gap-2 text-center px-4">
          <svg className="w-8 h-8 text-brand-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <p className="text-sm text-brand-neutral-400">Sin coordenadas registradas.</p>
        </div>
      )}

      {ubicacion?.direccion && (
        <p className="text-xs text-brand-neutral-500 leading-relaxed">
          {ubicacion.direccion}
          {ubicacion.poblacion && `, ${ubicacion.poblacion}`}
          {ubicacion.estado && `, ${ubicacion.estado}`}
        </p>
      )}
    </Card>
  );
}
