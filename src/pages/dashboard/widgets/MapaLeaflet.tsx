import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapaLeafletProps {
  lat: number;
  lon: number;
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

export default function MapaLeaflet({ lat, lon }: MapaLeafletProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lon],
      zoom: 15,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      className: "map-sepia-tiles",
    }).addTo(map);

    L.marker([lat, lon], { icon: pinIcon }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon]);

  return (
    <div className="rounded-xl overflow-hidden border border-brand-neutral-200 h-52">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
