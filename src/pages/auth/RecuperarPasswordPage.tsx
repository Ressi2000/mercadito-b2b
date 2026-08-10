// src/pages/auth/RecuperarPasswordPage.tsx
import { Link } from "react-router-dom";

export default function RecuperarPasswordPage() {
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
        <div className="relative px-8 pt-10 pb-9 text-center overflow-hidden">
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
          <p className="text-sm text-brand-neutral-400 mt-2 leading-relaxed max-w-xs mx-auto">
            Todavía no está disponible la recuperación automática por correo.
            Mientras la habilitamos, contactá a tu vendedor asignado para
            restablecer tu acceso.
          </p>
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
