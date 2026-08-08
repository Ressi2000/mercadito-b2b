// src/components/layout/NotificacionDropdown.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificaciones } from "../../contexts/NotificacionContext";
import type { Notificacion } from "../../models/Notificacion";

const TIPO_ICONO: Record<string, string> = {
  aprobado_vendedor: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  aprobado: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  rechazado: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  modificado: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z",
};

function iconoPorTipo(tipo: string) {
  return TIPO_ICONO[tipo] ?? "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0";
}

function colorPorTipo(tipo: string) {
  switch (tipo) {
    case "aprobado":
    case "aprobado_vendedor":
      return "bg-green-100 text-green-600";
    case "rechazado":
      return "bg-red-100 text-red-600";
    case "modificado":
      return "bg-orange-100 text-orange-600";
    default:
      return "bg-brand-primary-100 text-brand-primary-600";
  }
}

function tiempoRelativo(fecha: string) {
  const diffMs = Date.now() - new Date(fecha).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  return `hace ${diffD} d`;
}

function NotificacionItem({
  notificacion,
  onClick,
}: {
  notificacion: Notificacion;
  onClick: (n: Notificacion) => void;
}) {
  return (
    <button
      onClick={() => onClick(notificacion)}
      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-brand-neutral-50 transition-colors duration-150 border-b border-brand-neutral-100 last:border-0 ${
        notificacion.leida ? "" : "bg-brand-primary-50/40"
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorPorTipo(notificacion.tipo)}`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={iconoPorTipo(notificacion.tipo)} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-tight ${notificacion.leida ? "font-medium text-brand-neutral-700" : "font-semibold text-brand-neutral-900"}`}>
          {notificacion.titulo}
        </p>
        <p className="text-xs text-brand-neutral-500 mt-0.5 line-clamp-2">{notificacion.mensaje}</p>
        <p className="text-[10px] text-brand-neutral-400 mt-1">{tiempoRelativo(notificacion.created_at)}</p>
      </div>
      {!notificacion.leida && <span className="w-2 h-2 rounded-full bg-brand-primary-500 shrink-0 mt-1.5" />}
    </button>
  );
}

export default function NotificacionDropdown() {
  const { notificaciones, noLeidas, loading, marcarLeida, marcarTodas } = useNotificaciones();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClickNotificacion = async (n: Notificacion) => {
    if (!n.leida) await marcarLeida(n.id);
    setOpen(false);
    if (n.data?.pedido_id) navigate("/pedidos");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center text-brand-neutral-500 hover:bg-brand-neutral-100 transition-colors"
        title="Notificaciones"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl shadow-2xl border border-brand-neutral-200 animate-slide-up z-50 overflow-hidden bg-white"
          role="menu"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-brand-neutral-100">
            <p className="text-xs font-semibold text-brand-neutral-500 uppercase tracking-widest">
              Notificaciones
            </p>
            {noLeidas > 0 && (
              <button
                onClick={() => marcarTodas()}
                className="text-xs font-medium text-brand-primary-600 hover:text-brand-primary-700 transition-colors"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && notificaciones.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 border-2 border-brand-primary-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notificaciones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 px-4">
                <div className="w-10 h-10 rounded-xl bg-brand-neutral-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <p className="text-sm text-brand-neutral-500 text-center">Sin notificaciones por ahora.</p>
              </div>
            ) : (
              notificaciones.map((n) => (
                <NotificacionItem key={n.id} notificacion={n} onClick={handleClickNotificacion} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
