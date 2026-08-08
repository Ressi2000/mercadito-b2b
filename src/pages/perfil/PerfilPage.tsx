// src/pages/perfil/PerfilPage.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import TricolorEdge from "../../components/ui/TricolorEdge";
import {
  getPerfil,
  cambiarPassword,
  type PerfilData,
  type CambiarPasswordPayload,
} from "../../services/perfilService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

// ── Skeleton ─────────────────────────────────────────────────────────
function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-brand-neutral-200 rounded-lg ${className}`} />
  );
}

function PerfilSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 space-y-4">
        <SkeletonBlock className="h-5 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-5 w-48" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Campo de sólo lectura ─────────────────────────────────────────────
function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-brand-neutral-400 uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {icon && <span className="text-brand-primary-500 shrink-0">{icon}</span>}
        <p className="text-sm font-medium text-brand-neutral-800 break-words">
          {value || <span className="text-brand-neutral-300 italic">Sin información</span>}
        </p>
      </div>
    </div>
  );
}

// ── Sección con título ────────────────────────────────────────────────
function Section({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header de sección */}
      <div className="px-6 py-4 border-b border-brand-neutral-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-primary-500/10 border border-brand-primary-500/20 flex items-center justify-center text-brand-primary-500">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-display font-bold text-brand-neutral-900">{title}</h2>
          {subtitle && (
            <p className="text-xs text-brand-neutral-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Alerta de feedback ────────────────────────────────────────────────
function Alert({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-700",
  };
  const icons = {
    success: (
      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border text-sm animate-slide-up ${styles[type]}`}
    >
      <span className="mt-0.5 shrink-0">{icons[type]}</span>
      <p className="flex-1">{message}</p>
      <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────
