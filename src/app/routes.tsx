// src/app/routes.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RecuperarPasswordPage from "../pages/auth/RecuperarPasswordPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import EmpresasPage from "../pages/empresas/EmpresasPage";
import CatalogoPage from "../pages/catalogo/CatalogoPage";
import CarritoPage from "../pages/carrito/CarritoPage";
import ConfirmacionPage from "../pages/carrito/ConfirmacionPage";
import PedidosPage from "../pages/pedidos/PedidosPage";
import PerfilPage from "../pages/perfil/PerfilPage";
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import GuestRoute from "../components/GuestRoute";

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
            <RecuperarPasswordPage />
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
      { path: "/dashboard",    element: <DashboardPage /> },

      // /inicio en lugar de /empresas — más amigable para el usuario
      { path: "/inicio",       element: <EmpresasPage /> },
      { path: "/catalogo/:empresaId", element: <CatalogoPage /> },
      { path: "/carrito",      element: <CarritoPage /> },
      { path: "/confirmacion", element: <ConfirmacionPage /> },
      { path: "/pedidos",      element: <PedidosPage /> },
      { path: "/perfil",       element: <PerfilPage /> },

      // Redirigir /empresas a /inicio por compatibilidad
      { path: "/empresas",     element: <Navigate to="/inicio" replace /> },

      // Cualquier ruta desconocida dentro del área protegida → dashboard
      { path: "*",             element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);