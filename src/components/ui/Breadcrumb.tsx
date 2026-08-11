import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  /** Omitilo en el último ítem — es la pantalla actual, no un link. */
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const ChevronSeparator = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3 text-brand-neutral-300 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

/** Breadcrumb de flujo — ej. Inicio / Catálogo / Carrito / Confirmación. */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronSeparator />}
            {isLast || !item.to ? (
              <span className={isLast ? "text-brand-primary-600" : "text-brand-neutral-400"}>{item.label}</span>
            ) : (
              <Link to={item.to} className="text-brand-neutral-400 hover:text-brand-primary-600 transition-colors duration-150">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
