// src/components/RouteErrorBoundary.tsx
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import Button from "./ui/Button";
import ErrorIllustration from "./illustrations/ErrorIllustration";

// errorElement de React Router: reemplaza SOLO el <Outlet/> de la ruta
// donde se declara (o toda la app si se pone en la raíz), sin tirar
// abajo el resto del árbol de componentes. Antes, cualquier excepción de
// render en cualquier página dejaba toda la app en blanco sin mensaje.
export default function RouteErrorBoundary() {
  const error = useRouteError();

  if (import.meta.env.DEV) {
    console.error("[RouteErrorBoundary]", error);
  }

  const detalle = isRouteErrorResponse(error)
    ? `Error ${error.status}`
    : error instanceof Error
      ? error.message
      : null;

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-6 py-16 animate-fade-in">
      <ErrorIllustration size={148} />

      <div className="space-y-1.5">
        <h2 className="text-lg font-bold text-brand-neutral-900">Algo salió mal</h2>
        <p className="text-sm text-brand-neutral-500 max-w-sm">
          No pudimos cargar esta pantalla. Podés intentar de nuevo o volver al
          inicio — el resto de la app sigue funcionando normalmente.
        </p>
        {import.meta.env.DEV && detalle && (
          <p className="text-xs font-mono text-brand-neutral-400 mt-2 max-w-md break-words">{detalle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
        <Link to="/dashboard">
          <Button variant="primary">Ir al Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
