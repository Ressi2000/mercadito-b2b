// src/components/GuestRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TricolorSpinner from "./ui/TricolorSpinner";

/**
 * Componente inverso a ProtectedRoute.
 * Si el usuario YA está autenticado, lo redirige a /dashboard.
 * Así no puede volver al login escribiendo "/" en la URL.
 */
export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, authChecked } = useAuth();

  // Esperar a que se resuelva el chequeo inicial de sesión (una sola vez).
  // No depende de "loading": enviar el form de login no debe reemplazar
  // el contenido de esta ruta.
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center py-10">
        <TricolorSpinner size={32} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}