import type { ReactNode } from "react";
import clsx from "clsx";
import Card from "./Card";
import TricolorEdge from "./TricolorEdge";

interface ModuleCardProps {
  /** Título del módulo, en font-display. Omitilo si el contenido trae su propio encabezado. */
  title?: string;
  /**
   * Ícono del módulo — chip cuadrado a la izquierda del título, mismo patrón
   * que PageHeader. "gold" para módulos de acción/oportunidad (pedidos,
   * descuentos), "navy" para módulos de referencia (estado de cuenta).
   */
  icon?: ReactNode;
  iconAccent?: "gold" | "navy" | "red";
  /** "sm" para módulos secundarios/de contexto (visitas, ubicación, favoritos) — mismo criterio que separa a esos widgets de los primarios. */
  iconSize?: "sm" | "md";
  /** Elemento a la derecha del título (ej. un botón "ghost" "Ver todos", o un hint). */
  titleRight?: ReactNode;
  /**
   * Franja tricolor superior — reservada para los módulos de mayor jerarquía
   * de una pantalla (ver IDENTIDAD_VISUAL.md). No usar en cards secundarias.
   */
  tricolor?: boolean;
  children: ReactNode;
  className?: string;
}

const iconChipStyles = {
  gold: "bg-gradient-to-br from-brand-primary-300 via-brand-primary-500 to-brand-primary-700 text-brand-neutral-900",
  navy: "bg-gradient-to-br from-brand-neutral-700 to-brand-neutral-900 text-brand-primary-300",
  red: "bg-brand-accent-100 text-brand-accent-600",
};

/**
 * Card que envuelve el cuerpo completo de un módulo: encabezado estándar
 * (título + acción opcional) y contenido. Formaliza el patrón que antes se
 * repetía a mano en cada widget del dashboard.
 */
export default function ModuleCard({
  title,
  icon,
  iconAccent = "gold",
  iconSize = "md",
  titleRight,
  tricolor = false,
  children,
  className,
}: ModuleCardProps) {
  return (
    <Card variant="default" className={clsx("relative overflow-hidden flex flex-col gap-5", className)}>
      {tricolor && <TricolorEdge />}

      {title && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className={clsx(
                "rounded-xl flex items-center justify-center shrink-0",
                iconSize === "sm" ? "w-7 h-7 rounded-lg [&_svg]:w-3.5 [&_svg]:h-3.5" : "w-10 h-10",
                iconChipStyles[iconAccent]
              )}>
                {icon}
              </div>
            )}
            <h2 className="text-base font-display font-bold text-brand-neutral-900 truncate">{title}</h2>
          </div>
          {titleRight}
        </div>
      )}

      {children}
    </Card>
  );
}
