// src/pages/dashboard/DashboardPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getDashboard, getUltimasVisitas, getProximaVisita, getDescuentos, getPedidoRapido } from "../../services/dashboardService";
import type { DashboardData, VisitaComercial, ProximaVisita, ProductoDescuento } from "../../models/Dashboard";
import { getDashboardCache, setDashboardCache, DASHBOARD_CACHE_TTL_MS, type DashboardSnapshot } from "../../services/dashboardCache";
import { useFavoritos } from "../../hooks/useFavoritos";
import { useCarrito } from "../../contexts/CarritoContext";
import MisPedidosWidget from "./widgets/MisPedidosWidget";
import CreditoWidget from "./widgets/CreditoWidget";
import MapaWidget from "./widgets/MapaWidget";
import VisitasWidget from "./widgets/VisitasWidget";
import FavoritosWidget from "./widgets/FavoritosWidget";
import ProximamenteStrip from "./widgets/ProximamenteStrip";
import ModuleCard from "../../components/ui/ModuleCard";
import Button from "../../components/ui/Button";
import GoldRing from "../../components/ui/GoldRing";
import Carousel from "../../components/ui/Carousel";
import SplitText from "../../components/ui/SplitText";
import AgregarRapidoButton from "../../components/ui/AgregarRapidoButton";

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

/** Card independiente para el carrusel de UNA empresa — cada empresa tiene su propia caja, no una sección más dentro de una card compartida. */
function EmpresaCarouselCard({
  empresaNombre,
  onVerCatalogo,
  children,
}: {
  empresaNombre: string;
  onVerCatalogo: () => void;
  children: React.ReactNode;
}) {
  return (
    <ModuleCard
      title={empresaNombre}
      titleRight={
        <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={onVerCatalogo}>
          Ver catálogo →
        </Button>
      }
      className="!p-5"
    >
      {children}
    </ModuleCard>
  );
}

/**
 * Ya no es un solo <button> completo: el botón de agregar rápido va
 * superpuesto sobre la imagen, y un botón dentro de otro botón no es
 * válido — la imagen y el texto son botones hermanos, ambos navegan al
 * catálogo de la empresa.
 */
