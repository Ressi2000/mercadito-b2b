import ModuleCard from "../../../components/ui/ModuleCard";
import type { CreditoResumen } from "../../../models/Dashboard";

interface CreditoWidgetProps {
  creditos: CreditoResumen[];
  loading: boolean;
}

const CreditoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75v10.5A2.25 2.25 0 005.25 19.5z" />
  </svg>
);

export default function CreditoWidget({ creditos, loading }: CreditoWidgetProps) {
  return (
    <ModuleCard
      title="Estado de cuenta"
      icon={<CreditoIcon />}
      iconAccent="navy"
      titleRight={<span className="text-xs font-medium text-brand-neutral-400 hidden xl:inline shrink-0">Por empresa</span>}
    >
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((n) => (
            <div key={n} className="space-y-2">
              <div className="h-3 bg-brand-neutral-200 rounded w-1/3" />
              <div className="h-2.5 bg-brand-neutral-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : creditos.length === 0 ? (
        <p className="text-sm text-brand-neutral-400 py-4">Sin información de crédito disponible.</p>
      ) : (
        <div className="space-y-5">
          {creditos.map((c) => {
            const porcentaje = c.limite_credito > 0
              ? Math.min(100, Math.max(0, (c.credito_usado / c.limite_credito) * 100))
              : 0;
            const critico = porcentaje >= 90;

            return (
              <div key={c.mercancia_id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-brand-neutral-800 truncate">{c.nombre_mercancia}</span>
                  <span className="text-xs text-brand-neutral-500 tabular-nums shrink-0 ml-2">
                    {c.moneda} {c.disponible.toLocaleString("es-VE", { maximumFractionDigits: 2 })} disponible
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-brand-neutral-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${critico ? "bg-red-500" : "bg-brand-primary-500"}`}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
                <p className="text-[11px] text-brand-neutral-400 tabular-nums">
                  Usado {c.moneda} {c.credito_usado.toLocaleString("es-VE", { maximumFractionDigits: 2 })} de {c.limite_credito.toLocaleString("es-VE", { maximumFractionDigits: 2 })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </ModuleCard>
  );
}
