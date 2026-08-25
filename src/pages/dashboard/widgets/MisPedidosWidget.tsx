import ModuleCard from "../../../components/ui/ModuleCard";
import Button from "../../../components/ui/Button";
import type { UltimoPedido } from "../../../models/Dashboard";

interface MisPedidosWidgetProps {
  pedidosAbiertos: number;
  empresasActivas: number;
  ultimoPedido: UltimoPedido | null;
  loading: boolean;
  onVerTodos: () => void;
  onClickPedidosAbiertos: () => void;
  onClickEmpresasActivas: () => void;
}

const statusStyles: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
};

const PedidosIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
  </svg>
);

/**
 * Fusiona lo que antes eran 3 piezas separadas ("Pedidos abiertos" y
 * "Empresas activas" como KPI cards completas, "Último pedido" como
 * ModuleCard aparte) en un solo bloque: es lo primero que un cliente B2B
 * quiere saber al entrar — cuántos pedidos tiene en curso y cómo va el
 * último — así que ahora tiene la mayor jerarquía visual de la pantalla
 * en vez de competir en pie de igualdad con el resto.
 */
export default function MisPedidosWidget({
  pedidosAbiertos,
  empresasActivas,
  ultimoPedido,
  loading,
  onVerTodos,
  onClickPedidosAbiertos,
  onClickEmpresasActivas,
}: MisPedidosWidgetProps) {
  return (
    <ModuleCard
      title="Mis Pedidos"
      icon={<PedidosIcon />}
      iconAccent="gold"
      tricolor
      titleRight={
        <Button variant="ghost" className="!px-3 !py-1.5 text-sm shrink-0" onClick={onVerTodos}>
          Ver todos →
        </Button>
      }
    >
      <div className="flex items-center gap-6">
        <button onClick={onClickPedidosAbiertos} className="text-left">
          <p className="text-3xl font-display font-extrabold text-brand-primary-600 tabular-nums leading-none">
            {loading ? "—" : pedidosAbiertos}
          </p>
          <p className="text-xs text-brand-neutral-500 mt-1.5">Pedidos abiertos</p>
        </button>
        <div className="w-px self-stretch bg-brand-neutral-200" />
        <button onClick={onClickEmpresasActivas} className="text-left">
          <p className="text-3xl font-display font-extrabold text-brand-neutral-900 tabular-nums leading-none">
            {loading ? "—" : empresasActivas}
          </p>
          <p className="text-xs text-brand-neutral-500 mt-1.5">Empresas activas</p>
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold text-brand-neutral-400 uppercase tracking-wide mb-2">Último pedido</p>
        {loading ? (
          <div className="h-16 bg-brand-neutral-100 rounded-xl animate-pulse" />
        ) : ultimoPedido ? (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-brand-neutral-200 px-4 py-3.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-neutral-900 truncate">{ultimoPedido.codigo_pedido_web}</p>
              <p className="text-xs text-brand-neutral-500 mt-0.5">{ultimoPedido.empresa} · {ultimoPedido.fecha}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-brand-neutral-900 tabular-nums">
                {ultimoPedido.moneda} {ultimoPedido.total.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
              </p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${statusStyles[ultimoPedido.status] ?? "bg-brand-neutral-100 text-brand-neutral-600"}`}>
                {ultimoPedido.status}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-brand-neutral-400 py-2">Aún no has realizado pedidos.</p>
        )}
      </div>
    </ModuleCard>
  );
}
