// src/pages/auth/ResetPasswordPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { restablecerPassword } from "../../services/authService";

interface ResetForm {
  password: string;
  password_confirmation: string;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetForm>();

  const enlaceInvalido = !token || !email;

  const onSubmit = async (data: ResetForm) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await restablecerPassword({ token, email, ...data });
      if (!resp.success) throw new Error(resp.message);
      setExito(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "No pudimos restablecer la contraseña."
      );
    } finally {
      setLoading(false);
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
        <div className="relative px-8 pt-10 pb-8 text-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-primary-500 to-transparent opacity-70" />

          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
            style={{
              background: "rgba(242, 169, 0, 0.18)",
              border: "1px solid rgba(242, 169, 0, 0.4)",
            }}
          >
            <svg className="w-7 h-7 text-brand-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h1 className="text-xl font-display font-extrabold text-white tracking-tight">
            Nueva contraseña
          </h1>

          {!enlaceInvalido && !exito && (
            <p className="text-sm text-brand-neutral-400 mt-2 leading-relaxed max-w-xs mx-auto">
              Elegí una contraseña nueva para <span className="text-brand-neutral-200 font-medium">{email}</span>.
            </p>
          )}
        </div>

        <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="px-8 pt-7 pb-9">
          {enlaceInvalido ? (
            <div
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{
                background: "rgba(239, 68, 68, 0.10)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
              }}
            >
              <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-300 font-medium">
                Este enlace no es válido. Pedí uno nuevo desde "¿Olvidaste tu
                contraseña?" en el login.
              </p>
            </div>
          ) : exito ? (
            <div
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{
                background: "rgba(34, 197, 94, 0.10)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
              }}
            >
              <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-300 font-medium">
                Contraseña actualizada. Ya podés iniciar sesión con la nueva
                contraseña — te llevamos al login en un momento.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                type="password"
                placeholder="••••••••"
                label="Nueva contraseña"
                error={errors.password?.message}
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "Mínimo 8 caracteres",
                  },
                })}
              />

              <Input
                type="password"
                placeholder="••••••••"
                label="Confirmar contraseña"
                error={errors.password_confirmation?.message}
                {...register("password_confirmation", {
                  required: "Confirmá la contraseña",
                  validate: (value) =>
                    value === watch("password") || "Las contraseñas no coinciden",
                })}
              />

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
                Restablecer contraseña
              </Button>
            </form>
          )}
        </div>

        <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="px-8 pt-7 pb-9 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary-400 hover:text-brand-primary-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <p className="text-center text-xs text-brand-neutral-600">
        © {new Date().getFullYear()} Sindoni. Todos los derechos reservados.
      </p>

    </div>
  );
}
