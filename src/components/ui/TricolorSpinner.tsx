interface TricolorSpinnerProps {
  size?: number;
  thickness?: number;
  className?: string;
}

/**
 * Anillo de carga en los colores de la bandera italiana (verde/blanco/rojo).
 * Conic-gradient enmascarado a anillo — sin SVG ni imágenes.
 */
export default function TricolorSpinner({
  size = 24,
  thickness,
  className,
}: TricolorSpinnerProps) {
  const ringThickness = thickness ?? Math.max(2, Math.round(size * 0.14));

  return (
    <span
      role="status"
      aria-label="Cargando"
      className={className}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "9999px",
        background:
          "conic-gradient(from 0deg, #009246 0deg 120deg, #f2f2f2 120deg 240deg, #ce2b37 240deg 360deg)",
        WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), #000 calc(100% - ${ringThickness}px))`,
        mask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), #000 calc(100% - ${ringThickness}px))`,
        animation: "spin 0.85s linear infinite",
      }}
    />
  );
}
