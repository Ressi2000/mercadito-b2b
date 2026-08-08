// src/pages/carrito/ConfirmacionPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../contexts/CarritoContext";
import { confirmarPedido } from "../../services/pedidoService";
import Button from "../../components/ui/Button";

// ── Paso 1: Resumen editable ────────────────────────────────────────
function PasoResumen({
  observaciones,
  onObservacionesChange,
  onConfirmar,
}: {
  observaciones: string;
  onObservacionesChange: (v: string) => void;
  onConfirmar: () => void;
}) {
  const { carrito } = useCarrito();
  const navigate = useNavigate();

  if (!carrito) return null;

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Encabezado */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-brand-primary-500 text-brand-neutral-900 flex items-center justify-center text-sm font-bold">1</div>
          <p className="text-xs font-semibold text-brand-primary-600 uppercase tracking-widest">Paso 1 de 2</p>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-brand-neutral-900">Resumen del pedido</h1>
        <p className="text-brand-neutral-500">Revisa los productos antes de confirmar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Tabla de items */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">

          {/* Header tabla */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-brand-neutral-50/80 border-b border-brand-neutral-100 text-xs font-semibold text-brand-neutral-500 uppercase tracking-wider">
            <div className="col-span-5">Producto</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-right">Precio unit.</div>
            <div className="col-span-3 text-right">Subtotal</div>
          </div>

          {/* Items */}
          {carrito.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-brand-neutral-100 last:border-0 items-center">
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-neutral-100 shrink-0">
                  {item.foto ? (
                    <img src={item.foto} alt={item.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm font-bold text-brand-primary-600">
                        {item.nombre?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-neutral-900 line-clamp-1">{item.nombre}</p>
                  <p className="text-xs text-brand-neutral-400 font-mono">{item.codigo}</p>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-sm font-semibold text-brand-neutral-700">
                  {item.cantidad} <span className="text-brand-neutral-400 font-normal">{item.unidad_medida}</span>
                </span>
              </div>
              <div className="col-span-2 text-right text-sm text-brand-neutral-600">
                {item.moneda ?? "$"} {item.precio_unitario.toFixed(2)}
              </div>
              <div className="col-span-3 text-right text-sm font-semibold text-brand-neutral-900">
                {item.moneda ?? "$"} {item.subtotal.toFixed(2)}
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between items-center px-6 py-4 bg-brand-neutral-50/80 border-t border-brand-neutral-200">
            <span className="text-sm font-semibold text-brand-neutral-700">Total estimado</span>
            <span className="text-xl font-bold text-brand-primary-600">
              {carrito.items[0]?.moneda ?? "$"} {carrito.total_estimado.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-5">

          {/* Info del pedido */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 space-y-3">
            <h3 className="text-sm font-semibold text-brand-neutral-700">Información del pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-neutral-500">Código</span>
                <span className="font-mono text-brand-neutral-700">{carrito.codigo_pedido_web}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-neutral-500">Productos</span>
                <span className="text-brand-neutral-700">{carrito.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-neutral-500">Estado</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-accent-100 text-brand-accent-700 text-xs font-semibold">
                  En revisión
                </span>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 space-y-3">
            <label className="text-sm font-semibold text-brand-neutral-700">
              Observaciones <span className="text-brand-neutral-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => onObservacionesChange(e.target.value)}
              placeholder="Notas adicionales para este pedido..."
              rows={4}
              maxLength={500}
              className="w-full text-sm text-brand-neutral-800 bg-white/50 border border-brand-neutral-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary-500/50 focus:border-brand-primary-500 transition-all duration-200 placeholder:text-brand-neutral-400"
            />
            <p className="text-xs text-brand-neutral-400 text-right">{observaciones.length}/500</p>
          </div>

          {/* Acciones */}
          <Button variant="primary" className="w-full" onClick={onConfirmar}>
            Continuar
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Button>
          <button
            onClick={() => navigate("/carrito")}
            className="w-full text-sm text-brand-neutral-500 hover:text-brand-primary-600 transition-colors duration-200 font-medium"
          >
            Volver al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Paso 2: Confirmación final ──────────────────────────────────────
function PasoConfirmacion({
  observaciones,
  onEnviar,
  onVolver,
  loading,
}: {
  observaciones: string;
  onEnviar: () => void;
  onVolver: () => void;
  loading: boolean;
}) {
  const { carrito } = useCarrito();
  if (!carrito) return null;

  return (
    <div className="max-w-lg mx-auto space-y-8 animate-slide-up">

      {/* Encabezado */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-brand-primary-500 text-brand-neutral-900 flex items-center justify-center text-sm font-bold">2</div>
          <p className="text-xs font-semibold text-brand-primary-600 uppercase tracking-widest">Paso 2 de 2</p>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-brand-neutral-900">Confirmar pedido</h1>
        <p className="text-brand-neutral-500">Esta acción no se puede deshacer.</p>
      </div>

      {/* Card de confirmación */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 space-y-6">

        {/* Ícono de alerta */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary-500/10 border border-brand-primary-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Resumen compacto */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-brand-neutral-100">
            <span className="text-brand-neutral-500">Código</span>
            <span className="font-mono font-semibold text-brand-neutral-800">{carrito.codigo_pedido_web}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-brand-neutral-100">
            <span className="text-brand-neutral-500">Productos</span>
            <span className="font-semibold text-brand-neutral-800">{carrito.items.length} items</span>
          </div>
          <div className="flex justify-between py-2 border-b border-brand-neutral-100">
            <span className="text-brand-neutral-500">Total</span>
            <span className="font-bold text-brand-primary-600 text-base">
              {carrito.items[0]?.moneda ?? "$"} {carrito.total_estimado.toFixed(2)}
            </span>
          </div>
          {observaciones && (
            <div className="py-2">
              <span className="text-brand-neutral-500 block mb-1">Observaciones</span>
              <span className="text-brand-neutral-700 text-xs leading-relaxed">{observaciones}</span>
            </div>
          )}
        </div>

        {/* Aviso */}
        <div
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.20)" }}
        >
          <svg className="w-4 h-4 text-brand-primary-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p className="text-xs text-brand-primary-700 leading-relaxed">
            Al confirmar, el pedido pasará a estado <strong>Pendiente</strong> y será revisado por el equipo administrativo.
          </p>
        </div>

        {/* Acciones */}
        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            className="w-full"
            onClick={onEnviar}
            isLoading={loading}
          >
            Enviar pedido
          </Button>
          <button
            onClick={onVolver}
            disabled={loading}
            className="w-full text-sm text-brand-neutral-500 hover:text-brand-primary-600 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            Revisar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Paso 3: Éxito ───────────────────────────────────────────────────
function PasoExito({ codigo }: { codigo: string }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto text-center space-y-8 animate-slide-up">
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-10 space-y-6">

        {/* Ícono éxito */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-brand-neutral-900">¡Pedido enviado!</h2>
          <p className="text-brand-neutral-500">Tu pedido fue recibido y está pendiente de aprobación.</p>
        </div>

        <div className="py-3 px-6 bg-brand-neutral-50 rounded-xl">
          <p className="text-xs text-brand-neutral-500 mb-1">Código de pedido</p>
          <p className="font-mono font-bold text-brand-primary-600 text-lg">{codigo}</p>
        </div>

        <div className="space-y-3 pt-2">
          <Button variant="primary" className="w-full" onClick={() => navigate("/pedidos")}>
            Ver mis pedidos
          </Button>
          <button
            onClick={() => navigate("/empresas")}
            className="w-full text-sm text-brand-neutral-500 hover:text-brand-primary-600 transition-colors duration-200 font-medium"
          >
            Hacer otro pedido
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ────────────────────────────────────────────────
export default function ConfirmacionPage() {
  const navigate = useNavigate();
  const { carrito, clearCarrito } = useCarrito();

  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [codigoConfirmado, setCodigoConfirmado] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Redirigir si no hay carrito o está vacío
  if (!carrito || carrito.items.length === 0) {
    navigate("/carrito");
    return null;
  }

  const handleEnviar = async () => {
    if (!carrito || !carrito.id) return;
    setLoading(true);
    setError(null);

    try {
      const pedido = await confirmarPedido(carrito.id, observaciones);
      setCodigoConfirmado(pedido.codigo_pedido_web);
      clearCarrito();
      setPaso(3);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al confirmar el pedido.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">

      {/* Error global */}
      {error && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl animate-slide-up"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)" }}
        >
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {paso === 1 && (
        <PasoResumen
          observaciones={observaciones}
          onObservacionesChange={setObservaciones}
          onConfirmar={() => setPaso(2)}
        />
      )}

      {paso === 2 && (
        <PasoConfirmacion
          observaciones={observaciones}
          onEnviar={handleEnviar}
          onVolver={() => setPaso(1)}
          loading={loading}
        />
      )}

      {paso === 3 && <PasoExito codigo={codigoConfirmado} />}
    </div>
  );
}