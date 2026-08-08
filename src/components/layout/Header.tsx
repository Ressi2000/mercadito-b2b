// src/components/layout/Header.tsx

import { useEffect, useRef, useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCarrito } from "../../contexts/CarritoContext";

interface HeaderProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenMobile: () => void;
}

export default function Header({ collapsed, onToggleCollapsed, onOpenMobile }: HeaderProps) {
  const { user } = useAuth();
  const { totalItemsGlobal, carritosPorEmpresa, setCarritoActivo } = useCarrito();
  const navigate = useNavigate();
  const matchCatalogo = useMatch("/catalogo/:empresaId");
  const empresaActivaId = matchCatalogo?.params.empresaId ? +matchCatalogo.params.empresaId : null;

  const [carritoOpen, setCarritoOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initial = user?.email?.charAt(0).toUpperCase() ?? "U";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCarritoOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const empresasConItems = Object.values(carritosPorEmpresa).filter((c) => c.items.length > 0);

  const handleCarritoClick = () => {
    if (totalItemsGlobal === 0) return;
    if (empresasConItems.length === 1) {
      setCarritoActivo(empresasConItems[0].mercancia_id);
      navigate("/carrito");
    } else if (empresasConItems.length > 1) {
      setCarritoOpen((prev) => !prev);
    }
  };

  const handleSeleccionarEmpresa = (empresaId: number) => {
    setCarritoActivo(empresaId);
    setCarritoOpen(false);
    navigate("/carrito");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-brand-neutral-200">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        <div className="flex items-center gap-3">
          {/* Mobile: abrir drawer */}
          <button
            onClick={onOpenMobile}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-brand-neutral-500 hover:bg-brand-neutral-100 transition-colors"
            aria-label="Abrir menú"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>

          {/* Desktop: colapsar/expandir sidebar */}
          <button
            onClick={onToggleCollapsed}
            className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center text-brand-neutral-500 hover:bg-brand-neutral-100 transition-colors"
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <rect x="3.75" y="4.5" width="16.5" height="15" rx="2" strokeLinejoin="round" />
              <path strokeLinecap="round" d="M9 4.5v15" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Notificaciones — próximamente (sin backend aún) */}
          <button
            disabled
            title="Notificaciones — próximamente"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-brand-neutral-400 cursor-default"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>

          {/* Carrito */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleCarritoClick}
              disabled={totalItemsGlobal === 0}
              className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-brand-primary-50 hover:bg-brand-primary-100 border border-brand-primary-100 disabled:opacity-40 disabled:cursor-default transition-all duration-200 group"
              title={totalItemsGlobal === 0 ? "El carrito está vacío" : "Ver carrito"}
              aria-expanded={carritoOpen}
              aria-haspopup={empresasConItems.length > 1 ? "listbox" : undefined}
            >
              <svg className="w-5 h-5 text-brand-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {totalItemsGlobal > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-primary-600 text-brand-neutral-900 text-[10px] font-bold flex items-center justify-center">
                  {totalItemsGlobal > 99 ? "99+" : totalItemsGlobal}
                </span>
              )}
            </button>

            {carritoOpen && empresasConItems.length > 1 && (
              <div
                className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border border-brand-neutral-200 animate-slide-up z-50 overflow-hidden bg-white"
                role="listbox"
                aria-label="Seleccionar carrito"
              >
                <div className="px-4 py-3 border-b border-brand-neutral-100">
                  <p className="text-xs font-semibold text-brand-neutral-500 uppercase tracking-widest">
                    Tus carritos activos
                  </p>
                </div>

                {empresasConItems.map((c) => {
                  const totalItems = c.items.reduce((a, i) => a + i.cantidad, 0);
                  const esActual = c.mercancia_id === empresaActivaId;

                  return (
                    <button
                      key={c.mercancia_id}
                      onClick={() => handleSeleccionarEmpresa(c.mercancia_id)}
                      className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-brand-neutral-50 transition-colors duration-150 border-b border-brand-neutral-100 last:border-0 group/item"
                      role="option"
                      aria-selected={esActual}
                    >
                      <div className="text-left flex items-center gap-2.5">
                        {esActual && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-500 shrink-0" />}
                        <div>
                          <p className={`text-sm font-semibold transition-colors ${esActual ? "text-brand-primary-600" : "text-brand-neutral-800 group-hover/item:text-brand-primary-600"}`}>
                            {(c as any).nombre_mercancia ?? `Empresa #${c.mercancia_id}`}
                            {esActual && <span className="ml-2 text-[10px] font-normal text-brand-primary-400">actual</span>}
                          </p>
                          <p className="text-xs text-brand-neutral-500 mt-0.5 tabular-nums">
                            {totalItems} {totalItems === 1 ? "producto" : "productos"}
                            {" · "}
                            {c.items[0]?.moneda ?? "$"} {c.total_estimado.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-brand-neutral-400 group-hover/item:text-brand-primary-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-brand-neutral-200" />

          {/* Usuario */}
          <button onClick={() => navigate("/perfil")} className="flex items-center gap-2.5 group" title="Mi perfil">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-brand-neutral-800 leading-tight">{user?.email}</p>
              <p className="text-xs text-brand-neutral-500 leading-tight">Cliente #{user?.cliente_id}</p>
            </div>
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-brand-primary-100 border border-brand-primary-200 text-brand-primary-700 flex items-center justify-center font-semibold text-sm group-hover:bg-brand-primary-200 transition-all duration-200">
                {initial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
