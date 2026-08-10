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

  const variants = {
    default: "bg-white/70 backdrop-blur-xl shadow-xl",
    elevated: "bg-white/80 backdrop-blur-xl shadow-2xl hover:-translate-y-1 hover:shadow-2xl",
    flat: "bg-white shadow-sm",
  };

  const borders = {
    subtle: variant === "flat" ? "border border-brand-neutral-200" : "border border-white/20",
    gold: "border border-brand-primary-400/70",
    none: "border-0",
  };

  return (
    <div className={clsx(base, variants[variant], borders[border], className)} style={style}>
      {children}
    </div>
  );
}
