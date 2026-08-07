// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  loginRequest,
  logoutRequest,
  checkAuth,
  type LoginPayload,
} from "../services/authService";

interface User {
  id: number;
  cliente_id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]     = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  // useRef evita que React StrictMode ejecute verifyAuth dos veces
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyAuth = async () => {
      // Restauración optimista desde localStorage
      const cached = localStorage.getItem("mercadito_user");
      if (cached) {
        try { setUser(JSON.parse(cached)); } catch {
          localStorage.removeItem("mercadito_user");
        }
      }

      try {
        await checkAuth(); // confirma sesión activa en backend
      } catch {
        setUser(null);
        localStorage.removeItem("mercadito_user");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // ── Login ──────────────────────────────────────────────────────────
  const login = async (data: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginRequest(data);
      if (!response.success || !response.data) throw new Error(response.message);

      setUser(response.data);
      localStorage.setItem("mercadito_user", JSON.stringify(response.data));
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Error al iniciar sesión";
      setError(message);
      setUser(null);
      localStorage.removeItem("mercadito_user");
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutRequest();
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cerrar sesión");
    } finally {
      setUser(null);
      hasVerified.current = false; // permite re-verificación en próximo login
      localStorage.removeItem("mercadito_user");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};