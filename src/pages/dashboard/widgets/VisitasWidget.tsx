import Card from "../../../components/ui/Card";
import TricolorEdge from "./TricolorEdge";
import type { VisitaComercial, ProximaVisita } from "../../../models/Dashboard";

interface VisitasWidgetProps {
  ultimas: VisitaComercial[];
  proxima: ProximaVisita | null;
  loading: boolean;
}

function formatFecha(fecha: string) {
  try {
    return new Date(fecha).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return fecha;
  }
}

export default function VisitasWidget({ ultimas, proxima, loading }: VisitasWidgetProps) {
  return (
    <Card variant="default" className="relative overflow-hidden space-y-5">
      <TricolorEdge />
      <h2 className="text-base font-display font-bold text-brand-neutral-900">Visitas comerciales</h2>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-10 bg-brand-neutral-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Próxima visita */}
          <div className="rounded-xl bg-brand-primary-50 border border-brand-primary-100 px-4 py-3">
            <p className="text-[11px] font-semibold text-brand-primary-600 uppercase tracking-wide">Próxima visita</p>
            {proxima ? (
              <p className="text-sm text-brand-neutral-800 mt-1">
                <span className="font-medium">{formatFecha(proxima.fecha)}</span>
                {" · "}{proxima.vendedor}
              </p>
            ) : (
              <p className="text-sm text-brand-neutral-500 mt-1">No hay visitas agendadas.</p>
            )}
          </div>

          {/* Últimas visitas */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-brand-neutral-500 uppercase tracking-wide">Últimas visitas</p>
            {ultimas.length === 0 ? (
              <p className="text-sm text-brand-neutral-400">Aún no registras visitas comerciales.</p>
            ) : (
              <ul className="space-y-3">
                {ultimas.map((v, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-brand-primary-400 mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-brand-neutral-800">
                        <span className="font-medium">{formatFecha(v.fecha)}</span>
                        {v.tipo_visita && <span className="text-brand-neutral-400"> · {v.tipo_visita}</span>}
                      </p>
                      <p className="text-xs text-brand-neutral-500">{v.vendedor}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
