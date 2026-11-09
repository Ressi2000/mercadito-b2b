// src/components/layout/Sidebar.tsx

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface NavChild {
  label: string;
  to: string;
}

interface NavItem {
  label: string;
  to?: string;
  icon: React.ReactNode;
  children?: NavChild[];
  locked?: boolean;
}

const PEDIDOS_PATHS = ["/inicio", "/empresas", "/catalogo", "/carrito", "/confirmacion", "/pedidos"];

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Pedidos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    children: [
      { label: "Nuevo pedido", to: "/inicio" },
      { label: "Mis pedidos", to: "/pedidos" },
    ],
  },
  {
    label: "Cuentas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <rect x="4" y="4.5" width="16" height="15" rx="2" />
        <path strokeLinecap="round" d="M8 9.5h8M8 13.5h5" />
      </svg>
    ),
    locked: true,
  },
  {
    label: "Pagos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path strokeLinecap="round" d="M3 10h18" />
      </svg>
    ),
    locked: true,
  },
  {
    label: "Soporte",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.142-4.03 7.5-9 7.5a10.05 10.05 0 01-2.555-.337L4.5 21l1.591-3.182A7.462 7.462 0 013 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5z" />
      </svg>
    ),
    locked: true,
  },
];

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5 shrink-0">
    <rect x="6" y="10" width="12" height="9" rx="1.5" />
    <path strokeLinecap="round" d="M8.5 10V7.5a3.5 3.5 0 017 0V10" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onExpand: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onCloseMobile, onExpand }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const pedidosActive = PEDIDOS_PATHS.some((p) => location.pathname.startsWith(p));
  const [pedidosOpen, setPedidosOpen] = useState(pedidosActive);

  const isCollapsedDesktop = collapsed;

  const handleGroupClick = (item: NavItem) => {
    if (item.locked) return;
    if (isCollapsedDesktop) onExpand();
    if (item.label === "Pedidos") setPedidosOpen((prev) => !prev || isCollapsedDesktop);
  };

  const handleNavigate = (to: string) => {
    navigate(to);
    onCloseMobile();
  };

  const torreSindoni = (
    <img
      src="/sidebar/torre-sindoni.png"
      alt=""
      aria-hidden="true"
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 max-w-none opacity-[0.07] pointer-events-none select-none"
    />
  );

  const content = (
    <nav className="relative z-10 flex flex-col h-full">
      {/* Logo — mismo asset que en el login (GRiCt.png), en vez del ícono +
          texto de antes. Es un isologo ancho (wordmark), no un ícono
          cuadrado — solo entra bien expandido; colapsado (76px) se
          mantiene el ícono compacto de siempre, si no quedaría cortado a
          la mitad. */}
      <button
        onClick={() => handleNavigate("/dashboard")}
        className="flex items-center justify-center gap-3 px-4 pt-4 pb-3 shrink-0 group"
      >
        {isCollapsedDesktop ? (
          <div className="w-9 h-9 rounded-xl bg-brand-primary-500/20 border border-brand-primary-500/30 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-brand-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
        ) : (
          <img
            src="/logo/GRiCt.png"
            alt="GesRutas iClient"
            className="h-auto w-auto object-contain mx-auto transition-opacity group-hover:opacity-90"
          />
        )}
      </button>

      {!isCollapsedDesktop && (
        <div className="px-4 pb-3">
          <div className="tricolor-stripe w-11">
            <span style={{ background: "linear-gradient(180deg, #00b25a, #007a3d)" }} />
            <span style={{ background: "linear-gradient(180deg, #ffffff, #e6e1d3)" }} />
            <span style={{ background: "linear-gradient(180deg, #e0323e, #a91f29)" }} />
          </div>
        </div>
      )}

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isGroup = !!item.children;
          const isActive = item.to
            ? location.pathname.startsWith(item.to)
            : item.label === "Pedidos"
              ? pedidosActive
              : false;

          if (!isGroup) {
            return (
              <button
                key={item.label}
                onClick={() => (item.locked ? undefined : handleNavigate(item.to!))}
                disabled={item.locked}
                title={item.locked ? `${item.label} — Próximamente` : item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  item.locked
                    ? "text-brand-neutral-600 cursor-default opacity-60"
                    : isActive
                      ? "bg-brand-primary-500/15 text-brand-primary-300 border-l-2 border-brand-primary-500 -ml-px"
                      : "text-brand-neutral-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {!isCollapsedDesktop && <span className="truncate">{item.label}</span>}
                {!isCollapsedDesktop && item.locked && <LockIcon />}
              </button>
            );
          }

          const groupExpanded = isCollapsedDesktop ? false : pedidosOpen;

          return (
            <div key={item.label}>
              <button
                onClick={() => handleGroupClick(item)}
                title={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isActive && !groupExpanded
                    ? "bg-brand-primary-500/15 text-brand-primary-300"
                    : "text-brand-neutral-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {!isCollapsedDesktop && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    <ChevronIcon open={groupExpanded} />
                  </>
                )}
              </button>

              {!isCollapsedDesktop && groupExpanded && (
                <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-0.5">
                  {item.children!.map((child) => {
                    const childActive = location.pathname === child.to;
                    return (
                      <button
                        key={child.to}
                        onClick={() => handleNavigate(child.to)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                          childActive
                            ? "text-brand-primary-300 font-medium"
                            : "text-brand-neutral-400 hover:text-white"
                        }`}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-white/10 space-y-1 shrink-0">
        <button
          onClick={() => handleNavigate("/perfil")}
          title="Mi perfil"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
            location.pathname === "/perfil"
              ? "bg-brand-primary-500/15 text-brand-primary-300"
              : "text-brand-neutral-300 hover:bg-white/5 hover:text-white"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <circle cx="12" cy="8" r="3.5" />
            <path strokeLinecap="round" d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
          </svg>
          {!isCollapsedDesktop && <span className="truncate">Mi Perfil</span>}
        </button>

        <button
          onClick={logout}
          title="Cerrar sesión"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-neutral-400 hover:bg-white/5 hover:text-white transition-colors duration-150"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          {!isCollapsedDesktop && <span className="truncate">Cerrar sesión</span>}
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden bg-gradient-to-b from-brand-neutral-900 via-brand-neutral-800 to-brand-neutral-900 border-r border-white/10 transition-all duration-200 ${
          isCollapsedDesktop ? "w-[76px]" : "w-64"
        }`}
      >
        {!isCollapsedDesktop && torreSindoni}
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onCloseMobile}
          />
          <aside className="absolute left-0 top-0 h-full w-72 overflow-hidden bg-gradient-to-b from-brand-neutral-900 via-brand-neutral-800 to-brand-neutral-900 border-r border-white/10 animate-slide-up">
            {torreSindoni}
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
