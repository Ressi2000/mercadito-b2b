import type { ReactNode } from "react";
import Card from "./Card";

type IconAccent = "gold" | "paleGold" | "green" | "blue";

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  onClick?: () => void;
  featured?: boolean;
  /** Color del chip del ícono — mismo degradé aprobado para las cards. */
  iconAccent?: IconAccent;
}

const iconChipStyles: Record<IconAccent, string> = {
  gold: "bg-gradient-to-br from-brand-primary-300 via-brand-primary-500 to-brand-primary-700 text-brand-neutral-900 shadow-md shadow-brand-primary-600/30",
  paleGold: "bg-gradient-to-br from-brand-primary-100 via-brand-primary-200 to-brand-primary-300 text-brand-neutral-800 shadow-md shadow-brand-primary-300/40",
  green: "bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-800 text-white shadow-md shadow-emerald-700/30",
  blue: "bg-gradient-to-br from-brand-neutral-700 via-brand-neutral-800 to-brand-neutral-900 text-brand-primary-300 shadow-md shadow-brand-neutral-900/30",
};

/**
 * Card para un único indicador (KPI): ícono + etiqueta + valor + hint opcional.
 * Todas llevan el borde dorado en degradé (nivel "gold" de Card); `featured`
 * además resalta el ícono del KPI más importante de la fila.
 */
export default function KpiCard({ label, value, hint, icon, onClick, featured = false, iconAccent = "blue" }: KpiCardProps) {
  return (
    <Card
      variant="default"
      border="gold"
      className={`relative overflow-hidden flex items-start gap-4 ${onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300" : ""}`}
    >
      <div onClick={onClick} className="flex items-start gap-4 w-full">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconChipStyles[featured ? "gold" : iconAccent]}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide truncate">{label}</p>
          <p className="text-2xl font-display font-extrabold text-brand-neutral-900 tabular-nums mt-0.5 truncate">{value}</p>
          {hint && <p className="text-xs text-brand-neutral-400 mt-0.5 truncate">{hint}</p>}
        </div>
      </div>
    </Card>
  );
}
