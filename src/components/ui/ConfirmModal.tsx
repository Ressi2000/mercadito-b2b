// src/components/ui/ConfirmModal.tsx
import { useEffect } from "react";
import Button from "./Button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isLoading = false,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Cerrar con Escape — comportamiento esperado de cualquier modal.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isLoading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="absolute inset-0 bg-brand-neutral-900/60 backdrop-blur-sm"
        onClick={() => !isLoading && onCancel()}
      />

      <div
        className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden animate-slide-up"
        style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}
      >
        <div className="px-6 pt-7 pb-6 text-center">
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 ${
              variant === "danger" ? "bg-red-100" : "bg-brand-primary-100"
            }`}
          >
            <svg
              className={`w-6 h-6 ${variant === "danger" ? "text-red-600" : "text-brand-primary-600"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <h2 id="confirm-modal-title" className="text-lg font-display font-bold text-brand-neutral-900">
            {title}
          </h2>
          <p className="text-sm text-brand-neutral-500 mt-2 leading-relaxed">{message}</p>
        </div>

        <div className="px-6 pb-6 flex items-center gap-3">
          <Button
            variant="secondary"
            className="flex-1 !py-2.5"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            className="flex-1 !py-2.5"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
