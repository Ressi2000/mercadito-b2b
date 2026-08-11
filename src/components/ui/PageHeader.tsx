import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Texto simple arriba del título — se ignora si se pasa `breadcrumb`. */
  eyebrow?: string;
  /** <Breadcrumb items={...} /> — reemplaza el eyebrow cuando la pantalla es parte de un flujo de varios pasos. */
  breadcrumb?: ReactNode;
  /** Ícono del módulo — chip cuadrado en degradé dorado a la izquierda del título. */
  icon?: ReactNode;
  title: string;
  /** Elemento inline junto al título — ej. badge "Actualizando". */
  titleExtra?: ReactNode;
  subtitle?: ReactNode;
  /** Slot a la derecha — botón de acción, buscador, etc. */
  action?: ReactNode;
  /** Franja decorativa dorada/navy de fondo, detrás del ícono y título. Solo para el flujo de Nuevo Pedido. */
  decor?: boolean;
}

/**
 * Encabezado estándar de página: ícono del módulo + (breadcrumb u eyebrow) +
 * título + subtítulo, con acción opcional a la derecha. Formaliza el patrón
 * que Empresas, Catálogo, Carrito y Confirmación repetían cada uno a su manera.
 */
export default function PageHeader({ eyebrow, breadcrumb, icon, title, titleExtra, subtitle, action, decor = false }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <div className="relative isolate min-w-0">
        {decor && (
          <img
            src="/header/header2.png"
            alt=""
            aria-hidden="true"
            className="absolute -top-2 -left-4 -z-10 h-14 md:h-16 w-auto max-w-none opacity-25 pointer-events-none select-none"
            style={{
              WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 95%)",
              maskImage: "linear-gradient(to right, black 55%, transparent 95%)",
            }}
          />
        )}
        <div className="relative flex items-start gap-4">
          {icon && (
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-brand-primary-300 via-brand-primary-500 to-brand-primary-700 text-brand-neutral-900 shadow-md shadow-brand-primary-600/30">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            {breadcrumb ?? (eyebrow && <p className="text-xs font-semibold text-brand-primary-600 uppercase tracking-widest">{eyebrow}</p>)}
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-3xl font-display font-extrabold text-brand-neutral-900">{title}</h1>
              {titleExtra}
            </div>
            {subtitle && <p className="text-brand-neutral-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
      {action && <div className="w-full md:w-auto shrink-0">{action}</div>}
    </div>
  );
}
