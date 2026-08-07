// src/components/ui/PromoBanner.tsx
interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  tag?: string;
}

export default function PromoBanner({
  title = "Nuevas colecciones disponibles",
  subtitle = "Descubre los productos destacados de la temporada para tu empresa.",
  ctaText = "Explorar ahora",
  ctaHref = "#",
  imageUrl,
  tag = "Destacado",
}: PromoBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl min-h-[140px]">

      {/* ── Fondo: imagen si existe, si no gradiente ── */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Banner promocional"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-slate-900 via-brand-slate-800 to-brand-teal-900" />
      )}

      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-slate-900/90 via-brand-slate-900/60 to-transparent" />

      {/* Grid pattern sutil */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Orbe decorativo teal */}
      <div
        className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #0d9488, transparent 70%)" }}
      />

      {/* Orbe decorativo amber */}
      <div
        className="absolute right-1/3 bottom-0 w-32 h-32 rounded-full opacity-15 blur-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }}
      />

      {/* ── Contenido ── */}
      <div className="relative px-8 py-7 flex items-center justify-between gap-6">

        <div className="space-y-2 max-w-xl">
          {/* Tag */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-400 animate-pulse" />
            {tag}
          </span>

          {/* Título */}
          <h2 className="text-xl font-bold text-white leading-snug">
            {title}
          </h2>

          {/* Subtítulo */}
          <p className="text-sm text-brand-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* CTA */}
        <a
          href={ctaHref}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-teal-500/20 hover:bg-brand-teal-500/30 border border-brand-teal-500/40 hover:border-brand-teal-400/60 text-brand-teal-300 hover:text-white text-sm font-semibold transition-all duration-200 backdrop-blur-sm"
        >
          {ctaText}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>

      </div>

      {/* Línea de acento inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-teal-500 to-transparent opacity-50" />

    </div>
  );
}