import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Info,
  Radio,
  ServerCog,
  Wifi,
  XCircle,
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
import crowdRiskIcon from '../../../asset/image-removebg-preview (11).png';
import veryHighIcon from '../../../asset/image-removebg-preview (5).png';
import retripIcon from '../../../asset/image-removebg-preview (6).png';
import switchIcon from '../../../asset/image-removebg-preview (7).png';
import cultureIcon from '../../../asset/image-removebg-preview (8).png';
import complaintIcon from '../../../asset/image-removebg-preview (9).png';
import freshnessIcon from '../../../asset/image-removebg-preview (4).png';
import apiIcon from '../../../asset/image-removebg-preview (10).png';
import { getLiveMapSummary } from '../../services/liveMapApi';
import {
  type LiveDataStatus,
  type LiveMapMetric,
  type LiveMapMetricTone,
  type LiveMapRiskLevel,
  type LiveSignalPoint,
} from '../../types/liveMap';
import { SeoulLiveLeafletMap } from './SeoulLiveLeafletMap';

const metricIconById: Record<LiveMapMetric['id'], string> = {
  criticalAreas: crowdRiskIcon,
  veryHighPlaces: veryHighIcon,
  retripEvents: retripIcon,
  scheduleSwitch: switchIcon,
  cultureQuestions: cultureIcon,
  complaints: complaintIcon,
  freshness: freshnessIcon,
  apiHealth: apiIcon,
};

const metricToneClasses: Record<LiveMapMetricTone, { border: string; value: string; icon: string }> = {
  blue: {
    border: 'border-blue-200',
    icon: 'bg-blue-50',
    value: 'text-blue-600',
  },
  emerald: {
    border: 'border-emerald-200',
    icon: 'bg-emerald-50',
    value: 'text-emerald-600',
  },
  orange: {
    border: 'border-orange-200',
    icon: 'bg-orange-50',
    value: 'text-orange-500',
  },
  rose: {
    border: 'border-rose-200',
    icon: 'bg-rose-50',
    value: 'text-red-500',
  },
  teal: {
    border: 'border-cyan-200',
    icon: 'bg-cyan-50',
    value: 'text-cyan-600',
  },
  violet: {
    border: 'border-violet-200',
    icon: 'bg-violet-50',
    value: 'text-violet-600',
  },
};

const statusToneClasses: Record<LiveDataStatus['tone'], string> = {
  amber: 'text-amber-500 bg-amber-50',
  blue: 'text-blue-600 bg-blue-50',
  emerald: 'text-emerald-600 bg-emerald-50',
  rose: 'text-rose-500 bg-rose-50',
};

const markerLegend: Array<{ label: string; level: LiveMapRiskLevel | 'retrip' | 'culture' }> = [
  { label: 'Very High (매우 혼잡)', level: 'veryHigh' },
  { label: 'High (혼잡)', level: 'high' },
  { label: 'Moderate (보통)', level: 'moderate' },
  { label: 'Low (여유)', level: 'low' },
  { label: '데이터 없음', level: 'noData' },
  { label: 'Re-Trip 증가', level: 'retrip' },
  { label: 'Culture Scan 증가', level: 'culture' },
];

