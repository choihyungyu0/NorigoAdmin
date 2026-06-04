import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Bookmark,
  Building2,
  CalendarPlus,
  Camera,
  CheckCircle2,
  Coffee,
  Database,
  Edit3,
  Eye,
  FilePlus2,
  Landmark,
  LineChart as LineChartIcon,
  MapPin,
  MousePointer2,
  Percent,
  RefreshCcw,
  ShieldCheck,
  SlidersHorizontal,
  Timer,
  UsersRound,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { discoverPerformanceInitialData, getDiscoverPerformanceDashboard } from '../../services/discoverApi';
import {
  type DiscoverCategoryInterest,
  type DiscoverFunnelStep,
  type DiscoverHiddenSpot,
  type DiscoverIconKey,
  type DiscoverInsight,
  type DiscoverMetric,
  type DiscoverOriginFlow,
  type DiscoverStatusItem,
  type DiscoverTone,
  type DiscoverTrendTone,
} from '../../types/discover';

const toneTextClasses: Record<DiscoverTone, string> = {
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  amber: 'text-orange-500',
  rose: 'text-red-500',
  purple: 'text-violet-600',
  cyan: 'text-cyan-600',
  slate: 'text-slate-500',
};

const toneBorderClasses: Record<DiscoverTone, string> = {
  blue: 'border-blue-200 bg-blue-50 text-blue-600',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  amber: 'border-orange-200 bg-orange-50 text-orange-500',
  rose: 'border-red-200 bg-red-50 text-red-500',
  purple: 'border-violet-200 bg-violet-50 text-violet-600',
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-600',
  slate: 'border-slate-200 bg-slate-100 text-slate-500',
};

const toneSolidClasses: Record<DiscoverTone, string> = {
  blue: 'bg-blue-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  amber: 'bg-orange-500 text-white',
  rose: 'bg-red-500 text-white',
  purple: 'bg-violet-600 text-white',
  cyan: 'bg-cyan-600 text-white',
  slate: 'bg-slate-500 text-white',
};

const funnelFillClasses: Record<DiscoverTone, string> = {
  blue: 'from-blue-100 to-blue-50',
  emerald: 'from-emerald-100 to-emerald-50',
  amber: 'from-orange-100 to-orange-50',
  rose: 'from-red-100 to-red-50',
  purple: 'from-violet-100 to-violet-50',
  cyan: 'from-cyan-100 to-cyan-50',
  slate: 'from-slate-200 to-slate-100',
};

const trendTextClasses: Record<DiscoverTrendTone, string> = {
  success: 'text-emerald-600',
  danger: 'text-red-600',
  neutral: 'text-slate-500',
};

const iconMap: Record<DiscoverIconKey, LucideIcon> = {
  eye: Eye,
  cursor: MousePointer2,
  percent: Percent,
  bookmark: Bookmark,
  pin: MapPin,
  calendar: CalendarPlus,
  retrip: RefreshCcw,
  growth: LineChartIcon,
  check: CheckCircle2,
  refresh: RefreshCcw,
  database: Database,
  shield: ShieldCheck,
  cafe: Coffee,
  culture: Landmark,
  food: Utensils,
  camera: Camera,
  indoor: Building2,
  crowd: UsersRound,
  warning: Timer,
  clock: Timer,
  edit: Edit3,
  file: FilePlus2,
};

const chartLegend = [
  { key: 'cardClicks', label: '카드 클릭 수', color: '#2563eb' },
  { key: 'saves', label: '저장 수', color: '#0891b2' },
  { key: 'scheduleAdds', label: '일정 추가 수', color: '#f97316' },
  { key: 'routeClicks', label: '길찾기 클릭 수', color: '#7c3aed' },
] as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function InfoDot() {
  return (
    <span className="grid h-[18px] w-[18px] place-items-center rounded-full border border-slate-400 text-[11px] font-black leading-none text-slate-500">
      i
    </span>
  );
}

function IconByKey({
  iconKey,
  tone,
  className,
  size = 24,
}: {
  iconKey: DiscoverIconKey;
  tone: DiscoverTone;
  className?: string;
  size?: number;
}) {
  const Icon = iconMap[iconKey];

  return <Icon aria-hidden="true" className={cn(toneTextClasses[tone], className)} size={size} strokeWidth={2.4} />;
}

function PanelHeader({ title, actionLabel }: { title: string; actionLabel?: string }) {
  return (
    <div className="mb-3 flex h-6 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <h2 className="truncate font-admin-title text-[18px] leading-none text-slate-950">{title}</h2>
        <InfoDot />
      </div>
      {actionLabel ? (
        <button className="inline-flex items-center gap-1 text-sm font-black text-blue-600 hover:text-blue-700" type="button">
          {actionLabel}
          <span aria-hidden="true" className="text-xl leading-none">
            ›
          </span>
        </button>
      ) : null}
    </div>
  );
}

