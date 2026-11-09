// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-brand-neutral-200/70 bg-white/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-neutral-400">
        <p>
          © {new Date().getFullYear()} Sindoni. Todos los derechos reservados.
        </p>
        <p className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-primary-400" />
          GesRutas iClient — Portal de pedidos empresariales
        </p>
      </div>
    </footer>
  );
}
