import { type TourismAreaMetric } from '../../types/area';

type SeoulMapMockProps = {
  areas: TourismAreaMetric[];
};

const levelClasses = {
  low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  moderate: 'bg-blue-100 text-blue-800 border-blue-200',
  high: 'bg-amber-100 text-amber-800 border-amber-200',
  critical: 'bg-rose-100 text-rose-800 border-rose-200',
};

export function SeoulMapMock({ areas }: SeoulMapMockProps) {
  return (
    <div className="grid min-h-[440px] grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      {areas.map((area) => (
        <div
          className={`flex flex-col justify-between rounded-2xl border p-4 ${levelClasses[area.crowdLevel]}`}
          key={area.id}
        >
          <div>
            <p className="text-sm font-black">{area.nameKo}</p>
            <p className="mt-1 text-xs font-bold opacity-75">{area.district}</p>
          </div>
          <div className="mt-6">
            <p className="text-2xl font-black">{area.riskScore}</p>
            <p className="text-xs font-bold opacity-75">risk_score · {area.crowdCount.toLocaleString('ko-KR')}명 집계</p>
          </div>
        </div>
      ))}
    </div>
  );
}
