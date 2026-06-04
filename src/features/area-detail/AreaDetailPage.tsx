import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  AlertTriangle,
  Bike,
  Bus,
  ChevronDown,
  ChevronRight,
  Clock3,
  CloudSun,
  Info,
  ParkingCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  TrainFront,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { getAreaDetailById } from '../../services/metricsApi';
import {
  type AreaAction,
  type AreaCultureQuestion,
  type AreaDetailMetric,
  type AreaDetailTone,
  type AreaOperationLog,
  type AreaResponseMetric,
  type AreaRiskFactor,
  type AreaTrendBucket,
  type AreaTransportInfo,
} from '../../types/area';

const metricIconAssets: Record<AreaDetailMetric['iconKey'], string> = {
  crowd: new URL('../../../asset/image-removebg-preview (11).png', import.meta.url).href,
  risk: new URL('../../../asset/image-removebg-preview (5).png', import.meta.url).href,
  population: new URL('../../../asset/image-Photoroom (23).png', import.meta.url).href,
  retrip: new URL('../../../asset/image-removebg-preview (7).png', import.meta.url).href,
  culture: new URL('../../../asset/image-removebg-preview (8).png', import.meta.url).href,
};

const placeImages: Record<string, string> = {
  'c6304b8a-f97b-4054-bde5-9bd22d5972b8.png': new URL(
    '../../../asset/c6304b8a-f97b-4054-bde5-9bd22d5972b8.png',
    import.meta.url,
  ).href,
  'a34420e0-119e-4642-b5c8-439d1ce5b399.png': new URL(
    '../../../asset/a34420e0-119e-4642-b5c8-439d1ce5b399.png',
    import.meta.url,
  ).href,
  'd0d3a2e9-5fab-4620-943e-1d3cd7f30dba.png': new URL(
    '../../../asset/d0d3a2e9-5fab-4620-943e-1d3cd7f30dba.png',
    import.meta.url,
  ).href,
  '36286a13-7ff1-4523-8342-26f73c02e0cb.png': new URL(
    '../../../asset/36286a13-7ff1-4523-8342-26f73c02e0cb.png',
    import.meta.url,
  ).href,
  '91fb8fb5-6470-4342-bbb0-a6f390442976.png': new URL(
    '../../../asset/91fb8fb5-6470-4342-bbb0-a6f390442976.png',
    import.meta.url,
  ).href,
};

const toneText: Record<AreaDetailTone, string> = {
  danger: 'text-red-500',
  success: 'text-emerald-600',
  info: 'text-blue-600',
  warning: 'text-orange-500',
  neutral: 'text-slate-500',
  purple: 'text-violet-600',
  teal: 'text-teal-600',
};

const toneBorder: Record<AreaDetailTone, string> = {
  danger: 'border-red-300 bg-red-50 text-red-600',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  info: 'border-blue-300 bg-blue-50 text-blue-600',
  warning: 'border-orange-300 bg-orange-50 text-orange-500',
  neutral: 'border-slate-300 bg-slate-50 text-slate-600',
  purple: 'border-violet-300 bg-violet-50 text-violet-600',
  teal: 'border-teal-300 bg-teal-50 text-teal-600',
};

const smallIconByKey: Record<AreaTransportInfo['iconKey'], LucideIcon> = {
  subway: TrainFront,
  bus: Bus,
  bike: Bike,
  parking: ParkingCircle,
  alert: AlertTriangle,
  weather: CloudSun,
};

const riskIconByKey: Record<AreaRiskFactor['iconKey'], LucideIcon> = {
  crowd: Users,
  control: Info,
  weather: CloudSun,
};

const actionIconAssets: Record<AreaAction['iconKey'], string> = {
  mapPin: new URL('../../../asset/image-Photoroom (58).png', import.meta.url).href,
  megaphone: new URL('../../../asset/image-Photoroom (59).png', import.meta.url).href,
  memo: new URL('../../../asset/image-Photoroom (60).png', import.meta.url).href,
  minus: new URL('../../../asset/image-Photoroom (61).png', import.meta.url).href,
  check: new URL('../../../asset/image-removebg-preview (19).png', import.meta.url).href,
};

