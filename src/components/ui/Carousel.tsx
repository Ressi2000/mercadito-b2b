import { useRef, useState, useEffect, type ReactNode } from "react";

interface CarouselProps {
  children: ReactNode;
  className?: string;
}

const ChevronIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d={direction === "left" ? "M15.75 19.5L8.25 12l7.5-7.5" : "M8.25 4.5l7.5 7.5-7.5 7.5"}
    />
  </svg>
);

/** Fila horizontal con scroll y flechas — para carruseles de productos. */
export default function Carousel({ children, className }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const actualizarFlechas = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    actualizarFlechas();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", actualizarFlechas, { passive: true });
    const observer = new ResizeObserver(actualizarFlechas);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", actualizarFlechas);
      observer.disconnect();
    };
  }, [children]);

  const desplazar = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.85 * (direction === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className={`relative group/carousel ${className ?? ""}`}>
      {canScrollLeft && (
        <button
          onClick={() => desplazar("left")}
          aria-label="Anterior"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-brand-neutral-200 flex items-center justify-center text-brand-neutral-600 hover:text-brand-primary-600 hover:scale-105 transition-all duration-150"
        >
          <ChevronIcon direction="left" />
        </button>
      )}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => desplazar("right")}
          aria-label="Siguiente"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-brand-neutral-200 flex items-center justify-center text-brand-neutral-600 hover:text-brand-primary-600 hover:scale-105 transition-all duration-150"
        >
          <ChevronIcon direction="right" />
        </button>
      )}
    </div>
  );
}
