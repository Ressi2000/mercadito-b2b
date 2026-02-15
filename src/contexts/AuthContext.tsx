// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔎 Verifica sesión al iniciar la app
  const verifyAuth = async () => {
    try {
      const response = await checkAuth();

      if (response?.status === true) {
        // Aquí más adelante puedes traer el usuario si lo deseas
        // Por ahora solo confirmamos sesión activa
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  // 🔐 Login
  const login = async (data: LoginPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await loginRequest(data);

      if (!response.success || !response.data) {
        throw new Error(response.message);
      }

      setUser(response.data);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al iniciar sesión";

      setError(message);
      setUser(null);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await logoutRequest();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Error al cerrar sesión";

      setError(message);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
