interface ItemProximamente {
  label: string;
  fase: string;
}

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

/**
 * Reemplaza lo que antes eran 2 cards completas ("Facturas pendientes",
 * "Reclamos en proceso") — literalmente vacías, features sin construir
 * todavía — por una sola franja mínima. Ocupaban tanto espacio como los
 * módulos que sí tienen contenido real.
 */
export default function ProximamenteStrip({ items }: { items: ItemProximamente[] }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-brand-neutral-300 bg-brand-neutral-100 px-4 py-3 text-xs text-brand-neutral-500">
      <span className="text-brand-neutral-400"><LockIcon /></span>
      <span>
        {items.map((item, i) => (
          <span key={item.label}>
            {i > 0 && " · "}
            <b className="text-brand-neutral-600 font-semibold" title={item.fase}>{item.label}</b>
          </span>
        ))}
        {" — próximamente en el portal"}
      </span>
    </div>
  );
}
