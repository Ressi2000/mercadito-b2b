// src/components/ui/TricolorEdge.tsx

interface TricolorEdgeProps {
  className?: string;
}

/** Franja tricolor italiana — guiño a la cinta "Qualità e tradizione" del empaque Sindoni. */
export default function TricolorEdge({ className = "" }: TricolorEdgeProps) {
  return (
    <div className={`absolute top-0 left-0 right-0 h-[3px] flex overflow-hidden ${className}`}>
      <span className="flex-1" style={{ background: "#009246" }} />
      <span className="flex-1" style={{ background: "#f2f2f2" }} />
      <span className="flex-1" style={{ background: "#ce2b37" }} />
    </div>
  );
}
