import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-brand-neutral-100"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-neutral-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            className={clsx(
              "w-full rounded-xl border bg-white/70 backdrop-blur-md",
              "px-4 py-3 text-sm transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error
                ? "border-red-400 focus:ring-red-400"
                : "border-brand-neutral-300",
              className
            )}
            aria-invalid={!!error}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-brand-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
