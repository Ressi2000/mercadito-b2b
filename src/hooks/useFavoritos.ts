// src/hooks/useFavoritos.ts
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "mercadito_favoritos_v2";

export interface FavoritoSnapshot {
  id: number;
  materialId: string;
  nombre: string;
  precio: number | null;
  moneda: string;
  foto: string | null;
  unidadMedida: string;
  empresaId: number;
}

function leerFavoritos(): Record<number, FavoritoSnapshot> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Favoritos de catálogo, persistidos en localStorage (sin backend por ahora).
 * Se guarda un snapshot liviano del producto (no solo el id) para poder
 * mostrarlos en el Dashboard sin tener que volver a consultar el catálogo
 * de cada empresa.
 */
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Record<number, FavoritoSnapshot>>(() => leerFavoritos());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
  }, [favoritos]);

  const esFavorito = useCallback((materialId: number) => materialId in favoritos, [favoritos]);

  const toggleFavorito = useCallback((snapshot: FavoritoSnapshot) => {
    setFavoritos((prev) => {
      if (prev[snapshot.id]) {
        const next = { ...prev };
        delete next[snapshot.id];
        return next;
      }
      return { ...prev, [snapshot.id]: snapshot };
    });
  }, []);

  const listaFavoritos = useMemo(() => Object.values(favoritos), [favoritos]);

  return { favoritos, listaFavoritos, esFavorito, toggleFavorito };
}
