import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-brand-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full px-4 py-3.5 rounded-xl border transition-all duration-200",
            "bg-white/50 backdrop-blur-sm",
            "text-brand-slate-900 placeholder:text-brand-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-brand-teal-500/50 focus:border-brand-teal-500",
            "hover:border-brand-slate-400",
            error
              ? "border-red-300 focus:ring-red-500/50 focus:border-red-500"
              : "border-brand-slate-200",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 animate-slide-up">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;