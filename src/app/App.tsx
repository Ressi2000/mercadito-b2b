import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "../contexts/AuthContext";
import { CarritoProvider } from "../contexts/CarritoContext";

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <RouterProvider router={router} />
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
