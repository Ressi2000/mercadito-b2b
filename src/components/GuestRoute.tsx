// src/components/GuestRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Componente inverso a ProtectedRoute.
 * Si el usuario YA está autenticado, lo redirige a /dashboard.
 * Así no puede volver al login escribiendo "/" en la URL.
 */
export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  // Esperar a que se resuelva la verificación de sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-brand-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}