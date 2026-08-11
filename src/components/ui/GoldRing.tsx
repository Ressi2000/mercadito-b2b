interface GoldRingProps {
  className?: string;
}

/**
 * Anillo dorado en degradé, como capa separada (no como border-color).
 * background-clip: border-box pintaría el degradé en TODO el elemento
 * (interior incluido), tapando lo que haya detrás — por eso se recorta
 * con mask-composite para que sea una forma hueca de verdad, y se coloca
 * como overlay encima del contenido en vez de detrás.
 */
export default function GoldRing({ className }: GoldRingProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 rounded-2xl pointer-events-none ${className ?? ""}`}
      style={{
        padding: 2,
        background: "linear-gradient(135deg, #f4d78e, #d4a72c 55%, #a5791a)",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  );
}
