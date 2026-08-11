import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";
import GoldRing from "./GoldRing";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "flat";
  /**
   * Nivel de énfasis del borde — ver IDENTIDAD_VISUAL.md, "Jerarquía de cards".
   * subtle (default): borde neutro, apenas visible.
   * gold: borde dorado — indicadores/KPIs destacados.
   * none: sin borde, solo sombra — cards secundarias o de menor jerarquía.
   */
  border?: "subtle" | "gold" | "none";
  style?: CSSProperties;
}

export default function Card({
  children,
  className,
  variant = "default",
  border = "subtle",
  style,
}: CardProps) {
  const base =
    "rounded-2xl p-6 transition-all duration-300";

  // Blur + sombra: los define el variant.
  const variants = {
    default: "backdrop-blur-xl shadow-xl",
    elevated: "backdrop-blur-xl shadow-2xl hover:-translate-y-1 hover:shadow-2xl",
    flat: "shadow-sm",
  };

  // Nivel "gold": cuerpo de vidrio + anillo dorado como capas separadas.
  // Cualquier técnica que pinte el degradé "detrás" del cuerpo translúcido
  // (wrapper con padding, o background-clip: border-box en el mismo div)
  // termina rellenando TODO el interior de oro sólido, no solo el borde —
  // el backdrop-blur ve ese oro en vez de la página real. La solución es
  // que el anillo sea una forma hueca de verdad (mask-composite: exclude),
  // pintada ARRIBA del cuerpo de vidrio en vez de detrás.
  if (border === "gold") {
    return (
      <div className="relative rounded-2xl">
        <div
          className={clsx(base, "backdrop-blur-xl bg-white/40", className)}
          style={{
            boxShadow: "0 20px 40px -16px rgba(163,122,20,0.3), inset 0 1px 0 rgba(255,255,255,0.65)",
            ...style,
          }}
        >
          {children}
        </div>
        <GoldRing />
      </div>
    );
  }

  // Fondo + borde van juntos para los demás niveles.
  const surface = {
    subtle: variant === "flat" ? "bg-white border border-brand-neutral-200" : "bg-white/70 border border-white/20",
    none: variant === "flat" ? "bg-white border-0" : "bg-white/70 border-0",
  };

  return (
    <div className={clsx(base, variants[variant], surface[border], className)} style={style}>
      {children}
    </div>
  );
}