export default function PerfilPage() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  // Estado del formulario de contraseña
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwFeedback, setPwFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CambiarPasswordPayload>();

  const passwordNuevo = watch("password_nuevo");

  // Carga inicial del perfil
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getPerfil();
        setPerfil(data);
      } catch (err: any) {
        setErrorCarga(err.message ?? "No se pudo cargar la información del perfil");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  // Envío del formulario de contraseña
  const onSubmitPassword = async (data: CambiarPasswordPayload) => {
    setPwLoading(true);
    setPwFeedback(null);
    try {
      const msg = await cambiarPassword(data);
      setPwFeedback({ type: "success", message: msg || "Contraseña actualizada exitosamente." });
      reset();
      setShowPasswordForm(false);
    } catch (err: any) {
      setPwFeedback({ type: "error", message: err.message ?? "Error al cambiar contraseña." });
    } finally {
      setPwLoading(false);
    }
  };

  const cancelarCambio = () => {
    setShowPasswordForm(false);
    reset();
    setPwFeedback(null);
  };

  // ── Icono de ojo ──
  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );

  // ── Estado de carga ──
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="space-y-1">
          <div className="h-7 bg-brand-neutral-200 rounded-lg w-48 animate-pulse" />
          <div className="h-4 bg-brand-neutral-100 rounded w-72 animate-pulse mt-2" />
        </div>
        <PerfilSkeleton />
      </div>
    );
  }

  // ── Estado de error de carga ──
  if (errorCarga) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-red-700">{errorCarga}</p>
        </div>
      </div>
    );
  }

  const cliente = perfil?.cliente;
  const contactos = perfil?.contactos ?? [];
  const creditos = perfil?.creditos ?? [];
  const inicial = user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

      {/* ── Encabezado de página ── */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-brand-neutral-900">Mi Perfil</h1>
        <p className="text-sm text-brand-neutral-500 mt-1">
          Consulta tu información de cliente y gestiona el acceso al portal.
        </p>
      </div>

      {/* ── Hero: tarjeta de usuario ── */}
      <div className="relative bg-gradient-to-r from-brand-neutral-900 via-brand-neutral-800 to-brand-neutral-900 rounded-2xl overflow-hidden shadow-2xl">
        <TricolorEdge className="z-10" />
        {/* Decoraciones */}
        <div
          className="absolute -top-8 -left-8 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #f2a900, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-6 right-20 w-32 h-32 rounded-full opacity-15 blur-2xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #ffd24d, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative flex items-center gap-5 px-8 py-6">
          {/* Avatar grande */}
          <div className="shrink-0 relative">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary-500/20 border-2 border-brand-primary-500/40 text-brand-primary-300 flex items-center justify-center font-bold text-2xl">
              {inicial}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-primary-400 rounded-full border-2 border-brand-neutral-900" />
          </div>

          {/* Info básica */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-display font-bold text-white leading-tight truncate">
              {cliente?.razon_social_cliente ?? "—"}
            </h2>
            <p className="text-sm text-brand-primary-300 mt-0.5">{user?.email}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              {cliente?.codigo_cliente && (
                <span className="text-xs text-brand-neutral-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                  </svg>
                  Código: {cliente.codigo_cliente}
                </span>
              )}
              {cliente?.rif_cliente && (
                <span className="text-xs text-brand-neutral-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                  RIF: {cliente.rif_cliente}
                </span>
              )}
              {perfil?.usuario.last_login && (
                <span className="text-xs text-brand-neutral-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Último acceso:{" "}
                  {new Date(perfil.usuario.last_login).toLocaleDateString("es-VE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Badge estado */}
          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary-500/20 border border-brand-primary-500/30 text-brand-primary-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-400" />
              Activo
            </span>
          </div>
        </div>
      </div>

      {/* ── Información de la empresa cliente ── */}
      <Section
        title="Información de la Empresa"
        subtitle="Datos registrados en el sistema administrativo (solo lectura)"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <InfoField label="Razón Social" value={cliente?.razon_social_cliente} />
          <InfoField label="RIF" value={cliente?.rif_cliente} />
          <InfoField label="Teléfono" value={cliente?.telefono_cliente} />
          <InfoField label="País" value={cliente?.pais_cliente} />
          <InfoField label="Población / Ciudad" value={cliente?.poblacion_cliente} />
          <InfoField label="Distrito" value={cliente?.distrito_cliente} />
          <div className="sm:col-span-2">
            <InfoField label="Dirección" value={cliente?.direccion_cliente} />
          </div>
        </div>
      </Section>

      {/* ── Contactos ── */}
      {contactos.length > 0 && (
        <Section
          title="Contactos del Cliente"
          subtitle={`${contactos.length} contacto${contactos.length > 1 ? "s" : ""} registrado${contactos.length > 1 ? "s" : ""}`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        >
          <div className="space-y-4">
            {contactos.map((c, i) => (
              <div
                key={c.ContactoId ?? i}
                className="flex items-center gap-4 p-4 rounded-xl bg-brand-neutral-50 border border-brand-neutral-100"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-primary-100 border border-brand-primary-200 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-brand-primary-600">
                    {c.Nombres?.charAt(0)?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-neutral-800">{c.Nombres}</p>
                  {c.Telefono && (
                    <p className="text-xs text-brand-neutral-500 mt-0.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      {c.Telefono}
                    </p>
                  )}
                </div>
                {c.ContactoId && (
                  <span className="text-xs text-brand-neutral-300 shrink-0">#{c.ContactoId}</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Créditos por empresa ── */}
      {creditos.length > 0 && (
        <Section
          title="Líneas de Crédito"
          subtitle="Crédito disponible por empresa"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          }
        >
          <div className="space-y-4">
            {creditos.map((cr, i) => {
              const usado = cr.TotalCred ?? 0;
              const limite = cr.LimiteCred ?? 0;
              const porcentaje = limite > 0 ? Math.min((usado / limite) * 100, 100) : 0;
              const colorBarra =
                porcentaje > 85
                  ? "bg-red-400"
                  : porcentaje > 60
                  ? "bg-amber-400"
                  : "bg-brand-primary-400";

              return (
                <div
                  key={cr.mercancia_id ?? i}
                  className="p-4 rounded-xl bg-brand-neutral-50 border border-brand-neutral-100 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-brand-neutral-800">
                      {cr.nombre_mercancia ?? `Empresa #${cr.mercancia_id}`}
                    </p>
                    <span className="text-xs font-semibold text-brand-neutral-500 shrink-0">
                      {cr.MonultPago}
                    </span>
                  </div>

                  {/* Barra de uso de crédito */}
                  <div>
                    <div className="flex justify-between text-xs text-brand-neutral-500 mb-1.5">
                      <span>Crédito utilizado</span>
                      <span className="font-semibold">
                        {porcentaje.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-brand-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${colorBarra}`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-brand-neutral-400">Límite</p>
                      <p className="text-sm font-semibold text-brand-neutral-700">
                        {limite.toLocaleString("es-VE", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-neutral-400">Utilizado</p>
                      <p className="text-sm font-semibold text-brand-neutral-700">
                        {usado.toLocaleString("es-VE", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    {cr.ImpultPago != null && (
                      <div>
                        <p className="text-xs text-brand-neutral-400">Últ. Pago</p>
                        <p className="text-sm font-semibold text-brand-neutral-700">
                          {cr.ImpultPago.toLocaleString("es-VE", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {cr.FecultPago && (
                    <p className="text-xs text-brand-neutral-400">
                      Último pago:{" "}
                      <span className="font-medium text-brand-neutral-600">
                        {new Date(cr.FecultPago).toLocaleDateString("es-VE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── Acceso al Portal (cambio de contraseña) ── */}
      <Section
        title="Acceso al Portal"
        subtitle="Gestiona las credenciales de tu cuenta web"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        }
      >
        <div className="space-y-4">
          {/* Email — solo lectura, cambia el admin */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-neutral-50 border border-brand-neutral-100">
            <div className="w-9 h-9 rounded-xl bg-brand-neutral-200 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-brand-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-brand-neutral-400 uppercase tracking-widest">
                Correo de acceso
              </p>
              <p className="text-sm font-medium text-brand-neutral-800 mt-0.5">{user?.email}</p>
            </div>
            <span className="shrink-0 text-xs text-brand-neutral-400 bg-brand-neutral-100 border border-brand-neutral-200 px-2.5 py-1 rounded-full">
              Administrado por el sistema
            </span>
          </div>

          {/* Feedback del cambio de contraseña */}
          {pwFeedback && (
            <Alert
              type={pwFeedback.type}
              message={pwFeedback.message}
              onClose={() => setPwFeedback(null)}
            />
          )}

          {/* Formulario de cambio de contraseña */}
          {!showPasswordForm ? (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-neutral-50 border border-brand-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-brand-neutral-200 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-brand-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-brand-neutral-400 uppercase tracking-widest">Contraseña</p>
                <p className="text-sm font-medium text-brand-neutral-800 mt-0.5">••••••••</p>
              </div>
              <Button
                variant="secondary"
                className="shrink-0 text-sm !py-2 !px-4"
                onClick={() => setShowPasswordForm(true)}
              >
                Cambiar
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmitPassword)}
              className="p-5 rounded-xl border border-brand-primary-200 bg-brand-primary-50/30 space-y-4"
            >
              <p className="text-sm font-semibold text-brand-neutral-700">
                Cambiar contraseña
              </p>

              {/* Contraseña actual */}
              <div className="relative">
                <Input
                  id="password_actual"
                  label="Contraseña actual"
                  type={showCurrentPw ? "text" : "password"}
                  placeholder="Tu contraseña actual"
                  error={errors.password_actual?.message}
                  {...register("password_actual", {
                    required: "La contraseña actual es requerida",
                  })}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw((v) => !v)}
                      className="text-brand-neutral-400 hover:text-brand-neutral-600 transition-colors"
                    >
                      <EyeIcon open={showCurrentPw} />
                    </button>
                  }
                />
              </div>

              {/* Nueva contraseña */}
              <div className="relative">
                <Input
                  id="password_nuevo"
                  label="Nueva contraseña"
                  type={showNewPw ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  error={errors.password_nuevo?.message}
                  {...register("password_nuevo", {
                    required: "La nueva contraseña es requerida",
                    minLength: {
                      value: 8,
                      message: "Debe tener al menos 8 caracteres",
                    },
                  })}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowNewPw((v) => !v)}
                      className="text-brand-neutral-400 hover:text-brand-neutral-600 transition-colors"
                    >
                      <EyeIcon open={showNewPw} />
                    </button>
                  }
                />
              </div>

              {/* Confirmar nueva contraseña */}
              <div className="relative">
                <Input
                  id="password_nuevo_confirmation"
                  label="Confirmar nueva contraseña"
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Repite la nueva contraseña"
                  error={errors.password_nuevo_confirmation?.message}
                  {...register("password_nuevo_confirmation", {
                    required: "Confirma la nueva contraseña",
                    validate: (val) =>
                      val === passwordNuevo || "Las contraseñas no coinciden",
                  })}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw((v) => !v)}
                      className="text-brand-neutral-400 hover:text-brand-neutral-600 transition-colors"
                    >
                      <EyeIcon open={showConfirmPw} />
                    </button>
                  }
                />
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={pwLoading}
                  className="text-sm !py-2.5"
                >
                  Guardar contraseña
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={cancelarCambio}
                  disabled={pwLoading}
                  className="text-sm !py-2.5"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </div>
      </Section>

      {/* Nota de solo lectura */}
      <p className="text-xs text-brand-neutral-400 text-center pb-4">
        La información de empresa es administrada por el sistema. Para cambios, contacta a tu ejecutivo de cuenta.
      </p>
    </div>
  );
}
