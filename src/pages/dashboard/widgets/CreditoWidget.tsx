import Card from "../../../components/ui/Card";
import TricolorEdge from "./TricolorEdge";
import type { CreditoResumen } from "../../../models/Dashboard";

interface CreditoWidgetProps {
  creditos: CreditoResumen[];
  loading: boolean;
}

export default function CreditoWidget({ creditos, loading }: CreditoWidgetProps) {
  return (
    <Card variant="default" className="relative overflow-hidden space-y-5">
      <TricolorEdge />
      <div className="flex items-center justify-between">
        <h2 className="text-base font-display font-bold text-brand-neutral-900">Estado de cuenta</h2>
        <span className="text-xs font-medium text-brand-neutral-400">Crédito disponible por empresa</span>
      </div>

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
    </Card>
  );
}
