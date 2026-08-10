import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "gesrutas_iclient_sidebar_collapsed";

/**
 * Estado del sidebar: colapsado (solo iconos, desktop) y drawer móvil (overlay).
 * El colapso se persiste; el drawer siempre inicia cerrado.
 */
export function useSidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === "1";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return { collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile };
}
