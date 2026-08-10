import type { ReactNode } from "react";
import clsx from "clsx";
import Card from "./Card";
import TricolorEdge from "./TricolorEdge";

interface ModuleCardProps {
  /** Título del módulo, en font-display. Omitilo si el contenido trae su propio encabezado. */
  title?: string;
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

/**
 * Card que envuelve el cuerpo completo de un módulo: encabezado estándar
 * (título + acción opcional) y contenido. Formaliza el patrón que antes se
 * repetía a mano en cada widget del dashboard.
 */
export default function ModuleCard({
  title,
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
          <h2 className="text-base font-display font-bold text-brand-neutral-900">{title}</h2>
          {titleRight}
        </div>
      )}

      {children}
    </Card>
  );
}
