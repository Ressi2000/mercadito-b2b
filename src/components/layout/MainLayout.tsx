// src/components/layout/MainLayout.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { Outlet, useNavigate, useLocation, useMatch } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCarrito } from "../../contexts/CarritoContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { totalItemsGlobal, carritosPorEmpresa, setCarritoActivo } = useCarrito();
  const navigate = useNavigate();
  const location = useLocation();
  // useMatch funciona en cualquier nivel del árbol de rutas (a diferencia de useParams)
  // que solo devuelve params de la ruta donde está el componente actual
  const matchCatalogo = useMatch("/catalogo/:empresaId");
  const empresaActivaId = matchCatalogo?.params.empresaId ? +matchCatalogo.params.empresaId : null;

  const [carritoOpen, setCarritoOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initial = user?.email?.charAt(0).toUpperCase() ?? "U";

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCarritoOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cerrar dropdown al cambiar de ruta
  useEffect(() => {
    setCarritoOpen(false);
  }, [location.pathname]);

  // Empresas que tienen ítems en el carrito
  const empresasConItems = Object.values(carritosPorEmpresa).filter(
    (c) => c.items.length > 0
  );

  const handleCarritoClick = useCallback(() => {
    if (totalItemsGlobal === 0) return;

    if (empresasConItems.length === 1) {
      // Solo una empresa — ir directo
      setCarritoActivo(empresasConItems[0].mercancia_id);
      navigate("/carrito");
    } else if (empresasConItems.length > 1) {
      // Varias empresas — mostrar dropdown
      setCarritoOpen((prev) => !prev);
    }
  }, [empresasConItems, totalItemsGlobal, setCarritoActivo, navigate]);

  const handleSeleccionarEmpresa = useCallback(
    (empresaId: number) => {
      setCarritoActivo(empresaId);
      setCarritoOpen(false);
      navigate("/carrito");
    },
    [setCarritoActivo, navigate]
  );

  return (
    <div className="min-h-screen bg-brand-slate-50 flex flex-col">

      {/* ── Header ── */}
      <header className="relative">
        {/* Fondo y decoraciones (sin cambios) */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-slate-900 via-brand-slate-800 to-brand-slate-900" />
        <div
          className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none animate-float"
          style={{ background: "radial-gradient(circle, #0d9488, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-8 right-32 w-36 h-36 rounded-full opacity-15 blur-2xl pointer-events-none"
          style={{
            background: "radial-gradient(circle, #f59e0b, transparent 70%)",
            animation: "float 5s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-teal-500 to-transparent opacity-60" />

        <div className="relative max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

          {/* Branding */}
          <button onClick={() => navigate("/inicio")} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-brand-teal-500/20 border border-brand-teal-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-base font-semibold text-white leading-tight tracking-wide group-hover:text-brand-teal-300 transition-colors">
                B2B Minerals
              </h1>
              <p className="text-xs text-brand-teal-400 leading-tight">Portal empresarial</p>
            </div>
          </button>

          {/* Acciones */}
          <div className="flex items-center gap-5">

            {/* Pedidos */}
            <button
              onClick={() => navigate("/pedidos")}
              className="flex items-center gap-2 text-sm font-medium text-brand-slate-400 hover:text-white transition-colors duration-200 group"
            >
              <svg className="w-5 h-5 group-hover:text-brand-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              <span className="hidden sm:inline">Pedidos</span>
            </button>

            {/* ── Carrito ── */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleCarritoClick}
                disabled={totalItemsGlobal === 0}
                className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-brand-teal-500/10 hover:bg-brand-teal-500/20 border border-brand-teal-500/20 hover:border-brand-teal-500/40 disabled:opacity-40 disabled:cursor-default transition-all duration-200 group"
                title={totalItemsGlobal === 0 ? "El carrito está vacío" : "Ver carrito"}
                aria-expanded={carritoOpen}
                aria-haspopup={empresasConItems.length > 1 ? "listbox" : undefined}
              >
                <svg className="w-5 h-5 text-brand-slate-400 group-hover:text-brand-teal-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>

                {/* Badge — reactivo a optimistic updates */}
                {totalItemsGlobal > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-teal-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {totalItemsGlobal > 99 ? "99+" : totalItemsGlobal}
                  </span>
                )}
              </button>

              {/* Dropdown multi-empresa */}
              {carritoOpen && empresasConItems.length > 1 && (
                <div
                  className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border border-white/10 animate-slide-up z-50 overflow-hidden"
                  style={{ background: "rgba(15,23,42,0.97)", backdropFilter: "blur(24px)" }}
                  role="listbox"
                  aria-label="Seleccionar carrito"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs font-semibold text-brand-slate-400 uppercase tracking-widest">
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
                        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors duration-150 border-b border-white/5 last:border-0 group/item"
                        role="option"
                        aria-selected={esActual}
                      >
                        <div className="text-left flex items-center gap-2.5">
                          {/* Indicador de empresa actual */}
                          {esActual && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-400 shrink-0" />
                          )}
                          <div>
                            <p className={`text-sm font-semibold transition-colors ${esActual ? "text-brand-teal-300" : "text-white group-hover/item:text-brand-teal-300"}`}>
                              {(c as any).nombre_mercancia ?? `Empresa #${c.mercancia_id}`}
                              {esActual && (
                                <span className="ml-2 text-[10px] font-normal text-brand-teal-400/70">
                                  actual
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-brand-slate-400 mt-0.5 tabular-nums">
                              {totalItems} {totalItems === 1 ? "producto" : "productos"}
                              {" · "}
                              {c.items[0]?.moneda ?? "$"} {c.total_estimado.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 text-brand-slate-500 group-hover/item:text-brand-teal-400 transition-colors shrink-0"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info usuario */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.email}</p>
              <p className="text-xs text-brand-slate-400">Cliente #{user?.cliente_id}</p>
            </div>

            {/* Avatar — navega a /perfil */}
            <button
              onClick={() => navigate("/perfil")}
              title="Mi perfil"
              className="relative group"
            >
              <div className="h-9 w-9 rounded-xl bg-brand-teal-500/20 border border-brand-teal-500/40 text-brand-teal-300 flex items-center justify-center font-semibold text-sm group-hover:bg-brand-teal-500/30 group-hover:border-brand-teal-500/60 transition-all duration-200">
                {initial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-teal-400 rounded-full border-2 border-brand-slate-900" />
            </button>

            <div className="w-px h-6 bg-brand-slate-700" />

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm font-medium text-brand-slate-400 hover:text-white transition-colors duration-200 group"
            >
              <svg className="w-4 h-4 group-hover:text-brand-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>

          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}