import { useMemo } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  /** ms entre la entrada de cada palabra. */
  stagger?: number;
  /** ms de espera antes de la primera palabra. */
  delay?: number;
}

/**
 * Revela el texto palabra por palabra al montar (desliza hacia arriba +
 * fade, con stagger) — inspirado en reactbits.dev/text-animations/split-text,
 * pero en CSS puro para no sumar una librería de animación nueva al bundle.
 */
export default function SplitText({ text, className, stagger = 60, delay = 0 }: SplitTextProps) {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
          <span
            className="inline-block animate-split-word"
            style={{ animationDelay: `${delay + i * stagger}ms` }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
