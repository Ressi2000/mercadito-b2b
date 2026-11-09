import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificacionProvider } from "../contexts/NotificacionContext";
import { CarritoProvider } from "../contexts/CarritoContext";
import { CatalogoProvider } from "../contexts/CatalogoContext";

function App() {
  return (
    <AuthProvider>
      <NotificacionProvider>
        <CarritoProvider>
          <CatalogoProvider>
            <RouterProvider router={router} />
          </CatalogoProvider>
        </CarritoProvider>
      </NotificacionProvider>
    </AuthProvider>
  );
}

export default App;
