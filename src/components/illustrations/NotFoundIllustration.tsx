interface NotFoundIllustrationProps {
  size?: number;
  className?: string;
}

/**
 * Ilustración para la página 404 — un cartel de ruta torcido con el camino
 * cortado, jugando con el nombre del producto ("GesRutas"). Vector a mano,
 * mismos motivos que ErrorIllustration.tsx.
 */
export default function NotFoundIllustration({ size = 180, className }: NotFoundIllustrationProps) {
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
      <circle cx="100" cy="100" r="86" fill="#fff3c4" opacity="0.55" />
      <circle cx="100" cy="100" r="66" fill="#ffe588" opacity="0.55" />

      {/* Camino punteado que se corta */}
      <g stroke="#c7cee0" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 16">
        <path d="M20 168 C 60 168, 70 150, 96 150" fill="none" />
      </g>
      <circle cx="20" cy="168" r="5" fill="#9aa6c2" />
      <circle cx="100" cy="149" r="4.5" fill="#ce2b37" />

      {/* Partículas flotantes */}
      <circle className="animate-float" cx="152" cy="48" r="4" fill="#ffbe0b" style={{ animationDelay: "0.4s" }} />
      <circle className="animate-float" cx="44" cy="60" r="3" fill="#ce2b37" opacity="0.7" style={{ animationDelay: "1s" }} />

      {/* Poste */}
      <rect x="112" y="70" width="8" height="98" rx="4" fill="#334066" transform="rotate(-4 116 70)" />
      <circle cx="116" cy="68" r="7" fill="#f2a900" transform="rotate(-4 116 70)" />

      {/* Cartel torcido */}
      <g transform="rotate(-10 128 92)">
        <rect x="80" y="72" width="96" height="40" rx="8" fill="#123059" />
        <rect x="80" y="72" width="96" height="40" rx="8" fill="none" stroke="#f2a900" strokeWidth="2.5" />
        <text
          x="128"
          y="100"
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="#ffe588"
          fontFamily="'Bricolage Grotesque', system-ui, sans-serif"
        >
          404
        </text>
      </g>
    </svg>
  );
}