const markerLegendColor: Record<LiveMapRiskLevel | 'retrip' | 'culture', string> = {
  culture: '#2563eb',
  high: '#f97316',
  low: '#16a34a',
  moderate: '#f59e0b',
  noData: '#64748b',
  retrip: '#8b5cf6',
  veryHigh: '#dc2626',
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function MetricTile({ metric }: { metric: LiveMapMetric }) {
  const tone = metricToneClasses[metric.tone];

  return (
    <article className={cx('flex h-full items-center gap-4 rounded-lg border bg-white px-5 py-3 shadow-sm', tone.border)}>
      <div className={cx('grid h-14 w-14 shrink-0 place-items-center rounded-lg', tone.icon)}>
        <img alt="" className="h-12 w-12 object-contain" src={metricIconById[metric.id]} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-900">{metric.label}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className={cx('text-3xl font-black leading-none tracking-normal', tone.value)}>{metric.value}</span>
          {metric.unit ? <span className="text-sm font-black text-slate-900">{metric.unit}</span> : null}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>{metric.caption}</span>
          {metric.delta ? (
            <span
              className={cx(
                metric.deltaTone === 'good' ? 'text-teal-600' : null,
                metric.deltaTone === 'up' ? 'text-red-500' : null,
                metric.deltaTone === 'down' ? 'text-emerald-600' : null,
              )}
            >
              ▲ {metric.delta}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ControlStatusStrip({
  apiUptime,
  monitoredAreaCount,
  receivedAreaCount,
  updatedAt,
}: {
  apiUptime: string;
  monitoredAreaCount: number;
  receivedAreaCount: number;
  updatedAt: string;
}) {
  return (
    <section className="flex min-h-0 items-center justify-end rounded-lg border border-slate-200 bg-white px-5 text-sm font-black text-slate-800 shadow-sm">
      <div className="flex flex-wrap items-center justify-end gap-x-7 gap-y-2">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          서울 실시간 도시데이터 정상
        </span>
        <span className="inline-flex items-center gap-2">
          <Radio aria-hidden="true" className="text-cyan-600" size={17} />
          마지막 갱신&nbsp; {updatedAt}
        </span>
        <span className="inline-flex items-center gap-2">
          <ServerCog aria-hidden="true" className="text-blue-600" size={17} />
          {monitoredAreaCount}개 중 {receivedAreaCount}개 수신 성공
        </span>
        <span className="inline-flex items-center gap-2">
          <CheckCircle2 aria-hidden="true" className="text-emerald-600" size={17} />
          API 상태&nbsp; {apiUptime}
        </span>
      </div>
    </section>
  );
}

function MapLegend() {
  return (
    <div className="mt-2 flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs font-bold text-slate-700">
      {markerLegend.map((item) => (
        <span className="inline-flex items-center gap-1.5" key={item.level}>
          <span className="live-map-legend-dot" style={{ color: markerLegendColor[item.level] }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function TopRiskTable({
  areas,
}: {
  areas: Array<{ delta: number; nameKo: string; rank: number; riskScore: number }>;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-slate-950">Top Risk Areas</h2>
          <Info aria-hidden="true" className="text-slate-400" size={16} />
        </div>
        <button className="inline-flex items-center gap-1 text-sm font-black text-blue-600" type="button">
          전체 보기
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      </div>
      <div className="mt-2 overflow-hidden rounded-lg border border-slate-100">
        <table className="w-full table-fixed text-left">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="w-14 px-3 py-1.5 text-center">순위</th>
              <th className="px-3 py-1.5">장소</th>
              <th className="w-28 px-3 py-1.5 text-right">위험도 점수</th>
              <th className="w-24 px-3 py-1.5 text-right">전일 대비</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-bold">
            {areas.map((area) => (
              <tr key={area.rank}>
                <td className="px-3 py-1.5 text-center">
                  <span
                    className={cx(
                      'inline-grid h-6 w-6 place-items-center rounded-full text-xs font-black text-white',
                      area.rank <= 2 ? 'bg-red-500' : area.rank === 3 ? 'bg-orange-500' : 'bg-slate-500',
                    )}
                  >
                    {area.rank}
                  </span>
                </td>
                <td className="truncate px-3 py-1.5 text-slate-900">{area.nameKo}</td>
                <td className="px-3 py-1.5 text-right">
                  <span className="text-lg font-black text-red-500">{area.riskScore}</span>
                  <span className="ml-1 text-xs font-bold text-slate-500">/100</span>
                </td>
                <td className="px-3 py-1.5 text-right">
                  {area.delta > 0 ? (
                    <span className="font-black text-red-500">▲ {area.delta}</span>
                  ) : (
                    <span className="font-black text-slate-500">- 0</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DataStatusPanel({ statuses }: { statuses: LiveDataStatus[] }) {
  const statusIconById: Record<LiveDataStatus['id'], typeof CheckCircle2> = {
    api: Wifi,
    delayed: Clock3,
    missing: XCircle,
    normal: CheckCircle2,
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-slate-950">실시간 데이터 상태</h2>
        <button className="inline-flex items-center gap-1 text-sm font-black text-blue-600" type="button">
          자세히 보기
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {statuses.map((status) => {
          const Icon = statusIconById[status.id];

          return (
            <article className="rounded-lg border border-slate-200 px-2 py-2 text-center" key={status.id}>
              <div className="flex justify-center">
                <span className={cx('grid h-7 w-7 place-items-center rounded-full', statusToneClasses[status.tone])}>
                  <Icon aria-hidden="true" size={16} />
                </span>
              </div>
              <p className="mt-1.5 text-xs font-black text-slate-600">{status.label}</p>
              <p className="mt-0.5 text-xl font-black tracking-normal text-slate-950">{status.value}</p>
              <p className={cx('mt-0.5 text-xs font-black', status.tone === 'blue' ? 'text-blue-600' : 'text-slate-600')}>
                {status.caption}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SignalChart({ data }: { data: LiveSignalPoint[] }) {
  return (
    <section className="min-h-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-950">실시간 앱 반응</h2>
            <Info aria-hidden="true" className="text-slate-400" size={16} />
          </div>
          <div className="mt-2 flex items-center gap-5 text-xs font-bold text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-0.5 w-5 rounded-full bg-blue-600" />
              Re-Trip 발생 건수
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-0.5 w-5 rounded-full bg-cyan-600" />
              Culture Scan 질문 수
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-right text-xs font-bold text-slate-500">
          현재(10:32) 기준
        </div>
      </div>
      <div className="mt-2 h-[106px]">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data} margin={{ bottom: 0, left: -18, right: 0, top: 6 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis axisLine={false} dataKey="time" tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} tickLine={false} />
            <YAxis
              axisLine={false}
              tick={{ fill: '#2563eb', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              width={44}
              yAxisId="retrip"
            />
            <YAxis
              axisLine={false}
              orientation="right"
              tick={{ fill: '#0891b2', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              width={44}
              yAxisId="culture"
            />
            <Tooltip
              contentStyle={{
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
                fontSize: 12,
                fontWeight: 700,
              }}
            />
            <Line
              dataKey="retrip"
              dot={{ fill: '#2563eb', r: 2 }}
              name="Re-Trip"
              stroke="#2563eb"
              strokeWidth={3}
              type="monotone"
              yAxisId="retrip"
            />
            <Line
              dataKey="culture"
              dot={{ fill: '#0891b2', r: 2 }}
              name="Culture Scan"
              stroke="#0891b2"
              strokeWidth={3}
              type="monotone"
              yAxisId="culture"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function OperationAlert() {
  return (
    <section className="rounded-lg border border-red-200 bg-red-50 p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="relative grid h-14 w-14 shrink-0 place-items-center">
          <img alt="" className="h-12 w-12 object-contain" src={crowdRiskIcon} />
          <CircleAlert aria-hidden="true" className="absolute bottom-1 right-0 text-red-600" fill="#ffffff" size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="break-keep text-base font-black leading-tight text-red-600">
              북촌한옥마을 혼잡도 Very High. 대체 동선 추천 반응 증가
            </h2>
            <button className="shrink-0 text-sm font-black text-blue-600" type="button">
              전체 알림 보기
            </button>
          </div>
          <p className="mt-1.5 break-keep text-sm font-bold leading-relaxed text-slate-700">
            현장 북촌한옥마을의 혼잡도가 매우 높습니다. 주변 대체 관광지로의 분산 추천을 검토해 주세요.
          </p>
          <div className="mt-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-600">
            <span>발생 시간&nbsp;&nbsp;10:27</span>
            <button
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-red-300 bg-white px-3 font-black text-red-500"
              type="button"
            >
              대체 동선 추천 현황 보기
              <ChevronRight aria-hidden="true" size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LiveMapPage() {
  const { data: summary, isLoading } = useQuery({
    queryFn: getLiveMapSummary,
    queryKey: ['live-map-summary'],
  });

  if (isLoading || !summary) {
    return (
      <div className="grid h-[calc(100vh-96px)] place-items-center rounded-lg border border-slate-200 bg-white text-sm font-black text-slate-500">
        실시간 도시데이터를 불러오는 중입니다.
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-96px)] min-h-[820px] grid-rows-[44px_222px_minmax(0,1fr)] gap-3 overflow-hidden">
      <ControlStatusStrip
        apiUptime={summary.apiUptime}
        monitoredAreaCount={summary.monitoredAreaCount}
        receivedAreaCount={summary.receivedAreaCount}
        updatedAt={summary.updatedAt}
      />

      <section className="grid min-h-0 grid-cols-4 grid-rows-2 gap-3">
        {summary.metrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid min-h-0 grid-cols-[minmax(0,1fr)_520px] gap-3">
        <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_176px] gap-3">
          <section className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-950">서울 주요 121장소 모니터링</h2>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {['혼잡 위험 지역만 보기', 'Re-Trip 증가 지역', '문화 질문 증가 지역', '데이터 누락 지역'].map((label, index) => (
                  <button
                    className={cx(
                      'h-8 rounded-full border px-4 text-xs font-black',
                      index === 0
                        ? 'border-blue-200 bg-blue-50 text-blue-600'
                        : 'border-slate-200 bg-white text-slate-700',
                    )}
                    key={label}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 min-h-0 flex-1">
              <SeoulLiveLeafletMap markers={summary.markers} />
            </div>
            <MapLegend />
          </section>

          <SignalChart data={summary.signalTimeline} />
        </div>

        <div className="grid min-h-0 grid-rows-[minmax(260px,1fr)_172px_160px] gap-3">
          <TopRiskTable areas={summary.topRiskAreas} />
          <DataStatusPanel statuses={summary.dataStatus} />
          <OperationAlert />
        </div>
      </section>
    </div>
  );
}
