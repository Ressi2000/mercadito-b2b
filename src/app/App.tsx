import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "../contexts/AuthContext";
import { CarritoProvider } from "../contexts/CarritoContext";
import { CatalogoProvider } from "../contexts/CatalogoContext";

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <CatalogoProvider>
          <RouterProvider router={router} />
        </CatalogoProvider>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
