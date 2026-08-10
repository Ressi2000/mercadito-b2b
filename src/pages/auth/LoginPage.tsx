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
      navigate("/dashboard");
    } catch {
      // El error ya está manejado en el contexto
    }
  };

  return (
    <div className="w-full space-y-6 animate-slide-up">

      {/* ── Card principal ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >

        {/* ── Header del card ── */}
        <div className="relative px-8 pt-10 pb-8 text-center overflow-hidden">

          {/* Línea de acento superior */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary-500 to-transparent opacity-70" />

          <img
            src="/logo/gesrutas-iclient-trimmed.png"
            alt="GesRutas iClient"
            className="h-16 w-auto mx-auto mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]"
          />

          <p className="text-sm text-brand-neutral-400">
            Portal de pedidos empresariales
          </p>
        </div>

        {/* Separador */}
        <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Formulario ── */}
        <div className="px-8 pt-7 pb-10">
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
                  message: "Mínimo 6 caracteres",
                },
              })}
            />

            {/* Error global */}
            {error && (
              <div
                className="flex items-start gap-3 p-4 rounded-xl animate-slide-up"
                style={{
                  background: "rgba(239, 68, 68, 0.10)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                }}
              >
                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-300 font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full !mt-7"
            >
              Iniciar Sesión
            </Button>

          </form>
        </div>
      </div>

      {/* ── Footer ── */}
      <p className="text-center text-xs text-brand-neutral-600">
        © {new Date().getFullYear()} Sindoni. Todos los derechos reservados.
      </p>

    </div>
  );
}