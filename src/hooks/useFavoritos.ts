// src/hooks/useFavoritos.ts
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "mercadito_favoritos";

function leerFavoritos(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

/** Favoritos de catálogo, persistidos en localStorage (sin backend por ahora). */
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Set<number>>(() => leerFavoritos());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favoritos)));
  }, [favoritos]);

  const esFavorito = useCallback((materialId: number) => favoritos.has(materialId), [favoritos]);

  const toggleFavorito = useCallback((materialId: number) => {
    setFavoritos((prev) => {
      const next = new Set(prev);
      if (next.has(materialId)) {
        next.delete(materialId);
      } else {
        next.add(materialId);
      }
      return next;
    });
  }, []);

  return { favoritos, esFavorito, toggleFavorito };
}
