// src/app/components/layout/AuthLayout.tsx
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-neutral-900 via-brand-neutral-800 to-brand-neutral-900 relative overflow-hidden">

      {/* ── Orbes flotantes ── */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl animate-orb-1"
        style={{ background: "radial-gradient(circle, #d4a72c, transparent 70%)", top: "-10%", left: "-10%" }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-3xl animate-orb-2"
        style={{ background: "radial-gradient(circle, #eabf56, transparent 70%)", bottom: "-5%", right: "-5%" }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-3xl animate-orb-3"
        style={{ background: "radial-gradient(circle, #deab3c, transparent 70%)", top: "50%", right: "20%" }}
      />

      {/* ── Grid pattern sutil ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
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
            background: "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}