interface ErrorIllustrationProps {
  size?: number;
  className?: string;
}

/**
 * Ilustración para estados de error genérico (RouteErrorBoundary, fallos de
 * red, etc.). Vector a mano en la paleta de marca — no depende de assets
 * externos (Lottie no se pudo traer: los CDNs están bloqueados en este
 * entorno). Reemplazar por Lottie/ilustración encargada es tan simple como
 * cambiar este componente.
 */
export default function ErrorIllustration({ size = 160, className }: ErrorIllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Halo dorado de fondo */}
      <circle cx="100" cy="102" r="86" fill="#fff3c4" opacity="0.55" />
      <circle cx="100" cy="102" r="66" fill="#ffe588" opacity="0.55" />

      {/* Partículas flotantes */}
      <circle className="animate-float" cx="42" cy="55" r="4" fill="#ffbe0b" style={{ animationDelay: "0.3s" }} />
      <circle className="animate-float" cx="160" cy="70" r="5" fill="#f2a900" style={{ animationDelay: "1.1s" }} />
      <circle className="animate-float" cx="150" cy="150" r="3.5" fill="#ce2b37" opacity="0.7" style={{ animationDelay: "0.7s" }} />

      {/* Tarjeta/pantalla inclinada */}
      <g transform="rotate(-6 100 105)">
        <rect x="46" y="55" width="108" height="100" rx="14" fill="#123059" />
        <rect x="46" y="55" width="108" height="26" rx="14" fill="#0a1a35" />
        <circle cx="60" cy="68" r="3.5" fill="#ce2b37" />
        <circle cx="72" cy="68" r="3.5" fill="#ffbe0b" />
        <circle cx="84" cy="68" r="3.5" fill="#4d5876" />

        {/* Grieta */}
        <path
          d="M70 95 L92 108 L82 118 L108 136 L96 148 L128 150"
          stroke="#fff3c4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M70 95 L92 108 L82 118 L108 136 L96 148 L128 150"
          stroke="#ffbe0b"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Insignia de alerta */}
      <circle cx="140" cy="60" r="19" fill="#ce2b37" stroke="#fdecee" strokeWidth="3" />
      <rect x="137.5" y="50" width="5" height="14" rx="2.5" fill="#fdecee" />
      <circle cx="140" cy="69" r="2.6" fill="#fdecee" />
    </svg>
  );
}
