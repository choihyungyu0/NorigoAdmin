import { useQuery } from '@tanstack/react-query';
import { clsx, type ClassValue } from 'clsx';
import { type ReactNode } from 'react';
import {
  ArrowUp,
  Ban,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronRight,
  CircleHelp,
  Coffee,
  Info,
  Landmark,
  LineChart,
  MapPin,
  SlidersHorizontal,
  Star,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { twMerge } from 'tailwind-merge';
import alertIcon from '../../../asset/image-removebg-preview (5).png';
import rerouteIcon from '../../../asset/image-removebg-preview (6).png';
import switchIcon from '../../../asset/image-removebg-preview (7).png';
import crowdIcon from '../../../asset/image-removebg-preview (11).png';
import { getReTripMonitorSnapshot } from '../../services/retripApi';
import {
  type ReTripControlAction,
  type ReTripCrowdLevel,
  type ReTripFlowTarget,
  type ReTripInsight,
  type ReTripKpi,
  type ReTripPolicyAdjustment,
  type ReTripRecommendation,
  type ReTripRecommendationStatus,
} from '../../types/retrip';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const kpiToneClasses = {
  purple: { text: 'text-violet-600' },
  teal: { text: 'text-cyan-600' },
  blue: { text: 'text-blue-600' },
  green: { text: 'text-emerald-600' },
  amber: { text: 'text-orange-500' },
};

const targetToneClasses = {
  purple: { path: '#8b5cf6', fill: 'bg-violet-50 text-violet-600', value: 'text-violet-600', ribbon: 'rgba(139, 92, 246, 0.24)' },
  teal: { path: '#06b6d4', fill: 'bg-cyan-50 text-cyan-600', value: 'text-cyan-600', ribbon: 'rgba(6, 182, 212, 0.24)' },
  blue: { path: '#3b82f6', fill: 'bg-blue-50 text-blue-600', value: 'text-blue-600', ribbon: 'rgba(59, 130, 246, 0.22)' },
  slate: { path: '#94a3b8', fill: 'bg-slate-100 text-slate-500', value: 'text-slate-500', ribbon: 'rgba(148, 163, 184, 0.22)' },
};

const recommendationStatusLabels: Record<ReTripRecommendationStatus, string> = {
  recommendable: '추천 가능',
  caution: '주의',
  paused: '추천 중지',
};

const recommendationStatusClasses: Record<ReTripRecommendationStatus, string> = {
  recommendable: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  caution: 'border-amber-200 bg-amber-50 text-amber-700',
  paused: 'border-rose-200 bg-rose-50 text-rose-700',
};

const crowdClasses: Record<ReTripCrowdLevel, string> = {
  High: 'bg-rose-50 text-rose-600',
  Moderate: 'bg-orange-50 text-orange-600',
  Low: 'bg-emerald-50 text-emerald-600',
};

const kpiAssetIcons: Partial<Record<ReTripKpi['icon'], string>> = {
  reroute: rerouteIcon,
  switch: switchIcon,
  alert: alertIcon,
};

const kpiLucideIcons = {
  calendar: CalendarCheck,
  pin: MapPin,
  trend: LineChart,
};

const flowTargetIcons = {
  museum: Landmark,
  cafe: Coffee,
  book: BookOpen,
  calendar: CalendarDays,
};

const controlIcons = {
  sliders: SlidersHorizontal,
  exclude: Ban,
  calendar: CalendarPlus,
  star: Star,
};

const insightIcons = {
  trend: TrendingUp,
  check: Check,
  up: ArrowUp,
};

const insightToneClasses = {
  purple: 'bg-violet-600 text-white',
  green: 'bg-emerald-600 text-white',
  blue: 'bg-blue-600 text-white',
};

const policyToneClasses = {
  purple: 'bg-violet-600',
  teal: 'bg-cyan-600',
  blue: 'bg-blue-600',
};

function Panel({ children, className, padding = 'p-4' }: { children: ReactNode; className?: string; padding?: string }) {
  return (
    <section
      className={cn(
        'min-w-0 overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-sm shadow-slate-200/40',
        padding,
        className,
      )}
    >
      {children}
    </section>
  );
}

function PanelHeader({ title, action, dense = false }: { title: string; action?: ReactNode; dense?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between gap-3', dense ? 'mb-2' : 'mb-3')}>
      <div className="flex min-w-0 items-center gap-2">
        <h2 className={cn('truncate font-black text-slate-950', dense ? 'text-base' : 'text-lg')}>{title}</h2>
        <CircleHelp aria-hidden="true" className="shrink-0 text-slate-400" size={15} />
      </div>
      {action}
    </div>
  );
}

function KpiCard({ metric }: { metric: ReTripKpi }) {
  const tone = kpiToneClasses[metric.tone];
  const assetIcon = kpiAssetIcons[metric.icon];
  const LucideIcon = metric.icon in kpiLucideIcons ? kpiLucideIcons[metric.icon as keyof typeof kpiLucideIcons] : null;

  return (
    <section className="flex h-[156px] min-w-0 items-center rounded-[14px] border border-slate-200 bg-white px-4 shadow-sm shadow-slate-200/40">
      <div className="flex min-w-0 items-center gap-3">
      <div
        className={cn(
          'grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60',
          tone.text,
        )}
      >
        {assetIcon ? (
          <img alt="" className="h-11 w-11 object-contain" src={assetIcon} />
        ) : LucideIcon ? (
          <LucideIcon aria-hidden="true" size={34} strokeWidth={2.2} />
        ) : null}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-black text-slate-800">{metric.label}</p>
          <div className="mt-1 flex items-end gap-2">
            <p className={cn('text-[34px] font-black leading-none', tone.text)}>{metric.value}</p>
            <p className="pb-1 text-lg font-black text-slate-700">{metric.unit}</p>
          </div>
          <p className="mt-3 text-sm font-bold text-slate-700">
            전일 대비
            <span className={cn('ml-3 font-black', metric.deltaTone === 'good' ? 'text-emerald-600' : 'text-red-500')}>
              {metric.deltaLabel} {metric.deltaDirection === 'up' ? '▲' : '▼'}
            </span>
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">{metric.baseline}</p>
        </div>
      </div>
    </section>
  );
}

function FlowTargetNode({ target, index }: { target: ReTripFlowTarget; index: number }) {
  const Icon = flowTargetIcons[target.icon];
  const tone = targetToneClasses[target.tone];
  const topOffsets = ['top-[26px]', 'top-[112px]', 'top-[198px]', 'top-[284px]'];

  return (
    <div
      className={cn(
        'absolute right-0 z-10 flex h-[66px] w-[308px] items-center justify-between rounded-xl border border-slate-200 bg-white px-5 shadow-sm shadow-slate-200/60',
        topOffsets[index],
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full', tone.fill)}>
          <Icon aria-hidden="true" size={22} />
        </span>
        <p className="truncate text-sm font-black text-slate-800">{target.name}</p>
      </div>
      <p className={cn('shrink-0 text-xl font-black', tone.value)}>{target.value}%</p>
    </div>
  );
}

function FlowPanel({
  sourceArea,
  targets,
}: {
  sourceArea: { name: string; status: string; occurrences: number };
  targets: ReTripFlowTarget[];
}) {
  return (
    <Panel className="h-full" padding="p-4">
      <PanelHeader
        action={
          <button
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 shadow-sm"
            type="button"
          >
            <CalendarDays aria-hidden="true" size={15} />
            흐름 설명
          </button>
        }
        title="대체 이동 흐름"
      />

      <div className="relative h-[calc(100%-48px)] min-h-[360px] overflow-hidden rounded-xl bg-gradient-to-b from-white to-slate-50/70">
        <svg
          aria-hidden="true"
          className="absolute left-[162px] right-[292px] top-[40px] h-[318px] w-[calc(100%-454px)]"
          preserveAspectRatio="none"
          viewBox="0 0 440 318"
        >
          {targets.map((target, index) => {
            const startCenterY = 159;
            const sourceWidths = [18, 16, 15, 15];
            const targetWidths = [52, 46, 42, 41];
            const targetCenters = [52, 136, 222, 306];
            const sourceOffsets = [-16, -3, 10, 24];
            const sourceWidth = sourceWidths[index];
            const targetWidth = targetWidths[index];
            const sourceY = startCenterY + sourceOffsets[index];
            const targetY = targetCenters[index];
            const c1x = 150;
            const c2x = 235;
            const topStart = sourceY - sourceWidth / 2;
            const bottomStart = sourceY + sourceWidth / 2;
            const topEnd = targetY - targetWidth / 2;
            const bottomEnd = targetY + targetWidth / 2;

            return (
              <path
                d={[
                  `M 0 ${topStart}`,
                  `C ${c1x} ${topStart}, ${c2x} ${topEnd}, 440 ${topEnd}`,
                  `L 440 ${bottomEnd}`,
                  `C ${c2x} ${bottomEnd}, ${c1x} ${bottomStart}, 0 ${bottomStart}`,
                  'Z',
                ].join(' ')}
                fill={targetToneClasses[target.tone].ribbon}
                key={target.id}
              />
            );
          })}
        </svg>

        <div className="absolute left-1 top-[108px] z-10 flex h-[214px] w-[160px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-center shadow-sm shadow-slate-200/60">
          <img alt="" className="mb-3 h-14 w-14 object-contain" src={crowdIcon} />
          <p className="text-sm font-black text-slate-900">
            {sourceArea.name} {sourceArea.status}
          </p>
          <p className="mt-4 text-sm font-bold text-slate-500">Re-Trip 발생</p>
          <p className="mt-1 text-2xl font-black text-violet-600">
            {sourceArea.occurrences}
            <span className="ml-1 text-sm text-slate-700">건</span>
          </p>
        </div>

        {targets.map((target, index) => (
          <FlowTargetNode index={index} key={target.id} target={target} />
        ))}
      </div>
    </Panel>
  );
}

function RankCircle({ rank }: { rank: number }) {
  const rankClass =
    rank === 1 ? 'bg-violet-600' : rank === 2 ? 'bg-cyan-600' : rank === 3 ? 'bg-blue-600' : 'bg-slate-500';

  return <span className={cn('grid h-8 w-8 place-items-center rounded-full text-sm font-black text-white', rankClass)}>{rank}</span>;
}

function RecommendationTable({ recommendations }: { recommendations: ReTripRecommendation[] }) {
  return (
    <Panel className="h-full" padding="p-4">
      <PanelHeader
        action={
          <button className="inline-flex items-center gap-1 text-sm font-black text-blue-600" type="button">
            전체 보기
            <ChevronRight aria-hidden="true" size={17} />
          </button>
        }
        title="추천 대체 장소 운영 상태"
      />

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-black text-slate-600">
              <th className="w-16 px-4 py-3">순위</th>
              <th className="px-4 py-3">장소</th>
              <th className="w-28 px-4 py-3 text-center">선택률</th>
              <th className="w-32 px-4 py-3 text-center">현재 혼잡도</th>
              <th className="w-28 px-4 py-3 text-center">수용 여유</th>
              <th className="w-32 px-4 py-3 text-center">상태</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((recommendation) => (
              <tr key={recommendation.id}>
                <td className="border-t border-slate-100 px-4 py-3">
                  <RankCircle rank={recommendation.rank} />
                </td>
                <td className="border-t border-slate-100 px-4 py-3 font-black text-slate-800">{recommendation.place}</td>
                <td className="border-t border-slate-100 px-4 py-3 text-center font-black text-slate-800">
                  {recommendation.selectionRate} %
                </td>
                <td className="border-t border-slate-100 px-4 py-3 text-center">
                  <span className={cn('inline-flex h-8 min-w-24 items-center justify-center rounded-lg px-3 font-black', crowdClasses[recommendation.currentCrowd])}>
                    {recommendation.currentCrowd}
                  </span>
                </td>
                <td className="border-t border-slate-100 px-4 py-3 text-center font-black text-slate-800">
                  {recommendation.capacityMargin} %
                </td>
                <td className="border-t border-slate-100 px-4 py-3 text-center">
                  <span
                    className={cn(
                      'inline-flex h-8 min-w-24 items-center justify-center rounded-lg border px-3 font-black',
                      recommendationStatusClasses[recommendation.status],
                    )}
                  >
                    {recommendationStatusLabels[recommendation.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3">
        <div className="flex items-start gap-3">
          <Info aria-hidden="true" className="mt-0.5 shrink-0 text-blue-600" size={20} />
          <div className="min-w-0 text-sm">
            <p className="font-black text-blue-700">과밀 완화 효과 계산 근거</p>
            <p className="mt-1 font-semibold leading-5 text-slate-700">
              과밀 완화 효과(%) = (원래 방문될 것으로 예상된 곳의 방문 유지 비율 - 대체 장소로의 전환 비율) x 100
            </p>
            <p className="mt-1 font-semibold text-slate-600">음수일수록 과밀 완화 효과가 큰 상태를 의미합니다.</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function TrendPanel({ data }: { data: Array<{ bucket: string; occurrences: number; diversions: number; successRate: number }> }) {
  return (
    <Panel className="h-full" padding="p-4">
      <PanelHeader dense title="시간대별 전환 추이" />
      <div className="mb-1 flex items-center gap-5 pl-3 text-xs font-bold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-violet-500" />
          Re-Trip 발생(건)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-cyan-500" />
          대체 전환(건)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-blue-600" />
          전환 성공률(%)
        </span>
      </div>
      <div className="h-[216px] min-w-0">
        <ResponsiveContainer height="100%" width="100%">
          <ComposedChart data={data} margin={{ bottom: 0, left: 0, right: 0, top: 10 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="bucket"
              interval={1}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              width={42}
              yAxisId="left"
            />
            <YAxis
              axisLine={false}
              domain={[0, 100]}
              orientation="right"
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              width={36}
              yAxisId="right"
            />
            <Tooltip
              contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 8px 22px rgba(15, 23, 42, 0.08)' }}
            />
            <Bar barSize={8} dataKey="occurrences" fill="#8b5cf6" isAnimationActive={false} radius={[6, 6, 0, 0]} yAxisId="left" />
            <Bar barSize={8} dataKey="diversions" fill="#06b6d4" isAnimationActive={false} radius={[6, 6, 0, 0]} yAxisId="left" />
            <Line
              dataKey="successRate"
              dot={false}
              isAnimationActive={false}
              stroke="#2563eb"
              strokeLinecap="round"
              strokeWidth={3}
              type="monotone"
              yAxisId="right"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function ControlPanel({ actions }: { actions: ReTripControlAction[] }) {
  return (
    <Panel className="h-full" padding="p-4">
      <PanelHeader dense title="운영 조정 패널" />
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = controlIcons[action.icon];

          return (
            <button
              className="flex h-[50px] w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-black text-slate-700 shadow-sm shadow-slate-200/40 transition hover:border-blue-200 hover:bg-blue-50"
              key={action.id}
              type="button"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon aria-hidden="true" className="shrink-0 text-slate-500" size={22} />
                <span className="truncate">{action.label}</span>
              </span>
              <ChevronRight aria-hidden="true" className="shrink-0 text-slate-500" size={18} />
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function PolicyPanel({ adjustments }: { adjustments: ReTripPolicyAdjustment[] }) {
  return (
    <Panel className="h-full" padding="p-4">
      <PanelHeader
        action={
          <button className="inline-flex items-center gap-1 text-xs font-black text-blue-600" type="button">
            전체 보기
            <ChevronRight aria-hidden="true" size={15} />
          </button>
        }
        dense
        title="정책 조정 이력"
      />
      <div className="space-y-2">
        {adjustments.map((adjustment) => (
          <div className="flex min-h-[64px] gap-3 rounded-xl border border-slate-200 bg-white p-2.5" key={adjustment.id}>
            <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-black text-white', policyToneClasses[adjustment.tone])}>
              {adjustment.time}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-500">{adjustment.manager}</p>
              <p className="mt-0.5 truncate text-sm font-black text-slate-800">{adjustment.title}</p>
              <p className="mt-0.5 truncate text-sm font-bold text-slate-600">사유: {adjustment.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function InsightPanel({ insights }: { insights: ReTripInsight[] }) {
  return (
    <Panel className="h-full" padding="p-4">
      <PanelHeader dense title="운영 인사이트" />
      <div className="overflow-hidden rounded-xl border border-blue-100">
        {insights.map((insight) => {
          const Icon = insightIcons[insight.icon];

          return (
            <div className="flex gap-3 border-b border-blue-100 bg-blue-50/50 p-2.5 last:border-b-0" key={insight.id}>
              <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full', insightToneClasses[insight.tone])}>
                <Icon aria-hidden="true" size={18} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-blue-700">{insight.title}</p>
                <p className="mt-1 truncate text-xs font-bold text-slate-600">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
        <span>발행 시간&nbsp;&nbsp;10:32</span>
        <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 font-black text-blue-600" type="button">
          상세 리포트 보기
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      </div>
    </Panel>
  );
}

export function ReTripMonitorPage() {
  const { data } = useQuery({ queryKey: ['retrip-monitor-snapshot'], queryFn: getReTripMonitorSnapshot });

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6" aria-label="Re-Trip 핵심 지표">
        {data.kpis.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:h-[456px] xl:grid-cols-[1.05fr_1fr]">
        <FlowPanel sourceArea={data.sourceArea} targets={data.flowTargets} />
        <RecommendationTable recommendations={data.recommendations} />
      </section>

      <section className="grid gap-4 xl:h-[300px] xl:grid-cols-[1.45fr_0.78fr_0.9fr_0.85fr]">
        <TrendPanel data={data.hourlyTrend} />
        <ControlPanel actions={data.controlActions} />
        <PolicyPanel adjustments={data.policyAdjustments} />
        <InsightPanel insights={data.insights} />
      </section>
    </div>
  );
}
