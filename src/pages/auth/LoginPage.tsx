// src/pages/auth/LoginPage.tsx
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      navigate("/empresas");
    } catch {
      // El error ya está manejado en el contexto
    }
  };

  return (
    <div className="w-full max-w-md animate-slide-up">
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-brand-slate-900/10 border border-white/20 overflow-hidden">
        
        {/* Header */}
        <div className="relative bg-gradient-to-br from-brand-teal-500 to-brand-teal-600 px-8 pt-12 pb-8">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2 tracking-tight">
              B2B Minerals
            </h1>
            <p className="text-brand-teal-100 text-sm font-medium">
              Portal de pedidos empresariales
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pt-8 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <Input
              type="email"
              placeholder="correo@empresa.com"
              label="Correo electrónico"
              error={errors.email?.message}
              {...register("email", {
                required: "El correo es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido",
                },
              })}
            />

            <Input
              type="password"
              placeholder="••••••••"
              label="Contraseña"
              error={errors.password?.message}
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
            />

            {/* Error global */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 animate-slide-up">
                <p className="text-sm text-red-800 font-medium">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full mt-6"
            >
              Iniciar Sesión
            </Button>

          </form>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-brand-slate-500">
          © {new Date().getFullYear()} Gesindoni. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
