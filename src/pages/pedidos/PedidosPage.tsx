// src/pages/pedidos/PedidosPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPedidos, getPedido } from "../../services/pedidoService";
import type { PedidoWeb, ItemPedidoWeb } from "../../models/PedidoWeb";
import Button from "../../components/ui/Button";

// ── Helpers de estado ───────────────────────────────────────────────
const STATUS_CONFIG = {
  pendiente: {
    label: "Pendiente",
    bg: "bg-amber-100",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  aprobado_vendedor: {
    label: "Aprobado por vendedor",
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  aprobado: {
    label: "Aprobado",
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  rechazado: {
    label: "Rechazado",
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  modificado: {
    label: "Modificado",
    bg: "bg-orange-100",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
} as const;

function StatusBadge({ status }: { status: PedidoWeb["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────
function PedidoSkeleton() {
  return (
    <div className="animate-pulse bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-brand-neutral-200 rounded w-32" />
          <div className="h-3 bg-brand-neutral-100 rounded w-48" />
        </div>
        <div className="h-6 bg-brand-neutral-100 rounded-full w-24" />
      </div>
    </div>
  );
}

// ── Modal de detalle ────────────────────────────────────────────────
function DetallePedidoModal({
  pedido,
  onClose,
}: {
  pedido: PedidoWeb;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-neutral-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-neutral-100">
          <div>
            <h3 className="text-lg font-display font-bold text-brand-neutral-900">
              Pedido {pedido.codigo_pedido_web}
            </h3>
            <p className="text-xs text-brand-neutral-400 mt-0.5">{pedido.fecha} · {pedido.empresa}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={pedido.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-brand-neutral-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-brand-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="overflow-y-auto max-h-[60vh]">

          {/* Header tabla */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-brand-neutral-50 border-b border-brand-neutral-100 text-xs font-semibold text-brand-neutral-500 uppercase tracking-wider">
            <div className="col-span-4">Producto</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-right">Precio</div>
            <div className="col-span-1 text-center">Dscto.</div>
            <div className="col-span-3 text-right">Subtotal</div>
          </div>

          {pedido.items?.map((item: ItemPedidoWeb) => {
            const tieneDescuento = !!item.porc_descuento && item.porc_descuento > 0;
            return (
              <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-brand-neutral-100 last:border-0 items-center">
                <div className="col-span-4">
                  <p className="text-sm font-semibold text-brand-neutral-900 line-clamp-1">{item.nombre}</p>
                  <p className="text-xs text-brand-neutral-400 font-mono">{item.codigo}</p>
                </div>
                <div className="col-span-2 text-center text-sm text-brand-neutral-700">
                  {item.cantidad} <span className="text-brand-neutral-400 text-xs">{item.unidad_medida}</span>
                </div>
                <div className="col-span-2 text-right text-sm">
                  {tieneDescuento && (
                    <p className="text-xs text-brand-neutral-400 line-through">
                      {item.moneda ?? "$"} {item.precio_bruto!.toFixed(2)}
                    </p>
                  )}
                  <p className="text-brand-neutral-600">
                    {item.moneda ?? "$"} {item.precio_unitario.toFixed(2)}
                  </p>
                </div>
                <div className="col-span-1 text-center">
                  {tieneDescuento && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                      -{item.porc_descuento!.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="col-span-3 text-right text-sm font-semibold text-brand-neutral-900">
                  {item.moneda ?? "$"} {item.subtotal.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-brand-neutral-100 space-y-4">

          {/* Observaciones */}
          {pedido.observaciones && (
            <div className="p-4 rounded-xl bg-brand-neutral-50">
              <p className="text-xs font-semibold text-brand-neutral-500 mb-1">Observaciones</p>
              <p className="text-sm text-brand-neutral-700">{pedido.observaciones}</p>
            </div>
          )}

          {/* Motivo de rechazo */}
          {pedido.status === "rechazado" && pedido.motivo_rechazo && (
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}
            >
              <p className="text-xs font-semibold text-red-500 mb-1">Motivo de rechazo</p>
              <p className="text-sm text-red-700">{pedido.motivo_rechazo}</p>
            </div>
          )}

          {/* Vendedor / número SAP */}
          {(pedido.vendedor || pedido.pedido_sap) && (
            <div className="flex flex-wrap gap-3">
              {pedido.vendedor && (
                <div className="flex-1 min-w-[140px] p-3 rounded-xl bg-brand-neutral-50">
                  <p className="text-xs font-semibold text-brand-neutral-500 mb-0.5">Vendedor</p>
                  <p className="text-sm text-brand-neutral-800">{pedido.vendedor}</p>
                </div>
              )}
              {pedido.pedido_sap && (
                <div className="flex-1 min-w-[140px] p-3 rounded-xl bg-brand-neutral-50">
                  <p className="text-xs font-semibold text-brand-neutral-500 mb-0.5">N.° pedido SAP</p>
                  <p className="text-sm text-brand-neutral-800 font-mono">{pedido.pedido_sap}</p>
                </div>
              )}
            </div>
          )}

          {/* Desglose fiscal */}
          {pedido.desglose && (
            <div className="p-4 rounded-xl bg-brand-neutral-50 space-y-1.5">
              <p className="text-xs font-semibold text-brand-neutral-500 mb-1">Desglose fiscal</p>
              {[
                ["Base imponible 16%", pedido.desglose.subtotal_16],
                ["IVA 16%", pedido.desglose.iva_16],
                ["Base imponible 8%", pedido.desglose.subtotal_8],
                ["IVA 8%", pedido.desglose.iva_8],
                ["Base exenta", pedido.desglose.subtotal_exento],
                ["Retención", pedido.desglose.retencion],
              ].map(([label, valor]) => (
                <div key={label as string} className="flex items-center justify-between text-sm">
                  <span className="text-brand-neutral-500">{label}</span>
                  <span className="text-brand-neutral-800 font-medium tabular-nums">
                    {pedido.moneda ?? "$"} {(valor as number).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Historial de estados */}
          {pedido.historial && pedido.historial.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-brand-neutral-500 mb-2">Seguimiento</p>
              <div className="space-y-2.5">
                {pedido.historial.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-400 mt-1.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-brand-neutral-700">
                        <span className="font-semibold">{STATUS_CONFIG[h.status_nuevo as keyof typeof STATUS_CONFIG]?.label ?? h.status_nuevo}</span>
                        {" · "}
                        <span className="text-brand-neutral-400 capitalize">{h.actor_tipo}</span>
                      </p>
                      {h.motivo && <p className="text-xs text-brand-neutral-500 mt-0.5">{h.motivo}</p>}
                      <p className="text-[10px] text-brand-neutral-400 mt-0.5">{h.fecha}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold text-brand-neutral-700">Total</span>
            <span className="text-xl font-bold text-brand-primary-600">
              {pedido.moneda ?? "$"} {pedido.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Fila de pedido ──────────────────────────────────────────────────
function PedidoRow({
  pedido,
  onVerDetalle,
}: {
  pedido: PedidoWeb;
  onVerDetalle: (id: number) => void;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200 animate-slide-up">

      {/* Info principal */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-semibold text-brand-primary-600">
            {pedido.codigo_pedido_web}
          </span>
          <StatusBadge status={pedido.status} />
        </div>
        <p className="text-sm font-semibold text-brand-neutral-900 truncate">{pedido.empresa}</p>
        <p className="text-xs text-brand-neutral-400">{pedido.fecha}</p>
      </div>

      {/* Total */}
      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-brand-neutral-900">
          {pedido.moneda ?? "$"} {pedido.total.toFixed(2)}
        </p>
        <p className="text-xs text-brand-neutral-400">Total del pedido</p>
      </div>

      {/* Acción */}
      <button
        onClick={() => onVerDetalle(pedido.id)}
        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-neutral-100 hover:bg-brand-primary-50 hover:text-brand-primary-700 text-brand-neutral-600 text-sm font-medium transition-all duration-200"
      >
        Ver detalle
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>
  );
}

// ── Página principal ────────────────────────────────────────────────
export default function PedidosPage() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<PedidoWeb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<PedidoWeb["status"] | "todos">("todos");
  const [pedidoDetalle, setPedidoDetalle] = useState<PedidoWeb | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidos();
        setPedidos(data);
      } catch {
        setError("No se pudieron cargar los pedidos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const handleVerDetalle = async (id: number) => {
    setLoadingDetalle(true);
    try {
      const data = await getPedido(id);
      setPedidoDetalle(data);
    } catch {
      setError("No se pudo cargar el detalle del pedido.");
    } finally {
      setLoadingDetalle(false);
    }
  };

  const pedidosFiltrados = filtroStatus === "todos"
    ? pedidos
    : pedidos.filter((p) => p.status === filtroStatus);

  const contadores = {
    todos: pedidos.length,
    pendiente: pedidos.filter((p) => p.status === "pendiente").length,
    aprobado_vendedor: pedidos.filter((p) => p.status === "aprobado_vendedor").length,
    aprobado: pedidos.filter((p) => p.status === "aprobado").length,
    rechazado: pedidos.filter((p) => p.status === "rechazado").length,
    modificado: pedidos.filter((p) => p.status === "modificado").length,
  };

  return (
    <div className="space-y-10 animate-fade-in">

      {/* ── Encabezado ── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-brand-primary-600 uppercase tracking-widest">
            Historial
          </p>
          <h1 className="text-3xl font-display font-extrabold text-brand-neutral-900">Mis Pedidos</h1>
          <p className="text-brand-neutral-500 mt-1">Consulta el estado de tus pedidos.</p>
        </div>

        <Button variant="primary" onClick={() => navigate("/empresas")}>
          Nuevo pedido
        </Button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}
        >
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* ── Filtros ── */}
      {!loading && pedidos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(["todos", "pendiente", "aprobado_vendedor", "aprobado", "rechazado", "modificado"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFiltroStatus(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filtroStatus === s
                  ? "bg-brand-primary-600 text-brand-neutral-900 shadow-md"
                  : "bg-white/70 text-brand-neutral-600 hover:bg-brand-primary-50 hover:text-brand-primary-700 border border-white/20 backdrop-blur-xl shadow-sm"
              }`}
            >
              <span className="capitalize">{s === "todos" ? "Todos" : STATUS_CONFIG[s].label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                filtroStatus === s ? "bg-brand-neutral-900/10 text-brand-neutral-900" : "bg-brand-neutral-100 text-brand-neutral-500"
              }`}>
                {contadores[s]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Lista ── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => <PedidoSkeleton key={n} />)}
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-neutral-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <p className="text-brand-neutral-500 font-medium">
            {filtroStatus === "todos" ? "Aún no tienes pedidos." : `No tienes pedidos ${STATUS_CONFIG[filtroStatus as keyof typeof STATUS_CONFIG]?.label.toLowerCase()}.`}
          </p>
          {filtroStatus !== "todos" ? (
            <button
              onClick={() => setFiltroStatus("todos")}
              className="text-sm text-brand-primary-600 hover:text-brand-primary-700 font-medium transition-colors"
            >
              Ver todos los pedidos
            </button>
          ) : (
            <Button variant="secondary" onClick={() => navigate("/empresas")}>
              Hacer mi primer pedido
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {pedidosFiltrados.map((pedido, i) => (
            <div key={pedido.id} style={{ animationDelay: `${i * 60}ms` }}>
              <PedidoRow pedido={pedido} onVerDetalle={handleVerDetalle} />
            </div>
          ))}
        </div>
      )}

      {/* ── Modal detalle ── */}
      {loadingDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-neutral-900/40 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-brand-primary-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {pedidoDetalle && !loadingDetalle && (
        <DetallePedidoModal
          pedido={pedidoDetalle}
          onClose={() => setPedidoDetalle(null)}
        />
      )}
    </div>
  );
}