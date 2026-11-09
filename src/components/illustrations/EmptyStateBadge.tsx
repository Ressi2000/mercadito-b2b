interface EmptyStateBadgeProps {
  children: React.ReactNode;
  size?: number;
}

/**
 * Insignia circular con halo dorado para íconos de estado vacío secundarios
 * (sin resultados, sin empresas asignadas) — mismo motivo de halo que las
 * ilustraciones de error/404, sin necesitar una pieza de arte completa para
 * cada estado menor.
 */
export default function EmptyStateBadge({ children, size = 88 }: EmptyStateBadgeProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-brand-primary-100 opacity-70" />
      <div className="absolute inset-[10%] rounded-full bg-brand-primary-200 opacity-70" />
      <div className="relative w-1/2 h-1/2 flex items-center justify-center text-brand-primary-700">
        {children}
      </div>
    </div>
  );
}
