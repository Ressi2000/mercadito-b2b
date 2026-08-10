// src/pages/dashboard/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getDashboard, getTasaBcv, getUltimasVisitas, getProximaVisita } from "../../services/dashboardService";
import type { DashboardData, TasaBcv, VisitaComercial, ProximaVisita } from "../../models/Dashboard";
import KpiCard from "../../components/ui/KpiCard";
import CreditoWidget from "./widgets/CreditoWidget";
import MapaWidget from "./widgets/MapaWidget";
import VisitasWidget from "./widgets/VisitasWidget";
import ProximamenteWidget from "./widgets/ProximamenteWidget";
import ModuleCard from "../../components/ui/ModuleCard";
import Button from "../../components/ui/Button";

const statusStyles: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobado: "bg-green-100 text-green-700",
  rechazado: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [tasa, setTasa] = useState<TasaBcv | null>(null);
  const [visitas, setVisitas] = useState<VisitaComercial[]>([]);
  const [proximaVisita, setProximaVisita] = useState<ProximaVisita | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([getDashboard(), getTasaBcv(), getUltimasVisitas(), getProximaVisita()]).then(
      ([dashRes, tasaRes, visitasRes, proximaRes]) => {
        if (!mounted) return;
        if (dashRes.status === "fulfilled") setDashboard(dashRes.value);
        if (tasaRes.status === "fulfilled") setTasa(tasaRes.value);
        if (visitasRes.status === "fulfilled") setVisitas(visitasRes.value);
        if (proximaRes.status === "fulfilled") setProximaVisita(proximaRes.value);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
    };
  }, []);

  const primerNombre = user?.email?.split("@")[0] ?? "";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-primary-400/50 bg-gradient-to-br from-brand-neutral-900 via-brand-neutral-800 to-brand-neutral-900 px-6 sm:px-9 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div
          className="absolute inset-0 pointer-events-none bg-cover bg-center"
          style={{
            backgroundImage: "url('/pasta/mosaico-pasta-alpha.png')",
            opacity: 0.4,
          }}
        />

        <div className="relative">
          <p className="text-xs font-semibold text-brand-primary-300 uppercase tracking-widest">Dashboard</p>
          <h1 className="text-3xl font-display font-extrabold text-white mt-1">Hola, {primerNombre}</h1>
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

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          featured
          label="Pedidos abiertos"
          value={loading ? "—" : String(dashboard?.pedidos_abiertos ?? 0)}
          hint="En espera de aprobación"
          onClick={() => navigate("/pedidos")}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          }
        />
        <KpiCard
          label="Empresas activas"
          value={loading ? "—" : String(dashboard?.empresas_activas ?? 0)}
          hint="Para realizar pedidos"
          onClick={() => navigate("/inicio")}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15" />
            </svg>
          }
        />
        <KpiCard
          label="Tasa BCV"
          value={tasa ? `Bs. ${tasa.tasa.toLocaleString("es-VE", { minimumFractionDigits: 2 })}` : "—"}
          hint={tasa ? new Date(tasa.fecha).toLocaleDateString("es-VE") : "No disponible"}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          label="Próxima visita"
          value={proximaVisita ? new Date(proximaVisita.fecha).toLocaleDateString("es-VE", { day: "2-digit", month: "short" }) : "—"}
          hint={proximaVisita?.vendedor ?? "No agendada"}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          }
        />
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CreditoWidget creditos={dashboard?.creditos ?? []} loading={loading} />

          {/* Último pedido */}
          <ModuleCard
            title="Último pedido"
            titleRight={
              <Button variant="ghost" className="!px-3 !py-1.5 text-sm" onClick={() => navigate("/pedidos")}>
                Ver todos
              </Button>
            }
            tricolor
          >
            {loading ? (
              <div className="h-16 bg-brand-neutral-100 rounded-xl animate-pulse" />
            ) : dashboard?.ultimo_pedido ? (
              <div className="flex items-center justify-between gap-4 rounded-xl border border-brand-neutral-200 px-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-neutral-900 truncate">
                    {dashboard.ultimo_pedido.codigo_pedido_web}
                  </p>
                  <p className="text-xs text-brand-neutral-500 mt-0.5">
                    {dashboard.ultimo_pedido.empresa} · {dashboard.ultimo_pedido.fecha}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-brand-neutral-900 tabular-nums">
                    {dashboard.ultimo_pedido.moneda} {dashboard.ultimo_pedido.total.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${statusStyles[dashboard.ultimo_pedido.status] ?? "bg-brand-neutral-100 text-brand-neutral-600"}`}>
                    {dashboard.ultimo_pedido.status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-brand-neutral-400 py-2">Aún no has realizado pedidos.</p>
            )}
          </ModuleCard>

          {/* Módulos futuros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ProximamenteWidget
              label="Facturas pendientes"
              fase="Fase 4 — Cuentas y Pagos"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <ProximamenteWidget
              label="Reclamos en proceso"
              fase="Fase 5 — Atención al Cliente"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.142-4.03 7.5-9 7.5a10.05 10.05 0 01-2.555-.337L4.5 21l1.591-3.182A7.462 7.462 0 013 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5z" />
                </svg>
              }
            />
          </div>
        </div>

        <div className="space-y-6">
          <MapaWidget ubicacion={dashboard?.ubicacion ?? null} loading={loading} />
          <VisitasWidget ultimas={visitas} proxima={proximaVisita} loading={loading} />
        </div>
      </div>
    </div>
  );
}
