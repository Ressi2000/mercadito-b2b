// src/contexts/NotificacionContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getNotificaciones,
  marcarNotificacionLeida,
  marcarTodasLeidas,
} from "../services/notificacionService";
import type { Notificacion } from "../models/Notificacion";

const POLL_INTERVAL_MS = 60_000;

interface NotificacionContextType {
  notificaciones: Notificacion[];
  noLeidas: number;
  loading: boolean;
  marcarLeida: (id: number) => Promise<void>;
  marcarTodas: () => Promise<void>;
  refrescar: () => Promise<void>;
}

const NotificacionContext = createContext<NotificacionContextType | undefined>(undefined);

export const NotificacionProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotificaciones = useCallback(async () => {
    try {
      const data = await getNotificaciones();
      setNotificaciones(data.notificaciones);
      setNoLeidas(data.no_leidas);
    } catch {
      // Silencioso: la campana no debe romper la navegación si falla el polling.
    }
  }, []);

  const refrescar = useCallback(async () => {
    setLoading(true);
    try {
      await fetchNotificaciones();
    } finally {
      setLoading(false);
    }
  }, [fetchNotificaciones]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotificaciones([]);
      setNoLeidas(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    fetchNotificaciones();
    intervalRef.current = setInterval(fetchNotificaciones, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, fetchNotificaciones]);

  const marcarLeida = async (id: number) => {
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
    setNoLeidas((prev) => Math.max(0, prev - 1));
    try {
      await marcarNotificacionLeida(id);
    } catch {
      fetchNotificaciones();
    }
  };

  const marcarTodas = async () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    setNoLeidas(0);
    try {
      await marcarTodasLeidas();
    } catch {
      fetchNotificaciones();
    }
  };

  return (
    <NotificacionContext.Provider
      value={{ notificaciones, noLeidas, loading, marcarLeida, marcarTodas, refrescar }}
    >
      {children}
    </NotificacionContext.Provider>
  );
};

export const useNotificaciones = () => {
  const ctx = useContext(NotificacionContext);
  if (!ctx) throw new Error("useNotificaciones must be used within NotificacionProvider");
  return ctx;
};
