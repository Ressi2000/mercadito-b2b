import { useRef, useState, useEffect, type ReactNode } from "react";

interface CarouselVerticalProps {
  children: ReactNode;
  className?: string;
  /** Alto máximo del carrusel — controla cuántos ítems se ven antes de scrollear. */
  maxHeight?: string;
}

const ChevronIcon = ({ direction }: { direction: "up" | "down" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d={direction === "up" ? "M4.5 15.75l7.5-7.5 7.5 7.5" : "M19.5 8.25l-7.5 7.5-7.5-7.5"} />
  </svg>
);

/** Versión vertical del Carousel — mismo patrón (flechas que aparecen según haya contenido para scrollear), pero apilado, para widgets angostos de sidebar. */
export default function CarouselVertical({ children, className, maxHeight = "20rem" }: CarouselVerticalProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const actualizarFlechas = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 4);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
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

  const desplazar = (direction: "up" | "down") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = el.clientHeight * 0.7 * (direction === "up" ? -1 : 1);
    el.scrollBy({ top: delta, behavior: "smooth" });
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      {canScrollUp && (
        <button
          onClick={() => desplazar("up")}
          aria-label="Anterior"
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-lg border border-brand-neutral-200 flex items-center justify-center text-brand-neutral-600 hover:text-brand-primary-600 hover:scale-105 transition-all duration-150"
        >
          <ChevronIcon direction="up" />
        </button>
      )}
      <div
        ref={trackRef}
        className="flex flex-col gap-2 overflow-y-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ maxHeight }}
      >
        {children}
      </div>
      {canScrollDown && (
        <button
          onClick={() => desplazar("down")}
          aria-label="Siguiente"
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-lg border border-brand-neutral-200 flex items-center justify-center text-brand-neutral-600 hover:text-brand-primary-600 hover:scale-105 transition-all duration-150"
        >
          <ChevronIcon direction="down" />
        </button>
      )}
    </div>
  );
}
