import { type LucideIcon } from 'lucide-react';
import { Card } from './Card';

type MetricCardProps = {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  tone?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
};

const toneClasses = {
  blue: 'bg-blue-50 text-blue-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
  slate: 'bg-slate-100 text-slate-700',
};

export function MetricCard({ label, value, trend, icon: Icon, tone = 'blue' }: MetricCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-normal text-slate-950">{value}</p>
          <p className="mt-1 text-xs font-bold text-slate-500">{trend}</p>
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClasses[tone]}`}>
          <Icon aria-hidden="true" size={20} />
        </div>
      </div>
    </Card>
  );
}