const responseIconByKey: Record<AreaResponseMetric['iconKey'], LucideIcon> = {
  retrip: RefreshCw,
  clock: Clock3,
  shield: ShieldCheck,
  search: Search,
};

const chartFrame = {
  bottom: 178,
  height: 205,
  left: 42,
  right: 36,
  top: 10,
  width: 704,
};

const chartPlotWidth = chartFrame.width - chartFrame.left - chartFrame.right;
const chartPlotHeight = chartFrame.bottom - chartFrame.top;

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
}

function yForValue(value: number, max: number) {
  return chartFrame.bottom - (value / max) * chartPlotHeight;
}

function buildTrendPoints(data: AreaTrendBucket[], key: 'crowd' | 'retrip', max: number) {
  const start = timeToMinutes(data[0]?.time ?? '09:30');
  const end = timeToMinutes(data[data.length - 1]?.time ?? '10:30');
  const duration = Math.max(end - start, 1);

  return data.map((point) => {
    const x = chartFrame.left + ((timeToMinutes(point.time) - start) / duration) * chartPlotWidth;
    const y = yForValue(point[key], max);

    return { x, y };
  });
}

function pointsToString(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
}

function MetricTile({ metric }: { metric: AreaDetailMetric }) {
  const iconAsset = metricIconAssets[metric.iconKey];
  const valueSizeClass = metric.value.length > 9 ? 'text-[22px] 2xl:text-[28px]' : 'text-[26px] 2xl:text-3xl';

  return (
    <Card className="flex h-[96px] items-center rounded-xl border-slate-200/80 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.045)] xl:h-full">
      <div className="mr-3 flex h-12 w-12 shrink-0 items-center justify-center 2xl:mr-4 2xl:h-14 2xl:w-14">
        <img alt="" aria-hidden="true" className="h-12 w-12 object-contain drop-shadow-sm 2xl:h-14 2xl:w-14" draggable={false} src={iconAsset} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-extrabold text-slate-900 2xl:text-[13px]">{metric.label}</p>
        <p className={`mt-1 whitespace-nowrap font-black leading-none tracking-normal 2xl:mt-1.5 ${valueSizeClass} ${toneText[metric.tone]}`}>
          {metric.value}
          {metric.unit ? <span className="ml-1 text-[13px] font-extrabold text-slate-900 2xl:text-[15px]">{metric.unit}</span> : null}
        </p>
        <p className="mt-1.5 text-[11px] font-bold text-slate-600 2xl:mt-2 2xl:text-[13px]">
          {metric.helper}
          <span className={`ml-4 text-xs font-black ${metric.deltaTone === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
            {metric.delta}
          </span>
        </p>
      </div>
    </Card>
  );
}

function SectionTitle({ title, actionLabel = '전체 보기' }: { title: string; actionLabel?: string }) {
  return (
    <div className="mb-1.5 flex items-center justify-between 2xl:mb-2">
      <h2 className="text-[14px] font-black tracking-normal text-slate-950 2xl:text-base">{title}</h2>
      <button className="inline-flex items-center text-xs font-black text-blue-600" type="button">
        {actionLabel}
        <ChevronRight aria-hidden="true" size={15} />
      </button>
    </div>
  );
}

function TrendPanel({ data }: { data: AreaTrendBucket[] }) {
  const crowdPoints = buildTrendPoints(data, 'crowd', 100);
  const retripPoints = buildTrendPoints(data, 'retrip', 200);
  const crowdAreaPoints = [
    `${chartFrame.left},${chartFrame.bottom}`,
    pointsToString(crowdPoints),
    `${chartFrame.left + chartPlotWidth},${chartFrame.bottom}`,
  ].join(' ');
  const xLabels = ['09:30', '09:40', '09:50', '10:00', '10:10', '10:20', '10:30'];
  const startMinutes = timeToMinutes('09:30');
  const endMinutes = timeToMinutes('10:30');

  return (
    <Card className="flex h-[198px] flex-col rounded-xl border-slate-200/80 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.045)] xl:h-full">
      <div className="mb-2 flex items-start justify-between">
        <h2 className="text-base font-black tracking-normal text-slate-950">최근 1시간 현황</h2>
        <button className="inline-flex items-center text-xs font-black text-blue-600" type="button">
          상세 보기
          <ChevronRight aria-hidden="true" size={15} />
        </button>
      </div>
      <div className="mb-1 flex items-center gap-6 text-[11px] font-black 2xl:gap-8">
        <span className="text-red-500">혼잡도</span>
        <span className="inline-flex items-center gap-2 text-slate-700">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          혼잡도 (위험 점수)
        </span>
        <span className="inline-flex items-center gap-2 text-slate-700">
          <span className="h-2 w-2 rounded-full bg-teal-600" />
          Re-Trip 활동
        </span>
        <span className="ml-auto text-teal-600">Re-Trip 활동</span>
      </div>
      <div className="min-h-0 flex-1">
        <svg aria-label="최근 1시간 혼잡도와 Re-Trip 활동 추이" className="h-full w-full" role="img" viewBox={`0 0 ${chartFrame.width} ${chartFrame.height}`}>
          <defs>
            <linearGradient id="areaDetailCrowdFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = yForValue(tick, 100);

            return (
              <g key={tick}>
                <line stroke="#e2e8f0" strokeDasharray="3 3" x1={chartFrame.left} x2={chartFrame.left + chartPlotWidth} y1={y} y2={y} />
                <text fill="#0f172a" fontSize="12" fontWeight="800" textAnchor="end" x={chartFrame.left - 10} y={y + 4}>
                  {tick}
                </text>
                <text fill="#0f9f9f" fontSize="12" fontWeight="800" textAnchor="start" x={chartFrame.left + chartPlotWidth + 10} y={y + 4}>
                  {tick * 2}
                </text>
              </g>
            );
          })}
          {xLabels.map((label) => {
            const x = chartFrame.left + ((timeToMinutes(label) - startMinutes) / (endMinutes - startMinutes)) * chartPlotWidth;

            return (
              <text fill="#334155" fontSize="12" fontWeight="800" key={label} textAnchor="middle" x={x} y={chartFrame.bottom + 19}>
                {label}
              </text>
            );
          })}
          <polygon fill="url(#areaDetailCrowdFill)" points={crowdAreaPoints} />
          <polyline fill="none" points={pointsToString(crowdPoints)} stroke="#ef4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <polyline fill="none" points={pointsToString(retripPoints)} stroke="#0f9f9f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          {crowdPoints.map((point, index) => (
            <circle cx={point.x} cy={point.y} fill="#ef4444" key={`crowd-${index}`} r="3" />
          ))}
          {retripPoints.map((point, index) => (
            <circle cx={point.x} cy={point.y} fill="#0f9f9f" key={`retrip-${index}`} r="3" />
          ))}
        </svg>
      </div>
    </Card>
  );
}

function RiskBasisPanel({ factors, finalRiskScore }: { factors: AreaRiskFactor[]; finalRiskScore: string }) {
  return (
    <Card className="flex h-[198px] flex-col rounded-xl border-slate-200/80 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.045)] xl:h-full">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-base font-black tracking-normal text-slate-950">risk_score 근거</h2>
        <Info aria-hidden="true" className="text-slate-400" size={16} />
      </div>
      <div className="space-y-3">
        {factors.map((factor) => {
          const Icon = riskIconByKey[factor.iconKey];

          return (
            <div className="flex items-center justify-between text-[15px] font-extrabold" key={factor.id}>
              <div className="flex items-center gap-3 text-slate-700">
                <Icon aria-hidden="true" className="text-slate-500" size={20} />
                {factor.label}
              </div>
              <span className={factor.id === 'crowd-score' ? 'text-lg text-red-500 2xl:text-xl' : 'text-slate-950'}>{factor.value}</span>
            </div>
          );
        })}
      </div>
      <div className="my-3 border-t border-dashed border-slate-300" />
      <div className="flex items-center justify-between">
        <p className="text-base font-black text-slate-950">최종 risk_score</p>
        <p className="text-2xl font-black leading-none text-red-500 2xl:text-3xl">
          {finalRiskScore.split(' ')[0]}
          <span className="ml-1 text-base text-slate-950">/100</span>
        </p>
      </div>
      <button className="mt-auto ml-auto flex items-center text-sm font-black text-blue-600" type="button">
        자세히 보기
        <ChevronRight aria-hidden="true" size={16} />
      </button>
    </Card>
  );
}

function ActionPanel({ actions }: { actions: AreaAction[] }) {
  return (
    <Card className="flex h-[198px] flex-col rounded-xl border-slate-200/80 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.045)] xl:h-full">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-base font-black tracking-normal text-slate-950">운영 액션</h2>
        <Info aria-hidden="true" className="text-slate-400" size={16} />
      </div>
      <div className="grid flex-1 grid-cols-2 content-stretch gap-3">
        {actions.map((action) => {
          const iconAsset = actionIconAssets[action.iconKey];

          return (
            <button
              className={`inline-flex min-h-0 items-center justify-center gap-2 rounded-lg border px-2 text-[13px] font-black 2xl:gap-2.5 2xl:text-[15px] ${toneBorder[action.tone]} ${
                action.wide ? 'col-span-2' : ''
              }`}
              key={action.id}
              type="button"
            >
              <img alt="" aria-hidden="true" className="h-5 w-5 shrink-0 object-contain drop-shadow-sm 2xl:h-6 2xl:w-6" draggable={false} src={iconAsset} />
              {action.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function LiveMessagePanel({
  liveMessage,
}: {
  liveMessage: {
    title: string;
    description: string;
    guidance: string;
    occurredAt: string;
    places: Array<{ id: string; name: string; route: string }>;
  };
}) {
  return (
    <Card className="flex h-[184px] flex-col rounded-xl border-slate-200/80 p-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] xl:h-full">
      <h2 className="mb-2 text-base font-black tracking-normal text-slate-950">실시간 메시지</h2>
      <div className="flex flex-1 flex-col rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-white p-3">
        <div className="mb-2 flex gap-2.5">
          <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-red-500 2xl:mt-1" size={24} />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-black text-red-600">{liveMessage.title}</p>
            <p className="mt-0.5 text-[12px] font-extrabold text-slate-800">{liveMessage.description}</p>
          </div>
        </div>
        <p className="mb-2 truncate text-[12px] font-extrabold text-slate-800">{liveMessage.guidance}</p>
        <div className="grid grid-cols-3 gap-1.5">
          {liveMessage.places.map((place) => (
            <button
              className="rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-left text-[11px] font-black text-blue-700"
              key={place.id}
              type="button"
            >
              <span className="block truncate">{place.name}</span>
              <span className="mt-1 hidden truncate text-slate-500 2xl:block">{place.route}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs font-bold text-slate-500">발생 시간&nbsp;&nbsp;{liveMessage.occurredAt}</span>
          <button className="inline-flex h-7 items-center gap-1 rounded-md bg-red-50 px-3 text-xs font-black text-red-600" type="button">
            <span className="2xl:hidden">추천 현황</span>
            <span className="hidden 2xl:inline">대체 장소 추천 현황 보기</span>
            <ChevronRight aria-hidden="true" size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
}

function TransportPanel({ rows }: { rows: AreaTransportInfo[] }) {
  return (
    <Card className="flex h-[184px] flex-col rounded-xl border-slate-200/80 p-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] xl:h-full">
      <h2 className="mb-2 text-base font-black tracking-normal text-slate-950">교통·현장 정보</h2>
      <div className="grid flex-1 grid-rows-6 divide-y divide-slate-200">
        {rows.map((row) => {
          const Icon = smallIconByKey[row.iconKey];

          return (
            <div className="flex min-h-0 items-center justify-between gap-3 text-[13px] font-extrabold" key={row.id}>
              <div className="flex items-center gap-3 text-slate-800">
                <Icon aria-hidden="true" className={`${toneText[row.tone]} h-[19px] w-[19px]`} />
                {row.mode}
              </div>
              <span className="truncate text-right text-slate-700">{row.value}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function RecommendedPanel({ places }: { places: Array<{ id: string; rank: number; name: string; share: string; imageFile: string }> }) {
  return (
    <Card className="flex h-[184px] flex-col rounded-xl border-slate-200/80 p-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] xl:h-full">
      <SectionTitle actionLabel="전체 보기" title="추천 대체 장소 TOP 5" />
      <div className="grid flex-1 grid-rows-5 gap-1.5">
        {places.map((place) => (
          <div className="grid min-h-0 grid-cols-[22px_42px_1fr_auto] items-center gap-2 text-[13px] font-black" key={place.id}>
            <span
              className={`grid h-5 w-5 place-items-center rounded-full text-xs text-white ${
                place.rank === 1 ? 'bg-red-500' : place.rank === 2 ? 'bg-red-400' : place.rank === 3 ? 'bg-orange-400' : 'bg-slate-500'
              }`}
            >
              {place.rank}
            </span>
            <img alt="" className="h-7 w-10 rounded-md object-cover" src={placeImages[place.imageFile]} />
            <span className="truncate text-slate-900">{place.name}</span>
            <span className="whitespace-nowrap text-xs text-slate-600">{place.share}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CulturePanel({ questions }: { questions: AreaCultureQuestion[] }) {
  return (
    <Card className="flex h-[184px] flex-col rounded-xl border-slate-200/80 p-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] xl:h-full">
      <SectionTitle actionLabel="전체 보기" title="최근 Culture Scan 질문" />
      <div className="grid flex-1 grid-rows-6 gap-1">
        {questions.map((item) => (
          <div className="grid min-h-0 grid-cols-[50px_1fr_40px] items-center gap-2 text-[12px] font-bold" key={item.id}>
            <span className={`rounded-full border px-2 py-1 text-center text-xs font-black ${toneBorder[item.tone]}`}>{item.category}</span>
            <span className="truncate text-slate-800">{item.question}</span>
            <span className="text-right text-xs font-black text-slate-500">{item.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ResponseMetricsPanel({ metrics }: { metrics: AreaResponseMetric[] }) {
  return (
    <Card className="flex h-[136px] flex-col rounded-xl border-slate-200/80 p-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] xl:h-full">
      <div className="mb-2 flex items-baseline gap-3">
        <h2 className="text-base font-black tracking-normal text-slate-950">앱 반응 지표</h2>
        <span className="text-xs font-bold text-slate-500">(최근 1시간)</span>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-slate-200">
        <div className="grid h-6 grid-cols-[1fr_116px_82px] items-center bg-slate-50 px-3 text-[11px] font-black text-slate-700">
          <span>지표</span>
          <span className="text-right">현재</span>
          <span className="text-right">전일 대비</span>
        </div>
        {metrics.map((metric) => {
          const Icon = responseIconByKey[metric.iconKey];

          return (
            <div className="grid flex-1 grid-cols-[1fr_116px_82px] items-center border-t border-slate-200 px-3 text-[12px] font-black" key={metric.id}>
              <span className="flex items-center gap-3 text-slate-800">
                <Icon aria-hidden="true" className="text-blue-500" size={18} />
                {metric.label}
              </span>
              <span className="text-right text-slate-900">{metric.value}</span>
              <span className="text-right text-red-500">{metric.delta}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function LogToneDot({ tone }: { tone: AreaDetailTone }) {
  const dotClass = tone === 'danger' ? 'bg-red-500' : tone === 'warning' ? 'bg-orange-400' : 'bg-emerald-500';

  return <span className={`h-3 w-3 rounded-full ${dotClass}`} />;
}

function OperationLogPanel({ logs }: { logs: AreaOperationLog[] }) {
  return (
    <Card className="flex h-[136px] flex-col rounded-xl border-slate-200/80 p-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] xl:h-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-black tracking-normal text-slate-950">담당자 메모 / 운영 기록</h2>
        <button className="inline-flex items-center text-xs font-black text-blue-600" type="button">
          전체 보기
          <ChevronRight aria-hidden="true" size={15} />
        </button>
      </div>
      <div className="grid flex-1 grid-rows-3 divide-y divide-slate-200">
        {logs.map((log) => (
          <div className="grid min-h-0 grid-cols-[18px_52px_76px_1fr_96px] items-center gap-3 text-[12px]" key={log.id}>
            <LogToneDot tone={log.tone} />
            <span className="font-black text-slate-700">{log.time}</span>
            <span className={`rounded-md border px-1.5 py-0.5 text-center text-[10px] font-black 2xl:px-2 2xl:text-[11px] ${toneBorder[log.tone]}`}>{log.tag}</span>
            <div className="min-w-0">
              <p className="truncate font-black text-slate-900">{log.title}</p>
              <p className="truncate text-[11px] font-bold text-slate-500">{log.description}</p>
            </div>
            <span className="text-right text-xs font-bold text-slate-500">{log.operator}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AreaDetailPage() {
  const { areaId = 'bukchon' } = useParams();
  const { data: area } = useQuery({ queryKey: ['area-detail-screen', areaId], queryFn: () => getAreaDetailById(areaId) });

  if (!area) {
    return null;
  }

  return (
    <div className="w-full max-w-none space-y-3 pb-3 xl:grid xl:h-full xl:min-h-[760px] xl:grid-rows-[40px_124px_minmax(0,1.22fr)_minmax(0,1.12fr)_minmax(0,0.82fr)] xl:gap-4 xl:space-y-0 xl:overflow-hidden xl:pb-0">
      <div className="flex h-10 items-center justify-between gap-3 xl:h-full">
        <button
          className="flex h-full min-w-0 max-w-[560px] flex-1 items-center justify-between rounded-xl border border-slate-200 bg-white px-5 text-base font-black text-slate-900 shadow-sm shadow-slate-200/40"
          type="button"
        >
          <span className="flex min-w-0 items-center gap-5">
            <span>{area.city}</span>
            <ChevronRight aria-hidden="true" className="text-slate-400" size={16} />
            <span>{area.district}</span>
            <ChevronRight aria-hidden="true" className="text-slate-400" size={16} />
            <span className="truncate">{area.areaName}</span>
          </span>
          <ChevronDown aria-hidden="true" className="shrink-0 text-slate-500" size={18} />
        </button>
        <span className="inline-flex h-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 text-sm font-black text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          실시간
        </span>
        <p className="ml-auto hidden text-sm font-bold text-slate-600 xl:block">
          기준 시간: {area.standardTimeLabel}
          <Info aria-hidden="true" className="ml-2 inline text-slate-400" size={15} />
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:h-full xl:grid-cols-5">
        {area.metrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid gap-3 xl:h-full xl:grid-cols-[1.55fr_0.92fr_1.22fr]">
        <TrendPanel data={area.trend} />
        <RiskBasisPanel factors={area.riskFactors} finalRiskScore={area.finalRiskScore} />
        <ActionPanel actions={area.actions} />
      </div>

      <div className="grid gap-3 xl:h-full xl:grid-cols-[1.05fr_0.9fr_0.9fr_1.08fr]">
        <LiveMessagePanel liveMessage={area.liveMessage} />
        <TransportPanel rows={area.transport} />
        <RecommendedPanel places={area.recommendedPlaces} />
        <CulturePanel questions={area.cultureQuestions} />
      </div>

      <div className="grid gap-3 xl:h-full xl:grid-cols-[0.78fr_1.62fr]">
        <ResponseMetricsPanel metrics={area.responseMetrics} />
        <OperationLogPanel logs={area.operationLogs} />
      </div>
    </div>
  );
}
