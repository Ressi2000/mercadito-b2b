// src/contexts/CatalogoContext.tsx
//
// BUG CORREGIDO:
// ─────────────────────────────────────────────────────────────────────────────
// BUG 4+8 — CLOSURE STALE en fetchCatalogo (caso refresco silencioso):
//   ANTES: fetchCatalogo dependía de [empresaActivaId] como state.
//          En el callback se comparaba empresaActivaId === empresaId,
//          pero empresaActivaId venía del closure (valor viejo = null la 1ª vez).
//          Resultado: el refresco silencioso NUNCA actualizaba los materiales.
//   AHORA: empresaActivaIdRef (useRef) permite leer el valor actual siempre,
//          sin necesidad de que fetchCatalogo dependa del state ni se recree.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { Material } from "../models/Material";
import { getMaterialesByEmpresa } from "../services/catalogoService";

interface CatalogoContextType {
  materiales: Material[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  empresaActivaId: number | null;
  fetchCatalogo: (empresaId: number, force?: boolean) => Promise<void>;
  clearCatalogo: () => void;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  materiales: Material[];
  timestamp: number;
}

const CatalogoContext = createContext<CatalogoContextType | null>(null);

export function CatalogoProvider({ children }: { children: ReactNode }) {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [empresaActivaId, setEmpresaActivaId] = useState<number | null>(null);

  const cacheRef = useRef<Record<number, CacheEntry>>({});
  // Ref para leer empresaActivaId actual sin recrear fetchCatalogo
  const empresaActivaIdRef = useRef<number | null>(null);
  useEffect(() => { empresaActivaIdRef.current = empresaActivaId; }, [empresaActivaId]);

  const fetchCatalogo = useCallback(
    async (empresaId: number, force = false) => {
      setError(null);
      setEmpresaActivaId(empresaId);
      empresaActivaIdRef.current = empresaId; // actualizar ref inmediatamente

      const cached = cacheRef.current[empresaId];
      const isFresh = cached && Date.now() - cached.timestamp < CACHE_TTL_MS;

      // Caso 1: Caché fresco → instantáneo
      if (!force && isFresh) {
        setMateriales(cached.materiales);
        return;
      }

      // Caso 2: Caché existe pero expiró → mostrar caché + refrescar en background
      if (!force && cached && !isFresh) {
        setMateriales(cached.materiales);
        setRefreshing(true);
        try {
          const data = await getMaterialesByEmpresa(empresaId);
          cacheRef.current[empresaId] = { materiales: data, timestamp: Date.now() };
          // Comparar con ref (no con el state del closure)
          if (empresaActivaIdRef.current === empresaId) {
            setMateriales(data);
          }
        } catch {
          // Silencioso — el usuario sigue viendo el caché
        } finally {
          setRefreshing(false);
        }
        return;
      }

      // Caso 3: Sin caché o force=true → carga con skeleton
      setLoading(true);
      setMateriales([]);
      try {
        const data = await getMaterialesByEmpresa(empresaId);
        cacheRef.current[empresaId] = { materiales: data, timestamp: Date.now() };
        setMateriales(data);
      } catch {
        setError("No se pudo cargar el catálogo. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    },
    [] // Sin dependencias: usa refs para estado mutable
  );

  const clearCatalogo = useCallback(() => {
    setMateriales([]);
    setEmpresaActivaId(null);
    empresaActivaIdRef.current = null;
    setError(null);
    cacheRef.current = {};
  }, []);

  return (
    <CatalogoContext.Provider
      value={{ materiales, loading, refreshing, error, empresaActivaId, fetchCatalogo, clearCatalogo }}
    >
      {children}
    </CatalogoContext.Provider>
  );
}

export function useCatalogo() {
  const ctx = useContext(CatalogoContext);
  if (!ctx) throw new Error("useCatalogo debe usarse dentro de CatalogoProvider");
  return ctx;
}
