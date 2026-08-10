// src/components/layout/AuthLayout.tsx
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-brand-neutral-900">

      {/* ── Mural italiano de fondo ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/login/bg_login.png')" }}
      />

      {/* ── Viñeta: oscurece bordes y centra la atención en la card ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,26,53,0.35) 0%, rgba(10,26,53,0.65) 55%, rgba(10,26,53,0.88) 100%)",
        }}
      />

      {/* ── Partículas estáticas decorativas ── */}
      {[
        { size: 3, top: "15%", left: "25%", delay: "0s", duration: "4s" },
        { size: 2, top: "70%", left: "15%", delay: "1s", duration: "5s" },
        { size: 4, top: "30%", left: "75%", delay: "2s", duration: "3.5s" },
        { size: 2, top: "80%", left: "65%", delay: "0.5s", duration: "4.5s" },
        { size: 3, top: "45%", left: "10%", delay: "1.5s", duration: "6s" },
        { size: 2, top: "20%", left: "85%", delay: "3s", duration: "5s" },
      ].map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-brand-primary-400 animate-pulse"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: 0.4,
          }}
        />
      ))}

      {/* ── Card de contenido ── */}
      <div className="relative w-full max-w-md mx-4 animate-slide-up">
        <div
          className="w-full p-8 rounded-2xl shadow-2xl"
          style={{
            background: "rgba(10, 26, 53, 0.55)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}