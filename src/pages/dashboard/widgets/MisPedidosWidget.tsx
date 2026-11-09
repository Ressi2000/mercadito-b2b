import ModuleCard from "../../../components/ui/ModuleCard";
import Button from "../../../components/ui/Button";
import type { UltimoPedido, PedidosPorEstado, ProductosPorEmpresa } from "../../../models/Dashboard";

interface MisPedidosWidgetProps {
  pedidosPorEstado: PedidosPorEstado;
  empresasActivas: number;
  productosPorEmpresa: ProductosPorEmpresa[];
  ultimoPedido: UltimoPedido | null;
  loading: boolean;
  pedidoRapidoCargando: boolean;
  onVerTodos: () => void;
  onClickEmpresasActivas: () => void;
  onClickEmpresaCatalogo: (empresaId: number) => void;
  onNuevoPedido: () => void;
  onPedidoRapido: () => void;
}

const statusStyles: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobado_vendedor: "bg-sky-100 text-sky-700",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
  modificado: "bg-brand-neutral-100 text-brand-neutral-600",
};

const ESTADOS: { key: keyof PedidosPorEstado; label: string; dot: string; textClass: string }[] = [
  { key: "pendiente", label: "Abiertos", dot: "bg-amber-400", textClass: "text-amber-600" },
  { key: "aprobado_vendedor", label: "Aprob. vendedor", dot: "bg-sky-400", textClass: "text-sky-600" },
  { key: "aprobado", label: "Aprobados", dot: "bg-emerald-400", textClass: "text-emerald-600" },
  { key: "rechazado", label: "Rechazados", dot: "bg-red-400", textClass: "text-red-600" },
];

const PedidosIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

/**
 * Fusiona lo que antes eran 3 piezas separadas ("Pedidos abiertos" y
 * "Empresas activas" como KPI cards completas, "Último pedido" como
 * ModuleCard aparte) en un solo bloque: es lo primero que un cliente B2B
 * quiere saber al entrar — cuántos pedidos tiene en curso (por estado),
 * en cuántas empresas compra, qué tan surtido está el catálogo de cada
 * una, y accesos directos para seguir pidiendo.
 */
export default function MisPedidosWidget({
  pedidosPorEstado,
  empresasActivas,
  productosPorEmpresa,
  ultimoPedido,
  loading,
  pedidoRapidoCargando,
  onVerTodos,
  onClickEmpresasActivas,
  onClickEmpresaCatalogo,
  onNuevoPedido,
  onPedidoRapido,
}: MisPedidosWidgetProps) {
  const empresasVisibles = productosPorEmpresa.slice(0, 3);
  const empresasRestantes = productosPorEmpresa.length - empresasVisibles.length;

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
      {/* Pedidos por estado */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ESTADOS.map(({ key, label, dot, textClass }) => (
          <button key={key} onClick={onVerTodos} className="text-left rounded-xl border border-brand-neutral-200 px-3 py-2.5 hover:border-brand-neutral-300 transition-colors duration-150">
            <p className={`text-2xl font-display font-extrabold tabular-nums leading-none ${textClass}`}>
              {loading ? "—" : pedidosPorEstado[key]}
            </p>
            <p className="text-[11px] text-brand-neutral-500 mt-1.5 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
              {label}
            </p>
          </button>
        ))}
      </div>

      {/* Empresas activas + productos por empresa en el catálogo */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 pt-1">
        <button onClick={onClickEmpresasActivas} className="text-left shrink-0">
          <p className="text-3xl font-display font-extrabold text-brand-neutral-900 tabular-nums leading-none">
            {loading ? "—" : empresasActivas}
          </p>
          <p className="text-xs text-brand-neutral-500 mt-1.5 whitespace-nowrap">Empresas activas</p>
        </button>

        {!loading && empresasVisibles.length > 0 && (
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="text-[11px] font-semibold text-brand-neutral-400 uppercase tracking-wide">
              Productos en catálogo
            </p>
            {empresasVisibles.map((e) => (
              <button
                key={e.empresa_id}
                onClick={() => onClickEmpresaCatalogo(e.empresa_id)}
                className="w-full flex items-center justify-between gap-2 text-left group"
              >
                <span className="text-sm text-brand-neutral-700 truncate group-hover:text-brand-primary-600 transition-colors">
                  {e.empresa_nombre}
                </span>
                <span className="text-sm font-semibold text-brand-neutral-900 tabular-nums shrink-0">
                  {e.cantidad}
                </span>
              </button>
            ))}
            {empresasRestantes > 0 && (
              <p className="text-xs text-brand-neutral-400">+{empresasRestantes} empresa{empresasRestantes > 1 ? "s" : ""} más</p>
            )}
          </div>
        )}
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
                {ultimoPedido.status.replace("_", " ")}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-brand-neutral-400 py-2">Aún no has realizado pedidos.</p>
        )}
      </div>

      {/* Accesos rápidos */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <Button variant="primary" className="text-sm" onClick={onNuevoPedido}>
          <PlusIcon />
          Nuevo pedido
        </Button>
        <Button
          variant="secondary"
          className="text-sm"
          onClick={onPedidoRapido}
          isLoading={pedidoRapidoCargando}
        >
          <BoltIcon />
          Pedido rápido
        </Button>
      </div>
    </ModuleCard>
  );
}
