// src/components/layout/MainLayout.tsx

import { Outlet } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const { collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile } = useSidebar();

  return (
    <div className="min-h-screen flex bg-brand-neutral-50">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
        onExpand={toggleCollapsed}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header collapsed={collapsed} onToggleCollapsed={toggleCollapsed} onOpenMobile={openMobile} />

        <main className="flex-1 relative">
          <div
            className="absolute inset-0 pointer-events-none bg-no-repeat bg-top"
            style={{ backgroundImage: "url('/body/bg-body.png')", backgroundSize: "1600px auto", opacity: 0.08 }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
