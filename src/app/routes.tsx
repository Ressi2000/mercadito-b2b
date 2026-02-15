// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import EmpresasPage from "../pages/empresas/EmpresasPage";
import CatalogoPage from "../pages/catalogo/CatalogoPage";
import CarritoPage from "../pages/carrito/CarritoPage";
import ConfirmacionPage from "../pages/carrito/ConfirmacionPage";
import PedidosPage from "../pages/pedidos/PedidosPage";
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
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
      { path: "/empresas", element: <EmpresasPage /> },
      { path: "/catalogo/:empresaId", element: <CatalogoPage /> },
      { path: "/carrito", element: <CarritoPage /> },
      { path: "/confirmacion", element: <ConfirmacionPage /> },
      { path: "/pedidos", element: <PedidosPage /> },
    ],
  },
]);

