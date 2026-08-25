import type { ReactNode } from "react";
import clsx from "clsx";

interface StatChipProps {
  icon: ReactNode;
  iconAccent?: "green" | "gold";
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  onClick?: () => void;
}

const iconStyles = {
  green: "bg-emerald-100 text-emerald-700",
  gold: "bg-brand-primary-100 text-brand-primary-700",
};

/**
 * Chip chico de referencia (ícono + etiqueta + valor) — para datos que no
 * son métricas de la cuenta (tasa de cambio, próxima visita del vendedor):
 * se muestran, pero no compiten en tamaño con los KPI reales.
 */
export default function StatChip({ icon, iconAccent = "gold", label, value, hint, onClick }: StatChipProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2.5 bg-white border border-brand-neutral-200 rounded-xl px-4 py-2.5 text-left",
        onClick && "hover:border-brand-neutral-300 transition-colors duration-150"
      )}
    >
      <div className={clsx("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", iconStyles[iconAccent])}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-brand-neutral-500 uppercase tracking-wide">{label}</p>
        <p className="text-[13px] font-bold text-brand-neutral-900 mt-0.5">
          {value}
          {hint && <span className="text-xs font-normal text-brand-neutral-400 ml-1">{hint}</span>}
        </p>
      </div>
    </Tag>
  );
}
