// src/pages/auth/RecuperarPasswordPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { solicitarRecuperacion } from "../../services/authService";

interface RecuperarForm {
  email: string;
}

export default function RecuperarPasswordPage() {
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecuperarForm>();

  const onSubmit = async (data: RecuperarForm) => {
    setLoading(true);
    setError(null);
    try {
      await solicitarRecuperacion(data.email);
      // El backend siempre responde éxito, exista o no la cuenta —
      // evita que este formulario sirva para averiguar qué correos
      // están registrados.
      setEnviado(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "No pudimos procesar la solicitud. Intentá de nuevo en unos minutos."
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>

          <h1 className="text-xl font-display font-extrabold text-white tracking-tight">
            Recuperar contraseña
          </h1>

          {!enviado && (
            <p className="text-sm text-brand-neutral-400 mt-2 leading-relaxed max-w-xs mx-auto">
              Ingresá el correo con el que iniciás sesión y te mandamos un
              enlace para restablecer tu contraseña.
            </p>
          )}
        </div>

        <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="px-8 pt-7 pb-9">
          {enviado ? (
            <div className="text-center space-y-4">
              <div
                className="flex items-start gap-3 p-4 rounded-xl text-left"
                style={{
                  background: "rgba(34, 197, 94, 0.10)",
                  border: "1px solid rgba(34, 197, 94, 0.25)",
                }}
              >
                <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-300 font-medium">
                  Si ese correo está registrado, vas a recibir un enlace para
                  restablecer tu contraseña en los próximos minutos.
                </p>
              </div>
              <p className="text-xs text-brand-neutral-500">
                ¿No te llegó? Revisá la carpeta de spam antes de pedir otro enlace.
              </p>
            </div>
          ) : (
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
                Enviar enlace
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
