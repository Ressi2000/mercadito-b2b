import { useMemo } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  /** ms entre la entrada de cada letra. */
  stagger?: number;
  /** ms de espera antes de la primera letra. */
  delay?: number;
}

/**
 * Revela el texto letra por letra al montar (desliza hacia arriba + fade,
 * con stagger) — inspirado en reactbits.dev/text-animations/split-text,
 * pero en CSS puro para no sumar una librería de animación nueva al bundle.
 */
export default function SplitText({ text, className, stagger = 45, delay = 350 }: SplitTextProps) {
  const chars = useMemo(() => Array.from(text), [text]);

  return (
    <span className={className} aria-label={text}>
      {chars.map((ch, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.15em] -mb-[0.15em]">
          <span
            className="inline-block animate-split-word"
            style={{ animationDelay: `${delay + i * stagger}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
