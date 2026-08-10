import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import TricolorSpinner from "./TricolorSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative px-6 py-3.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-br from-brand-primary-300 via-brand-primary-500 to-brand-primary-700 text-brand-neutral-900 hover:from-brand-primary-200 hover:via-brand-primary-400 hover:to-brand-primary-600 active:scale-[0.98] shadow-lg shadow-brand-primary-600/35 hover:shadow-xl hover:shadow-brand-primary-500/45",
    secondary:
      "bg-brand-neutral-100 text-brand-neutral-900 hover:bg-brand-neutral-200 active:scale-[0.98]",
    ghost:
      "bg-transparent text-brand-neutral-700 hover:bg-brand-neutral-100 active:scale-[0.98]",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <TricolorSpinner size={18} />
          <span>Cargando...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">{children}</span>
      )}
    </button>
  );
}