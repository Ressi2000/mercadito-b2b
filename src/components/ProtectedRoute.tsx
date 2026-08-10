// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TricolorSpinner from "./ui/TricolorSpinner";

export default function ProtectedRoute({ children }: any) {
  const { isAuthenticated, authChecked } = useAuth();

  if (!authChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-brand-neutral-50">
        <TricolorSpinner size={40} />
        <p className="text-sm text-brand-neutral-500">Verificando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
