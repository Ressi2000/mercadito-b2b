import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Texto simple arriba del título — se ignora si se pasa `breadcrumb`. */
  eyebrow?: string;
  /** <Breadcrumb items={...} /> — reemplaza el eyebrow cuando la pantalla es parte de un flujo de varios pasos. */
  breadcrumb?: ReactNode;
  title: string;
  /** Elemento inline junto al título — ej. badge "Actualizando". */
  titleExtra?: ReactNode;
  subtitle?: ReactNode;
  /** Slot a la derecha — botón de acción, buscador, etc. */
  action?: ReactNode;
}

/**
 * Encabezado estándar de página: (breadcrumb u eyebrow) + título + subtítulo,
 * con acción opcional a la derecha. Formaliza el patrón que Empresas,
 * Catálogo, Carrito y Confirmación repetían cada uno a su manera.
 */
export default function PageHeader({ eyebrow, breadcrumb, title, titleExtra, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <div className="min-w-0">
        {breadcrumb ?? (eyebrow && <p className="text-xs font-semibold text-brand-primary-600 uppercase tracking-widest">{eyebrow}</p>)}
        <div className="flex items-center gap-3 mt-1">
          <h1 className="text-3xl font-display font-extrabold text-brand-neutral-900">{title}</h1>
          {titleExtra}
        </div>
        {subtitle && <p className="text-brand-neutral-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="w-full md:w-auto shrink-0">{action}</div>}
    </div>
  );
}
