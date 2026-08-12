// src/app/routes.tsx
import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import GuestRoute from "../components/GuestRoute";
import TricolorSpinner from "../components/ui/TricolorSpinner";

// LoginPage se mantiene con import estático: es lo primero que ve cualquier
// usuario no autenticado, cargarlo "lazy" solo agregaría un parpadeo extra
// a lo que hoy es prácticamente instantáneo. El resto de las páginas viven
// detrás de ProtectedRoute, así que separarlas en chunks propios evita que
// todos descarguen el código de los otros 6 módulos solo para ver el login
// o el dashboard.
const RecuperarPasswordPage = lazy(() => import("../pages/auth/RecuperarPasswordPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const EmpresasPage = lazy(() => import("../pages/empresas/EmpresasPage"));
const CatalogoPage = lazy(() => import("../pages/catalogo/CatalogoPage"));
const CarritoPage = lazy(() => import("../pages/carrito/CarritoPage"));
const ConfirmacionPage = lazy(() => import("../pages/carrito/ConfirmacionPage"));
const PedidosPage = lazy(() => import("../pages/pedidos/PedidosPage"));
const PerfilPage = lazy(() => import("../pages/perfil/PerfilPage"));

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <TricolorSpinner size={36} />
    </div>
  );
}

function lazyPage(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageFallback />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: (
          // GuestRoute: si ya está autenticado, redirige a /inicio
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "/recuperar-password",
        element: (
          <GuestRoute>
            {lazyPage(RecuperarPasswordPage)}
          </GuestRoute>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard",    element: lazyPage(DashboardPage) },

      // /inicio en lugar de /empresas — más amigable para el usuario
      { path: "/inicio",       element: lazyPage(EmpresasPage) },
      { path: "/catalogo/:empresaId", element: lazyPage(CatalogoPage) },
      { path: "/carrito",      element: lazyPage(CarritoPage) },
      { path: "/confirmacion", element: lazyPage(ConfirmacionPage) },
      { path: "/pedidos",      element: lazyPage(PedidosPage) },
      { path: "/perfil",       element: lazyPage(PerfilPage) },

      // Redirigir /empresas a /inicio por compatibilidad
      { path: "/empresas",     element: <Navigate to="/inicio" replace /> },

      // Cualquier ruta desconocida dentro del área protegida → dashboard
      { path: "*",             element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
