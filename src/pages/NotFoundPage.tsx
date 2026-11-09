// src/pages/NotFoundPage.tsx
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import NotFoundIllustration from "../components/illustrations/NotFoundIllustration";

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-6 py-16 animate-fade-in">
      <NotFoundIllustration size={168} />

      <div className="space-y-1.5">
        <h2 className="text-lg font-bold text-brand-neutral-900">Esta ruta no existe</h2>
        <p className="text-sm text-brand-neutral-500 max-w-sm">
          La página que buscás no está o cambió de lugar. Revisá el enlace o volvé al inicio.
        </p>
      </div>

      <Link to="/dashboard">
        <Button variant="primary">Ir al Dashboard</Button>
      </Link>
    </div>
  );
}
