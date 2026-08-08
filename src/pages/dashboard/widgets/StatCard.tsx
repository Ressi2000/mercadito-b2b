import Card from "../../../components/ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  featured?: boolean;
}

export default function StatCard({ label, value, hint, icon, onClick, featured = false }: StatCardProps) {
  return (
    <Card
      variant="default"
      className={`relative overflow-hidden flex items-start gap-4 ${onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300" : ""}`}
    >
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary-300 via-brand-primary-500 to-brand-primary-700" />
      )}
      <div onClick={onClick} className="flex items-start gap-4 w-full">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            featured
              ? "bg-brand-neutral-900 text-brand-primary-300"
              : "bg-brand-neutral-100 text-brand-neutral-800"
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide truncate">{label}</p>
          <p className="text-2xl font-display font-extrabold text-brand-neutral-900 tabular-nums mt-0.5 truncate">{value}</p>
          {hint && <p className="text-xs text-brand-neutral-400 mt-0.5 truncate">{hint}</p>}
        </div>
      </div>
    </Card>
  );
}
