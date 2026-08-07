import Card from "../../../components/ui/Card";

interface ProximamenteWidgetProps {
  label: string;
  icon: React.ReactNode;
  fase: string;
}

export default function ProximamenteWidget({ label, icon, fase }: ProximamenteWidgetProps) {
  return (
    <Card variant="default" className="flex items-start gap-4 opacity-70">
      <div className="w-11 h-11 rounded-xl bg-brand-neutral-100 flex items-center justify-center text-brand-neutral-400 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-brand-neutral-400 uppercase tracking-wide truncate">{label}</p>
        <p className="text-sm font-medium text-brand-neutral-500 mt-1">Próximamente</p>
        <p className="text-[11px] text-brand-neutral-400 mt-0.5">Disponible en {fase}</p>
      </div>
    </Card>
  );
}
