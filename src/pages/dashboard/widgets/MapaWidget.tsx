import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ModuleCard from "../../../components/ui/ModuleCard";
import type { UbicacionCliente } from "../../../models/Dashboard";

interface MapaWidgetProps {
  ubicacion: UbicacionCliente | null;
  loading: boolean;
}

// Pin dorado — placeholder hasta reemplazarlo por el SVG del cliente.
const pinIcon = L.divIcon({
  className: "",
  html: `
    <svg width="30" height="40" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pinGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f4d78e" />
          <stop offset="55%" stop-color="#d4a72c" />
          <stop offset="100%" stop-color="#a5791a" />
        </linearGradient>
      </defs>
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12.5 17 27 17 27s17-14.5 17-27C34 7.6 26.4 0 17 0z" fill="url(#pinGold)" stroke="#7d5c15" stroke-width="1" />
      <circle cx="17" cy="17" r="6.5" fill="#0a1a35" />
    </svg>
  `,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
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