function ProductoMiniCard({
  nombre,
  foto,
  onClick,
  children,
  materialId,
  empresaId,
  codigo,
  precioUnitario,
  unidadMedida,
  moneda,
  porcImpuesto,
}: {
  nombre: string;
  foto: string | null;
  onClick: () => void;
  children: React.ReactNode;
  materialId: number;
  empresaId: number;
  codigo: string;
  precioUnitario: number;
  unidadMedida: string;
  moneda: string;
  porcImpuesto: number;
}) {
  return (
    <div className="shrink-0 w-40 snap-start rounded-xl border border-brand-neutral-200 hover:border-brand-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden bg-white group">
      <div className="relative">
        <button onClick={onClick} className="block w-full text-left" aria-label={`Ver ${nombre} en el catálogo`}>
          <div className="h-24 bg-gradient-to-br from-brand-neutral-100 to-brand-neutral-200 flex items-center justify-center overflow-hidden">
            {foto ? (
              <img src={foto} alt={nombre} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <span className="text-lg font-bold text-brand-primary-600">{nombre.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </button>
        <div className="absolute bottom-2 right-2">
          <AgregarRapidoButton
            empresaId={empresaId}
            materialId={materialId}
            snapshot={{
              nombre,
              codigo,
              foto,
              precio_unitario: precioUnitario,
              unidad_medida: unidadMedida,
              moneda,
              porc_impuesto: porcImpuesto,
            }}
          />
        </div>
      </div>
      <button onClick={onClick} className="block w-full text-left p-3">
        <p className="text-sm font-semibold text-brand-neutral-900 line-clamp-1">{nombre}</p>
        {children}
      </button>
    </div>
  );
}

interface GrupoEmpresa<T> {
  empresaId: number;
  empresaNombre: string;
  items: T[];
}

function agruparPorEmpresa<T>(
  items: T[],
  getEmpresaId: (item: T) => number,
  getEmpresaNombre: (item: T) => string
): GrupoEmpresa<T>[] {
  const grupos = new Map<number, GrupoEmpresa<T>>();
  for (const item of items) {
    const empresaId = getEmpresaId(item);
    if (!grupos.has(empresaId)) {
      grupos.set(empresaId, { empresaId, empresaNombre: getEmpresaNombre(item) || `Empresa ${empresaId}`, items: [] });
    }
    grupos.get(empresaId)!.items.push(item);
  }
  return Array.from(grupos.values());
}

async function fetchDashboardSnapshot(signal?: AbortSignal): Promise<DashboardSnapshot> {
  const [dashRes, visitasRes, proximaRes, descuentosRes] = await Promise.allSettled([
    getDashboard(signal),
    getUltimasVisitas(signal),
    getProximaVisita(signal),
    getDescuentos(signal),
  ]);
  return {
    dashboard: dashRes.status === "fulfilled" ? dashRes.value : null,
    visitas: visitasRes.status === "fulfilled" ? visitasRes.value : [],
    proximaVisita: proximaRes.status === "fulfilled" ? proximaRes.value : null,
    descuentos: descuentosRes.status === "fulfilled" ? descuentosRes.value : [],
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cached = getDashboardCache();
  const [dashboard, setDashboard] = useState<DashboardData | null>(cached?.data.dashboard ?? null);
  const [visitas, setVisitas] = useState<VisitaComercial[]>(cached?.data.visitas ?? []);
  const [proximaVisita, setProximaVisita] = useState<ProximaVisita | null>(cached?.data.proximaVisita ?? null);
  const [descuentos, setDescuentos] = useState<ProductoDescuento[]>(cached?.data.descuentos ?? []);
  const [loading, setLoading] = useState(!cached);
  const { listaFavoritos } = useFavoritos();
  const { agregar, setCarritoActivo } = useCarrito();
  const [pedidoRapidoCargando, setPedidoRapidoCargando] = useState(false);
  const [pedidoRapidoMensaje, setPedidoRapidoMensaje] = useState<string | null>(null);

  const descuentosPorEmpresa = useMemo(
    () => agruparPorEmpresa(descuentos, (d) => d.empresa_id, (d) => d.empresa_nombre ?? ""),
    [descuentos]
  );

  // "Pedido rápido": trae los productos que el cliente pide seguido
  // (aprobados y subidos a SAP, ver nota del backend) y los agrega
  // directo a los carritos de cada empresa correspondiente, para que
  // solo tenga que revisar/ajustar cantidades antes de confirmar — no
  // arranca desde cero navegando el catálogo.
  const handlePedidoRapido = async () => {
    setPedidoRapidoMensaje(null);
    setPedidoRapidoCargando(true);
    try {
      const grupos = await getPedidoRapido();

      if (grupos.length === 0) {
        setPedidoRapidoMensaje("Todavía no tenés suficiente historial de pedidos aprobados como para sugerir un pedido rápido.");
        return;
      }

      for (const grupo of grupos) {
        for (const item of grupo.items) {
          await agregar(grupo.empresa_id, item.material_id, item.cantidad_sugerida, {
            nombre: item.nombre,
            codigo: item.codigo,
            foto: item.foto,
            precio_unitario: item.precio_unitario,
            unidad_medida: item.unidad_medida,
            moneda: item.moneda,
            porc_impuesto: item.porc_impuesto,
          });
        }
      }

      // Deja activo el carrito de la empresa con más productos sugeridos
      // — si hay más de una, el selector del header permite pasar a las
      // demás (mismo patrón que cuando hay varios carritos con ítems).
      const empresaConMasItems = grupos.reduce((a, b) => (b.items.length > a.items.length ? b : a));
      setCarritoActivo(empresaConMasItems.empresa_id);
      navigate("/carrito");
    } catch {
      setPedidoRapidoMensaje("No se pudo armar el pedido rápido. Intenta de nuevo.");
    } finally {
      setPedidoRapidoCargando(false);
    }
  };

  const aplicarSnapshot = (data: DashboardSnapshot) => {
    setDashboard(data.dashboard);
    setVisitas(data.visitas);
    setProximaVisita(data.proximaVisita);
    setDescuentos(data.descuentos);
  };

  useEffect(() => {
    let mounted = true;
    const isFresh = cached && Date.now() - cached.timestamp < DASHBOARD_CACHE_TTL_MS;

    // Caché fresco: ya se mostró en el useState inicial, no hay nada que pedir.
    if (isFresh) {
      setLoading(false);
      return;
    }

    // AbortController real (no solo un flag "mounted"): en React StrictMode
    // (desarrollo) este efecto se monta, desmonta y vuelve a montar a
    // propósito para detectar cleanups faltantes — sin abort, las 5
    // peticiones del primer montaje seguían viajando igual (aunque su
    // resultado se descartara), duplicando la carga sobre un backend ya
    // lento. Al abortar en el cleanup, esas quedan canceladas de verdad.
    const controller = new AbortController();

    // Caché expirado o inexistente: refrescar. Si había caché (aunque viejo),
    // los datos ya están en pantalla — no mostramos skeleton, solo refrescamos.
    fetchDashboardSnapshot(controller.signal).then((data) => {
      if (!mounted) return;
      setDashboardCache(data);
      aplicarSnapshot(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const primerNombre = user?.email?.split("@")[0] ?? "";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      {/* lg: en vez de sm: — a partir de md:(768px) el sidebar fijo come
          ~256px reales; con sm:(640) esta fila ya estaba horizontal antes
          de tener ese espacio, y el botón "Nuevo pedido" quedaba cortado
          contra el borde del card (overflow-hidden). */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-neutral-900 via-brand-neutral-800 to-brand-neutral-900 px-6 sm:px-9 py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center"
          style={{
            backgroundImage: "url('/pasta/mosaico-pasta-alpha.png')",
            opacity: 0.3,
          }}
        />
        <GoldRing />

        <div className="relative">
          <p className="text-xs font-semibold text-brand-primary-300 uppercase tracking-widest">Dashboard</p>
          <h1 className="text-3xl font-display font-extrabold text-white mt-1">
            <SplitText key={primerNombre} text={`Hola, ${primerNombre}`} />
          </h1>
          <p className="text-brand-neutral-300 mt-1">Resumen de tu cuenta con Sindoni.</p>

          {dashboard?.cliente && (dashboard.cliente.razon_social || dashboard.cliente.rif) && (
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-brand-neutral-500 uppercase tracking-wide">Razón social</p>
                <p className="text-sm text-white font-medium mt-0.5 truncate">{dashboard.cliente.razon_social ?? "—"}</p>
              </div>
              <div className="w-px h-8 bg-white/10 shrink-0" />
              <div className="shrink-0">
                <p className="text-[10px] font-semibold text-brand-neutral-500 uppercase tracking-wide">RIF</p>
                <p className="text-sm text-white font-medium mt-0.5 tabular-nums">{dashboard.cliente.rif ?? "—"}</p>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="primary"
          className="relative shrink-0"
          onClick={() => navigate("/inicio")}
        >
          Nuevo pedido →
        </Button>
      </div>

      {/* Fila principal: Mis Pedidos (fusiona pedidos abiertos + último
          pedido + empresas activas, antes 3 piezas separadas) + Estado de
          cuenta — lo primero que un cliente B2B quiere saber al entrar. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <MisPedidosWidget
            pedidosPorEstado={dashboard?.pedidos_por_estado ?? { pendiente: 0, aprobado_vendedor: 0, aprobado: 0, rechazado: 0 }}
            empresasActivas={dashboard?.empresas_activas ?? 0}
            productosPorEmpresa={dashboard?.productos_por_empresa ?? []}
            ultimoPedido={dashboard?.ultimo_pedido ?? null}
            loading={loading}
            pedidoRapidoCargando={pedidoRapidoCargando}
            onVerTodos={() => navigate("/pedidos")}
            onClickEmpresasActivas={() => navigate("/inicio")}
            onClickEmpresaCatalogo={(empresaId) => navigate(`/catalogo/${empresaId}`)}
            onNuevoPedido={() => navigate("/inicio")}
            onPedidoRapido={handlePedidoRapido}
          />
          {pedidoRapidoMensaje && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-brand-primary-50 border border-brand-primary-100 text-sm text-brand-primary-700 animate-fade-in">
              <span>{pedidoRapidoMensaje}</span>
              <button onClick={() => setPedidoRapidoMensaje(null)} className="text-brand-primary-500 hover:text-brand-primary-700 shrink-0" aria-label="Cerrar">
                ✕
              </button>
            </div>
          )}
        </div>
        <CreditoWidget creditos={dashboard?.creditos ?? []} loading={loading} />
      </div>

      {/* Productos en descuento — antes al final de todo, ahora justo
          después de lo prioritario: es la oportunidad comercial real. */}
      {descuentosPorEmpresa.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-brand-primary-600"><TagIcon /></span>
            <h2 className="text-base font-display font-bold text-brand-neutral-900">Productos en descuento</h2>
          </div>
          <div className="space-y-5">
            {descuentosPorEmpresa.map((grupo) => (
              <EmpresaCarouselCard
                key={grupo.empresaId}
                empresaNombre={grupo.empresaNombre}
                onVerCatalogo={() => navigate(`/catalogo/${grupo.empresaId}`)}
              >
                <Carousel>
                  {grupo.items.map((p) => (
                    <ProductoMiniCard
                      key={p.id}
                      nombre={p.nombre}
                      foto={p.foto}
                      onClick={() => navigate(`/catalogo/${p.empresa_id}`)}
                      materialId={p.id}
                      empresaId={p.empresa_id}
                      codigo={p.material_id}
                      precioUnitario={p.precio_neto}
                      unidadMedida={p.unidad_medida}
                      moneda={p.moneda}
                      porcImpuesto={p.porc_impuesto}
                    >
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-brand-neutral-400 line-through">
                          {p.moneda} {p.precio_bruto.toFixed(2)}
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600">
                          -{p.porc_descuento.toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-xs text-red-600 font-bold mt-0.5">
                        {p.moneda} {p.precio_neto.toFixed(2)}
                      </p>
                    </ProductoMiniCard>
                  ))}
                </Carousel>
              </EmpresaCarouselCard>
            ))}
          </div>
        </div>
      )}

      {/* Contexto compacto: antes 3 cards a ancho completo apiladas en la
          columna derecha — ahora del mismo tamaño entre sí, información de
          contexto/relación, no de acción. lg: (no sm:/md:) por el mismo
          motivo de siempre: con sidebar fijo desde 768px, 3 columnas
          apretaban de más hasta 1024px. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VisitasWidget ultimas={visitas} proxima={proximaVisita} loading={loading} />
        <MapaWidget ubicacion={dashboard?.ubicacion ?? null} loading={loading} />
        <FavoritosWidget favoritos={listaFavoritos} onSelect={(f) => navigate(`/catalogo/${f.empresaId}`)} />
      </div>

      {/* Antes 2 cards completas y vacías (features sin construir) — ahora
          1 franja mínima. */}
      <ProximamenteStrip
        items={[
          { label: "Facturas pendientes", fase: "Fase 4 — Cuentas y Pagos" },
          { label: "Reclamos", fase: "Fase 5 — Atención al Cliente" },
        ]}
      />
    </div>
  );
}
