import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "flat";
}

export default function Card({
  children,
  className,
  variant = "default",
}: CardProps) {
  const base =
    "rounded-2xl p-6 transition-all duration-300";

  const variants = {
    default:
      "bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl",
    elevated:
      "bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl hover:-translate-y-1 hover:shadow-2xl",
    flat:
      "bg-white border border-brand-slate-200 shadow-sm",
  };

  return (
    <div className={clsx(base, variants[variant], className)}>
      {children}
    </div>
  );
}
