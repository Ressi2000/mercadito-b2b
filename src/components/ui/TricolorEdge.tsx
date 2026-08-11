// src/components/ui/TricolorEdge.tsx

interface TricolorEdgeProps {
  className?: string;
}

/** Franja tricolor italiana — guiño a la cinta "Qualità e tradizione" del empaque Sindoni. */
export default function TricolorEdge({ className = "" }: TricolorEdgeProps) {
  return (
    <div
      className={`absolute top-0 left-0 right-0 h-[4px] flex overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.2)] ${className}`}
    >
      <span className="flex-1" style={{ background: "linear-gradient(180deg, #00b25a, #007a3d)" }} />
      <span className="flex-1" style={{ background: "linear-gradient(180deg, #ffffff, #e6e1d3)" }} />
      <span className="flex-1" style={{ background: "linear-gradient(180deg, #e0323e, #a91f29)" }} />
    </div>
  );
}
