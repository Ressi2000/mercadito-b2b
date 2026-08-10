import type { CSSProperties, ReactNode } from "react";
import clsx from "clsx";

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

  // Fondo + borde van juntos, a cargo del nivel de énfasis: "gold" es una
  // superficie de pergamino opaca, distinta del vidrio translúcido del resto.
  const surface = {
    subtle: variant === "flat" ? "bg-white border border-brand-neutral-200" : "bg-white/70 border border-white/20",
    gold: "bg-[#faf3e0] border-2 border-brand-primary-400/80",
    none: variant === "flat" ? "bg-white border-0" : "bg-white/70 border-0",
  };

  return (
    <div className={clsx(base, variants[variant], surface[border], className)} style={style}>
      {children}
    </div>
  );
}
