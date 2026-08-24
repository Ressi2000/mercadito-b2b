// src/pages/empresas/EmpresasPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { getEmpresasByCliente } from "../../services/empresaService";
import { useCarrito } from "../../contexts/CarritoContext";
import { getEmpresasCache, setEmpresasCache, EMPRESAS_CACHE_TTL_MS } from "../../services/empresasCache";
import EmptyStateBadge from "../../components/illustrations/EmptyStateBadge";
import type { Empresa } from "../../models/Empresa";

function EmpresaSkeleton() {
  return (
    <div className="rounded-2xl bg-white/60 border border-white/20 shadow-xl p-6 space-y-4 animate-pulse">
      <div className="h-44 rounded-xl bg-brand-neutral-200" />
      <div className="space-y-2">
        <div className="h-4 bg-brand-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-brand-neutral-100 rounded w-1/2" />
      </div>
      <div className="h-10 bg-brand-neutral-100 rounded-xl" />
    </div>
  );
}

function ImagePlaceholder({ nombre }: { nombre: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-neutral-100 to-brand-neutral-200">
      <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center text-2xl font-bold text-brand-primary-600">
        {nombre?.charAt(0).toUpperCase() ?? "E"}
      </div>
      <span className="text-xs text-brand-neutral-400 font-medium">Sin imagen</span>
    </div>
  );
}

export default function EmpresasPage() {
  const cached = getEmpresasCache();
  const [empresas, setEmpresas] = useState<Empresa[]>(cached?.data ?? []);
  const [loading, setLoading] = useState(!cached);
  const navigate = useNavigate();
  const { fetchTodosLosCarritos, carritosPorEmpresa } = useCarrito();

  // Con caché (aunque esté vencido), las empresas ya están en pantalla desde
  // el useState inicial — no hace falta mostrar el skeleton para volver a
  // pedirlas, solo refrescar de fondo. Mismo patrón que DashboardPage.
  useEffect(() => {
    if (cached?.data.length) {
      fetchTodosLosCarritos(
        cached.data.map((e) => ({ id: e.id, nombre: e.nombre_mercancia }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isFresh = cached && Date.now() - cached.timestamp < EMPRESAS_CACHE_TTL_MS;
    if (isFresh) {
      setLoading(false);
      return;
    }

    // AbortController (no un simple flag): en StrictMode este efecto se
    // monta dos veces — sin abortar la primera tanda, la petición viajaba
    // igual contra el backend aunque su resultado se descartara. Mismo
    // patrón que Dashboard/Catálogo/Carrito/Pedidos.
    const controller = new AbortController();
    let mounted = true;
    const fetchEmpresas = async () => {
      try {
        const data = await getEmpresasByCliente(controller.signal);
        if (!mounted) return;
        setEmpresasCache(data);
        setEmpresas(data);
        // Pasar id + nombre para que el dropdown del header pueda mostrar el nombre
        if (data.length > 0) {
          fetchTodosLosCarritos(
            data.map(e => ({ id: e.id, nombre: e.nombre_mercancia }))
          );
        }
      } catch (error) {
        if (mounted) console.error("Error cargando empresas", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchEmpresas();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-10 animate-fade-in">

      <PageHeader
        eyebrow="Nuevo pedido"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V7a1 1 0 011-1h6a1 1 0 011 1v14M15 21v-9a1 1 0 011-1h3a1 1 0 011 1v9M4 21h16M8 10h1M8 13h1M8 16h1" />
          </svg>
        }
        title="Selecciona una Empresa"
        subtitle="Empresas habilitadas para tu cuenta."
      />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => <EmpresaSkeleton key={n} />)}
        </div>
      ) : empresas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <EmptyStateBadge>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </EmptyStateBadge>
          <p className="text-brand-neutral-500 font-medium">No tienes empresas asignadas.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-brand-neutral-400 -mt-4">
            {empresas.length} {empresas.length === 1 ? "empresa disponible" : "empresas disponibles"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {empresas.map((empresa, i) => {
              const carritoEmpresa = carritosPorEmpresa[empresa.id];
              const itemsEnCarrito = carritoEmpresa?.items.reduce((a, it) => a + it.cantidad, 0) ?? 0;

              return (
                <Card
                  key={empresa.id}
                  variant="elevated"
                  className="space-y-5 group cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` } as React.CSSProperties}
                >
                  <div className="h-44 rounded-xl overflow-hidden bg-brand-neutral-100 relative">
                    {empresa.foto?.foto ? (
                      <img src={empresa.foto.foto} alt={empresa.nombre_mercancia}
                        loading="lazy" decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <ImagePlaceholder nombre={empresa.nombre_mercancia} />
                    )}
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-brand-neutral-900/70 backdrop-blur-sm text-xs font-mono text-brand-neutral-300 border border-white/10">
                      {empresa.OrgVentaId}
                    </span>
                    {/* Badge de items en carrito sobre la imagen */}
                    {itemsEnCarrito > 0 && (
                      <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-primary-500/90 backdrop-blur-sm text-xs font-semibold text-white">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272" />
                        </svg>
                        {itemsEnCarrito} en carrito
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-brand-neutral-900 group-hover:text-brand-primary-700 transition-colors">
                      {empresa.nombre_mercancia}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-400" />
                      <p className="text-xs text-brand-neutral-500 font-medium">Catálogo disponible</p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => navigate(`/catalogo/${empresa.id}`)}
                  >
                    Ver Catálogo
                  </Button>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}