// src/app/components/layout/MainLayout
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function MainLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900">
            B2B Minerals
          </h2>

          <button
            onClick={logout}
            className="text-sm text-slate-600 hover:text-teal-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