function StatusStrip({ items }: { items: DiscoverStatusItem[] }) {
  return (
    <section className="flex h-[44px] justify-end">
      <div className="grid w-full max-w-[965px] grid-cols-4 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm shadow-slate-200/60">
        {items.map((item, index) => (
          <div
            className={cn(
              'flex min-w-0 items-center justify-center gap-2.5 px-3 text-[13px] font-black text-slate-900',
              index > 0 && 'border-l border-slate-200',
            )}
            key={item.id}
          >
            <IconByKey className="shrink-0" iconKey={item.iconKey} size={18} tone={item.tone} />
            <span className="truncate">{item.label}</span>
            {item.value ? <span className="shrink-0 font-number">{item.value}</span> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ metric }: { metric: DiscoverMetric }) {
  return (
    <Card className="flex h-full min-h-[106px] items-center gap-2 px-3 py-3">
      <div className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-white">
        <IconByKey iconKey={metric.iconKey} size={37} tone={metric.tone} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-black leading-none text-slate-800">{metric.label}</p>
        <div className="mt-2 flex min-w-0 items-end gap-1">
          <strong className={cn('min-w-0 font-admin-metric text-[25px] leading-none tracking-normal', toneTextClasses[metric.tone])}>
            {metric.value}
          </strong>
          <span className="shrink-0 pb-0.5 text-[12px] font-black text-slate-700">{metric.unit}</span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
          {metric.previousLabel}
          <span className={cn('font-number text-[11px]', trendTextClasses[metric.trendTone])}>{metric.change}</span>
        </p>
      </div>
    </Card>
  );
}

function FunnelPanel({ steps }: { steps: DiscoverFunnelStep[] }) {
  return (
    <Card className="flex h-full min-h-0 flex-col p-4">
      <PanelHeader title="Discover 성과 퍼널" />
      <div className="grid grid-cols-[1fr_98px_82px_78px] border-b border-slate-200 px-3 pb-2.5 text-center text-[12px] font-black text-slate-600">
        <span>단계</span>
        <span>건수</span>
        <span>전환율</span>
        <span>이탈률</span>
      </div>
      <div className="flex-1 pt-2">
        {steps.map((step, index) => {
          const nextWidth = steps[index + 1]?.widthPercent ?? step.widthPercent * 0.82;
          const bottomInset = Math.max(6, ((step.widthPercent - nextWidth) / step.widthPercent / 2) * 100);

          return (
            <div
              className="grid min-h-[40px] grid-cols-[1fr_98px_82px_78px] items-center border-b border-slate-100 last:border-b-0"
              key={step.id}
            >
              <div className="relative flex h-full items-center overflow-hidden px-4">
                <div
                  className={cn('absolute inset-y-0 left-1/2 bg-gradient-to-r', funnelFillClasses[step.tone])}
                  style={{
                    clipPath: `polygon(0 0, 100% 0, ${100 - bottomInset}% 100%, ${bottomInset}% 100%)`,
                    transform: 'translateX(-50%)',
                    width: `${step.widthPercent}%`,
                  }}
                />
                <span
                  className={cn(
                    'relative z-10 mr-4 grid h-6 w-6 place-items-center rounded-full text-[13px] font-black',
                    toneSolidClasses[step.tone],
                  )}
                >
                  {step.rank}
                </span>
                <span className="relative z-10 truncate text-[15px] font-black text-slate-800">{step.label}</span>
              </div>
              <span className="text-right font-number text-[14px] text-slate-900">{step.count}</span>
              <span className="text-right font-number text-[12px] text-slate-600">{step.conversion}</span>
              <span className="text-right font-number text-[12px] text-slate-600">{step.dropoff}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function CategoryPanel({ categories }: { categories: DiscoverCategoryInterest[] }) {
  return (
    <Card className="flex h-full min-h-0 flex-col p-4">
      <PanelHeader actionLabel="전체 보기" title="카테고리별 관심도" />
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full table-fixed text-left">
          <thead className="bg-slate-50 text-[11px] font-black text-slate-600">
            <tr>
              <th className="w-[34%] px-3 py-2">카테고리</th>
              <th className="px-1 py-2 text-right">노출 수</th>
              <th className="px-1 py-2 text-right">클릭률</th>
              <th className="px-1 py-2 text-right">저장률</th>
              <th className="px-1 py-2 text-right">일정 추가율</th>
              <th className="px-2 py-2 text-right">전일 대비</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr className="border-t border-slate-100 text-[12px] font-bold text-slate-700" key={category.id}>
                <td className="px-3 py-1.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border', toneBorderClasses[category.tone])}>
                      <IconByKey iconKey={category.iconKey} size={14} tone={category.tone} />
                    </span>
                    <span className="truncate">{category.category}</span>
                  </div>
                </td>
                <td className="px-1 py-1.5 text-right font-number text-slate-900">{category.exposure}</td>
                <td className="px-1 py-1.5 text-right font-number">{category.clickRate}</td>
                <td className="px-1 py-1.5 text-right font-number">{category.saveRate}</td>
                <td className="px-1 py-1.5 text-right font-number">{category.scheduleRate}</td>
                <td className={cn('px-2 py-1.5 text-right font-number', trendTextClasses[category.changeTone])}>
                  {category.dailyChange}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function HiddenSpotsPanel({ spots }: { spots: DiscoverHiddenSpot[] }) {
  return (
    <Card className="flex h-full min-h-0 flex-col p-4">
      <PanelHeader actionLabel="전체 보기" title="TOP Hidden Spots" />
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full table-fixed text-left">
          <thead className="bg-slate-50 text-[11px] font-black text-slate-600">
            <tr>
              <th className="w-11 px-2 py-2">순위</th>
              <th className="w-[25%] px-2 py-2">장소</th>
              <th className="w-[17%] px-2 py-2">카테고리</th>
              <th className="w-[76px] px-1 py-2 text-center">현재 혼잡도</th>
              <th className="w-[54px] px-1 py-2 text-right">클릭 수</th>
              <th className="w-[54px] px-1 py-2 text-right">저장 수</th>
              <th className="w-[60px] px-1 py-2 text-right">일정 추가</th>
              <th className="w-[58px] px-2 py-2 text-center">성과 상태</th>
            </tr>
          </thead>
          <tbody>
            {spots.map((spot) => (
              <tr className="border-t border-slate-100 text-[12px] font-bold text-slate-700" key={spot.id}>
                <td className="px-2 py-1.5">
                  <span
                    className={cn(
                      'grid h-6 w-6 place-items-center rounded-full text-[12px] font-black text-white',
                      spot.rank === 1 && 'bg-red-600',
                      spot.rank === 2 && 'bg-red-500',
                      spot.rank === 3 && 'bg-orange-500',
                      spot.rank > 3 && 'bg-slate-500',
                    )}
                  >
                    {spot.rank}
                  </span>
                </td>
                <td className="truncate px-2 py-1.5 text-slate-900">{spot.place}</td>
                <td className="truncate px-2 py-1.5">{spot.category}</td>
                <td className="px-1 py-1.5 text-center">
                  <span
                    className={cn(
                      'inline-flex rounded-md px-2.5 py-1 text-[11px] font-black',
                      spot.currentCrowd === 'Low' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-600',
                    )}
                  >
                    {spot.currentCrowd}
                  </span>
                </td>
                <td className="px-1 py-1.5 text-right font-number text-slate-900">{spot.clicks}</td>
                <td className="px-1 py-1.5 text-right font-number">{spot.saves}</td>
                <td className="px-1 py-1.5 text-right font-number">{spot.schedules}</td>
                <td className="px-2 py-1.5 text-center">
                  <span
                    className={cn(
                      'inline-flex rounded-md px-2.5 py-1 text-[11px] font-black',
                      spot.statusTone === 'emerald' && 'bg-emerald-50 text-emerald-700',
                      spot.statusTone === 'blue' && 'bg-blue-50 text-blue-700',
                      spot.statusTone === 'purple' && 'bg-violet-50 text-violet-700',
                    )}
                  >
                    {spot.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function OriginFlowPanel({ flows }: { flows: DiscoverOriginFlow[] }) {
  return (
    <Card className="flex h-full min-h-0 flex-col p-4">
      <PanelHeader title="혼잡 지역 → Discover 유입 흐름" />
      <div className="flex flex-1 flex-col justify-between gap-3">
        {flows.map((flow) => (
          <div className="grid grid-cols-[136px_24px_1fr] items-center gap-3" key={flow.id}>
            <div className="flex h-[58px] items-center gap-2.5 rounded-lg border border-red-100 bg-red-50 px-3">
              <UsersRound aria-hidden="true" className="shrink-0 text-red-500" size={26} strokeWidth={2.5} />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[12px] font-black text-slate-800">{flow.origin}</p>
                {flow.originNote ? <p className="mt-1 text-[12px] font-black text-red-600">{flow.originNote}</p> : null}
              </div>
            </div>
            <ArrowRight aria-hidden="true" className="text-slate-400" size={22} />
            <div className="grid grid-cols-3 gap-2.5">
              {flow.destinations.map((destination) => (
                <div
                  className="flex h-[58px] flex-col justify-center rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-center"
                  key={destination.id}
                >
                  <span className="truncate text-[12px] font-black text-blue-700">{destination.place}</span>
                  <strong className="mt-1 font-number text-[19px] leading-none text-violet-700">{destination.share}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TimeResponsePanel({ timeSeries }: { timeSeries: Array<{ hour: string; cardClicks: number; saves: number; scheduleAdds: number; routeClicks: number }> }) {
  return (
    <Card className="flex h-full min-h-0 flex-col p-4">
      <PanelHeader title="시간대별 Discover 반응" />
      <div className="mb-2 flex items-center justify-center gap-6">
        {chartLegend.map((item) => (
          <span className="inline-flex items-center gap-2 text-[12px] font-black text-slate-700" key={item.key}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={timeSeries} margin={{ bottom: 0, left: -6, right: 18, top: 8 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="hour"
              interval={2}
              tick={{ fill: '#475569', fontSize: 13, fontWeight: 800 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, 1000]}
              tick={{ fill: '#475569', fontSize: 13, fontWeight: 800 }}
              tickCount={5}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                boxShadow: '0 10px 20px rgba(15, 23, 42, 0.12)',
                fontSize: 12,
                fontWeight: 800,
              }}
            />
            <Line dataKey="cardClicks" dot={{ r: 3 }} isAnimationActive={false} name="카드 클릭 수" stroke="#2563eb" strokeWidth={3} type="monotone" />
            <Line dataKey="saves" dot={{ r: 3 }} isAnimationActive={false} name="저장 수" stroke="#0891b2" strokeWidth={3} type="monotone" />
            <Line dataKey="scheduleAdds" dot={{ r: 3 }} isAnimationActive={false} name="일정 추가 수" stroke="#f97316" strokeWidth={3} type="monotone" />
            <Line dataKey="routeClicks" dot={{ r: 3 }} isAnimationActive={false} name="길찾기 클릭 수" stroke="#7c3aed" strokeWidth={3} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function ActionButton({ icon: Icon, label, primary = false }: { icon: LucideIcon; label: string; primary?: boolean }) {
  return (
    <button
      className={cn(
        'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border px-3 text-[13px] font-black transition',
        primary
          ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/30 hover:bg-blue-700'
          : 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50',
      )}
      type="button"
    >
      <Icon aria-hidden="true" size={20} strokeWidth={2.4} />
      <span className="truncate">{label}</span>
    </button>
  );
}

function InsightPanel({ insights }: { insights: DiscoverInsight[] }) {
  return (
    <Card className="flex h-full min-h-0 flex-col p-4">
      <PanelHeader title="추천 품질 인사이트" />
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-200">
        {insights.map((insight) => (
          <div className="flex min-h-[49px] items-center gap-3 border-b border-slate-100 px-4 py-1.5 last:border-b-0" key={insight.id}>
            <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full border', toneBorderClasses[insight.tone])}>
              <IconByKey iconKey={insight.iconKey} size={18} tone={insight.tone} />
            </span>
            <p className="min-w-0 text-[13px] font-black leading-snug text-slate-800">{insight.title}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2.5">
        <ActionButton icon={SlidersHorizontal} label="추천 가중치 조정" primary />
        <ActionButton icon={Edit3} label="장소 상세 보기" />
        <ActionButton icon={FilePlus2} label="리포트에 포함" />
      </div>
    </Card>
  );
}

export function DiscoverPerformancePage() {
  const { data } = useQuery({
    initialData: discoverPerformanceInitialData,
    queryFn: getDiscoverPerformanceDashboard,
    queryKey: ['discover-performance-dashboard'],
  });

  return (
    <div
      className="grid min-h-0 gap-3 overflow-hidden"
      style={{
        gridTemplateRows: '44px 106px minmax(326px, 0.95fr) minmax(310px, 1fr)',
        height: 'calc(100vh - 100px)',
      }}
    >
      <StatusStrip items={data.statusItems} />
      <section className="grid h-[106px] shrink-0 grid-cols-8 gap-3">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>
      <section className="grid min-h-0 grid-cols-[1.05fr_1fr_1.27fr] gap-3">
        <FunnelPanel steps={data.funnelSteps} />
        <CategoryPanel categories={data.categories} />
        <HiddenSpotsPanel spots={data.hiddenSpots} />
      </section>
      <section className="grid min-h-0 grid-cols-[1fr_1.15fr_1.05fr] gap-3">
        <OriginFlowPanel flows={data.originFlows} />
        <TimeResponsePanel timeSeries={data.timeSeries} />
        <InsightPanel insights={data.insights} />
      </section>
    </div>
  );
}
