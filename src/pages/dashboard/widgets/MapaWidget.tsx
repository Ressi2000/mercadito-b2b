import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ModuleCard from "../../../components/ui/ModuleCard";
import type { UbicacionCliente } from "../../../models/Dashboard";

interface MapaWidgetProps {
  ubicacion: UbicacionCliente | null;
  loading: boolean;
}

// Ícono de tienda del cliente — ilustración animada (hojas + notificación).
// Se ancla por el centro, no por la base, porque es una escena completa,
// no un pin con punta.
const pinIcon = L.divIcon({
  className: "",
  html: `<img src="/map/My-Store-animated.svg" width="56" height="56" style="filter: drop-shadow(0 3px 4px rgba(0,0,0,0.35))" />`,
  iconSize: [56, 56],
  iconAnchor: [28, 28],
});

export default function MapaWidget({ ubicacion, loading }: MapaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const lat = ubicacion?.latitud ? Number(ubicacion.latitud) : null;
  const lon = ubicacion?.longitud ? Number(ubicacion.longitud) : null;
  const tieneCoordenadas = lat !== null && lon !== null && !Number.isNaN(lat) && !Number.isNaN(lon) && lat !== 0 && lon !== 0;

  useEffect(() => {
    if (!tieneCoordenadas || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat!, lon!],
      zoom: 15,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      className: "map-sepia-tiles",
    }).addTo(map);

    L.marker([lat!, lon!], { icon: pinIcon }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tieneCoordenadas, lat, lon]);

  return (
    <ModuleCard title="Ubicación" tricolor>
      {loading ? (
        <div className="h-52 rounded-xl bg-brand-neutral-100 animate-pulse" />
      ) : tieneCoordenadas ? (
        <div className="rounded-xl overflow-hidden border border-brand-neutral-200 h-52">
          <div ref={containerRef} className="w-full h-full" />
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
    </ModuleCard>
  );
}
