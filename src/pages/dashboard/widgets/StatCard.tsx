import Card from "../../../components/ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function StatCard({ label, value, hint, icon, onClick }: StatCardProps) {
  return (
    <Card
      variant="default"
      className={`flex items-start gap-4 ${onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300" : ""}`}
    >
      <div onClick={onClick} className="flex items-start gap-4 w-full">
        <div className="w-11 h-11 rounded-xl bg-brand-primary-50 border border-brand-primary-100 flex items-center justify-center text-brand-primary-600 shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-neutral-500 uppercase tracking-wide truncate">{label}</p>
          <p className="text-2xl font-bold text-brand-neutral-900 tabular-nums mt-0.5 truncate">{value}</p>
          {hint && <p className="text-xs text-brand-neutral-400 mt-0.5 truncate">{hint}</p>}
        </div>
      </div>
    </Card>
  );
}
