// src/services/api.ts
import axios from "axios";

// Sin VITE_API_BASE_URL definida, cae al backend local de desarrollo — pero
// en cualquier build de producción real, esta env var es obligatoria (ver
// .env.example): dejar el fallback local significaría desplegar la app
// apuntando a 127.0.0.1, o peor, a HTTP en vez de HTTPS.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api",
  withCredentials: true,
  withXSRFToken: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Rutas que pueden recibir 401 de forma legítima (no redirigir)
const AUTH_ROUTES = ["/mercadito/auth/ping", "/mercadito/login"];

// Evento que AuthContext escucha para limpiar su estado (user/localStorage).
// api.ts vive fuera de React y no tiene acceso a setUser: no puede navegar
// "a mano" sin arriesgar el bucle GuestRoute↔ProtectedRoute (uno navega con
// isAuthenticated todavía en true por el estado stale, el otro rebota de
// vuelta). En su lugar solo avisa que la sesión murió; ProtectedRoute ya
// redirige a "/" de forma declarativa en cuanto isAuthenticated pasa a false.
export const UNAUTHORIZED_EVENT = "mercadito:unauthorized";

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    const is401 = error.response?.status === 401;
    const isAuthRoute = AUTH_ROUTES.some((r) => url.includes(r));

    if (is401 && !isAuthRoute) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return Promise.reject(error);
  }
);

export default api;