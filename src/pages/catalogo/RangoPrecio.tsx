// src/pages/catalogo/RangoPrecio.tsx
import { useState } from "react";

interface RangoPrecioProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  moneda?: string;
}

export default function RangoPrecio({ min, max, valueMin, valueMax, onChange, moneda = "USD" }: RangoPrecioProps) {
  const [activo, setActivo] = useState<"min" | "max" | null>(null);
  const rango = max - min;
  const step = rango > 0 ? Math.max(rango / 100, 0.01) : 1;

  const percentMin = rango > 0 ? ((valueMin - min) / rango) * 100 : 0;
  const percentMax = rango > 0 ? ((valueMax - min) / rango) * 100 : 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevo = Math.min(Number(e.target.value), valueMax - step);
    onChange(Math.max(min, nuevo), valueMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevo = Math.max(Number(e.target.value), valueMin + step);
    onChange(valueMin, Math.min(max, nuevo));
  };

  const disabled = rango <= 0;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs font-medium text-brand-neutral-600 tabular-nums">
        <span>{moneda} {valueMin.toLocaleString("es-VE", { maximumFractionDigits: 2 })}</span>
        <span>{moneda} {valueMax.toLocaleString("es-VE", { maximumFractionDigits: 2 })}</span>
      </div>

      <div className="relative h-6 flex items-center">
        {/* Pista base */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-brand-neutral-200" />
        {/* Tramo activo */}
        <div
          className="absolute h-1.5 rounded-full bg-brand-primary-500"
          style={{ left: `${percentMin}%`, right: `${100 - percentMax}%` }}
        />

        <input
          type="range"
          aria-label="Precio mínimo"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={handleMinChange}
          onMouseDown={() => setActivo("min")}
          onTouchStart={() => setActivo("min")}
          disabled={disabled}
          style={{ zIndex: activo === "min" ? 3 : 2, touchAction: "none" }}
          className="range-thumb absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-none disabled:opacity-40"
        />
        <input
          type="range"
          aria-label="Precio máximo"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={handleMaxChange}
          onMouseDown={() => setActivo("max")}
          onTouchStart={() => setActivo("max")}
          disabled={disabled}
          style={{ zIndex: activo === "max" ? 3 : 2, touchAction: "none" }}
          className="range-thumb absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-none disabled:opacity-40"
        />
      </div>
    </div>
  );
}
