import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  AlertTriangle,
  Bike,
  Bus,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleMinus,
  Clock3,
  CloudSun,
  FilePenLine,
  Info,
  MapPin,
  Megaphone,
  MessageCircle,
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

const metricIconAssets = {
  crowd: new URL('../../../asset/image-removebg-preview (11).png', import.meta.url).href,
  risk: new URL('../../../asset/image-removebg-preview (5).png', import.meta.url).href,
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

const metricVectorIcons: Partial<Record<AreaDetailMetric['iconKey'], LucideIcon>> = {
  population: Users,
  retrip: RefreshCw,
  culture: MessageCircle,
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

const actionIconByKey: Record<AreaAction['iconKey'], LucideIcon> = {
  mapPin: MapPin,
  megaphone: Megaphone,
  memo: FilePenLine,
  minus: CircleMinus,
  check: CheckCircle2,
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
  const Icon = metricVectorIcons[metric.iconKey];
  const iconAsset = metric.iconKey === 'crowd' || metric.iconKey === 'risk' ? metricIconAssets[metric.iconKey] : null;
  const valueSizeClass = metric.value.length > 9 ? 'text-[22px] 2xl:text-[28px]' : 'text-[26px] 2xl:text-3xl';

  return (
    <Card className="flex h-[84px] items-center rounded-xl border-slate-200/80 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.045)] 2xl:h-[108px] 2xl:p-4">
      <div className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center 2xl:mr-4 2xl:h-14 2xl:w-14">
        {iconAsset ? (
          <img alt="" aria-hidden="true" className="h-11 w-11 object-contain drop-shadow-sm 2xl:h-14 2xl:w-14" src={iconAsset} />
        ) : Icon ? (
          <Icon aria-hidden="true" className={`${toneText[metric.tone]} h-11 w-11 2xl:h-12 2xl:w-12`} strokeWidth={2.9} />
        ) : null}
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
    <Card className="h-[170px] rounded-xl border-slate-200/80 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.045)] 2xl:h-[232px] 2xl:p-3.5">
      <div className="mb-1 flex items-start justify-between 2xl:mb-1.5">
        <h2 className="text-[14px] font-black tracking-normal text-slate-950 2xl:text-base">최근 1시간 현황</h2>
        <button className="inline-flex items-center text-xs font-black text-blue-600" type="button">
          상세 보기
          <ChevronRight aria-hidden="true" size={15} />
        </button>
      </div>
      <div className="mb-0 flex items-center gap-5 text-[10px] font-black 2xl:mb-0.5 2xl:gap-8 2xl:text-[11px]">
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
      <div className="h-[124px] 2xl:h-[176px]">
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
    <Card className="h-[170px] rounded-xl border-slate-200/80 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.045)] 2xl:h-[232px] 2xl:p-3.5">
      <div className="mb-2 flex items-center gap-2 2xl:mb-3">
        <h2 className="text-[14px] font-black tracking-normal text-slate-950 2xl:text-base">risk_score 근거</h2>
        <Info aria-hidden="true" className="text-slate-400" size={16} />
      </div>
      <div className="space-y-2 2xl:space-y-3">
        {factors.map((factor) => {
          const Icon = riskIconByKey[factor.iconKey];

          return (
            <div className="flex items-center justify-between text-[13px] font-extrabold 2xl:text-[15px]" key={factor.id}>
              <div className="flex items-center gap-3 text-slate-700">
                <Icon aria-hidden="true" className="text-slate-500" size={20} />
                {factor.label}
              </div>
              <span className={factor.id === 'crowd-score' ? 'text-lg text-red-500 2xl:text-xl' : 'text-slate-950'}>{factor.value}</span>
            </div>
          );
        })}
      </div>
      <div className="my-2 border-t border-dashed border-slate-300 2xl:my-3" />
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-black text-slate-950 2xl:text-base">최종 risk_score</p>
        <p className="text-2xl font-black leading-none text-red-500 2xl:text-3xl">
          {finalRiskScore.split(' ')[0]}
          <span className="ml-1 text-base text-slate-950">/100</span>
        </p>
      </div>
      <button className="mt-2 ml-auto flex items-center text-xs font-black text-blue-600 2xl:mt-3 2xl:text-sm" type="button">
        자세히 보기
        <ChevronRight aria-hidden="true" size={16} />
      </button>
    </Card>
  );
}

function ActionPanel({ actions }: { actions: AreaAction[] }) {
  return (
    <Card className="h-[170px] rounded-xl border-slate-200/80 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.045)] 2xl:h-[232px] 2xl:p-3.5">
      <div className="mb-2 flex items-center gap-2 2xl:mb-3">
        <h2 className="text-[14px] font-black tracking-normal text-slate-950 2xl:text-base">운영 액션</h2>
        <Info aria-hidden="true" className="text-slate-400" size={16} />
      </div>
      <div className="grid grid-cols-2 gap-2 2xl:gap-2.5">
        {actions.map((action) => {
          const Icon = actionIconByKey[action.iconKey];

          return (
            <button
              className={`inline-flex h-[36px] items-center justify-center gap-2 rounded-lg border text-[12px] font-black 2xl:h-[48px] 2xl:gap-2.5 2xl:text-[15px] ${toneBorder[action.tone]} ${
                action.wide ? 'col-span-2' : ''
              }`}
              key={action.id}
              type="button"
            >
              <Icon aria-hidden="true" size={24} />
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
    <Card className="h-[170px] rounded-xl border-slate-200/80 p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] 2xl:h-[216px] 2xl:p-3">
      <h2 className="mb-1.5 text-[14px] font-black tracking-normal text-slate-950 2xl:mb-2 2xl:text-base">실시간 메시지</h2>
      <div className="rounded-lg border border-red-200 bg-gradient-to-br from-red-50 to-white p-2.5 2xl:p-3">
        <div className="mb-1 flex gap-2 2xl:mb-2 2xl:gap-2.5">
          <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-red-500 2xl:mt-1" size={24} />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-black text-red-600 2xl:text-[15px]">{liveMessage.title}</p>
            <p className="mt-0.5 text-[10px] font-extrabold text-slate-800 2xl:text-[12px]">{liveMessage.description}</p>
          </div>
        </div>
        <p className="mb-1.5 truncate text-[10px] font-extrabold text-slate-800 2xl:mb-2 2xl:text-[12px]">{liveMessage.guidance}</p>
        <div className="grid grid-cols-3 gap-1 2xl:gap-1.5">
          {liveMessage.places.map((place) => (
            <button
              className="rounded-lg border border-blue-200 bg-white px-1.5 py-1 text-left text-[10px] font-black text-blue-700 2xl:px-2 2xl:py-1.5 2xl:text-[11px]"
              key={place.id}
              type="button"
            >
              <span className="block truncate">{place.name}</span>
              <span className="hidden truncate text-slate-500 2xl:mt-1 2xl:block">{place.route}</span>
            </button>
          ))}
        </div>
        <div className="mt-1.5 flex items-center justify-between 2xl:mt-2">
          <span className="text-[10px] font-bold text-slate-500 2xl:text-xs">발생 시간&nbsp;&nbsp;{liveMessage.occurredAt}</span>
          <button className="inline-flex h-6 items-center gap-1 rounded-md bg-red-50 px-2 text-[10px] font-black text-red-600 2xl:h-7 2xl:px-3 2xl:text-xs" type="button">
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
    <Card className="h-[170px] rounded-xl border-slate-200/80 p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] 2xl:h-[216px] 2xl:p-3">
      <h2 className="mb-1 text-[14px] font-black tracking-normal text-slate-950 2xl:mb-1.5 2xl:text-base">교통·현장 정보</h2>
      <div className="divide-y divide-slate-200">
        {rows.map((row) => {
          const Icon = smallIconByKey[row.iconKey];

          return (
            <div className="flex h-[17px] items-center justify-between gap-1.5 text-[10px] font-extrabold 2xl:h-[28px] 2xl:gap-3 2xl:text-[13px]" key={row.id}>
              <div className="flex items-center gap-3 text-slate-800">
                <Icon aria-hidden="true" className={`${toneText[row.tone]} h-3.5 w-3.5 2xl:h-[19px] 2xl:w-[19px]`} />
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
    <Card className="h-[170px] rounded-xl border-slate-200/80 p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] 2xl:h-[216px] 2xl:p-3">
      <SectionTitle actionLabel="전체 보기" title="추천 대체 장소 TOP 5" />
      <div className="space-y-0.5 2xl:space-y-2">
        {places.map((place) => (
          <div className="grid h-[18px] grid-cols-[18px_30px_1fr_auto] items-center gap-1.5 text-[10px] font-black 2xl:h-[27px] 2xl:grid-cols-[22px_42px_1fr_auto] 2xl:gap-2 2xl:text-[13px]" key={place.id}>
            <span
              className={`grid h-4 w-4 place-items-center rounded-full text-[9px] text-white 2xl:h-5 2xl:w-5 2xl:text-xs ${
                place.rank === 1 ? 'bg-red-500' : place.rank === 2 ? 'bg-red-400' : place.rank === 3 ? 'bg-orange-400' : 'bg-slate-500'
              }`}
            >
              {place.rank}
            </span>
            <img alt="" className="h-[18px] w-7 rounded-md object-cover 2xl:h-7 2xl:w-10" src={placeImages[place.imageFile]} />
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
    <Card className="h-[170px] rounded-xl border-slate-200/80 p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] 2xl:h-[216px] 2xl:p-3">
      <SectionTitle actionLabel="전체 보기" title="최근 Culture Scan 질문" />
      <div className="space-y-0.5 2xl:space-y-2">
        {questions.map((item) => (
          <div className="grid h-[16px] grid-cols-[42px_1fr_32px] items-center gap-1.5 text-[10px] font-bold 2xl:h-[22px] 2xl:grid-cols-[50px_1fr_40px] 2xl:gap-2 2xl:text-[12px]" key={item.id}>
            <span className={`rounded-full border px-1 py-0 text-center text-[9px] font-black 2xl:px-2 2xl:py-1 2xl:text-xs ${toneBorder[item.tone]}`}>{item.category}</span>
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
    <Card className="h-[112px] rounded-xl border-slate-200/80 p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] 2xl:h-[148px] 2xl:p-3">
      <div className="mb-1 flex items-baseline gap-2 2xl:mb-1.5 2xl:gap-3">
        <h2 className="text-[14px] font-black tracking-normal text-slate-950 2xl:text-base">앱 반응 지표</h2>
        <span className="text-[10px] font-bold text-slate-500 2xl:text-xs">(최근 1시간)</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="grid h-5 grid-cols-[1fr_92px_64px] items-center bg-slate-50 px-2 text-[10px] font-black text-slate-700 2xl:h-6 2xl:grid-cols-[1fr_116px_82px] 2xl:px-3 2xl:text-[11px]">
          <span>지표</span>
          <span className="text-right">현재</span>
          <span className="text-right">전일 대비</span>
        </div>
        {metrics.map((metric) => {
          const Icon = responseIconByKey[metric.iconKey];

          return (
            <div className="grid h-[19px] grid-cols-[1fr_92px_64px] items-center border-t border-slate-200 px-2 text-[10px] font-black 2xl:h-[24px] 2xl:grid-cols-[1fr_116px_82px] 2xl:px-3 2xl:text-[12px]" key={metric.id}>
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
    <Card className="h-[112px] rounded-xl border-slate-200/80 p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.045)] 2xl:h-[148px] 2xl:p-3">
      <div className="mb-1 flex items-center justify-between 2xl:mb-1.5">
        <h2 className="text-[14px] font-black tracking-normal text-slate-950 2xl:text-base">담당자 메모 / 운영 기록</h2>
        <button className="inline-flex items-center text-xs font-black text-blue-600" type="button">
          전체 보기
          <ChevronRight aria-hidden="true" size={15} />
        </button>
      </div>
      <div className="divide-y divide-slate-200">
        {logs.map((log) => (
          <div className="grid h-[26px] grid-cols-[14px_44px_62px_1fr_80px] items-center gap-2 text-[10px] 2xl:h-[34px] 2xl:grid-cols-[18px_52px_76px_1fr_96px] 2xl:gap-3 2xl:text-[12px]" key={log.id}>
            <LogToneDot tone={log.tone} />
            <span className="font-black text-slate-700">{log.time}</span>
            <span className={`rounded-md border px-1.5 py-0.5 text-center text-[10px] font-black 2xl:px-2 2xl:text-[11px] ${toneBorder[log.tone]}`}>{log.tag}</span>
            <div className="min-w-0">
              <p className="truncate font-black text-slate-900">{log.title}</p>
              <p className="truncate text-[9px] font-bold text-slate-500 2xl:text-[11px]">{log.description}</p>
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
    <div className="mx-auto w-full max-w-[1608px] space-y-1.5 2xl:space-y-2.5">
      <div className="flex h-[34px] items-center justify-between gap-2 2xl:h-[40px] 2xl:gap-3">
        <button
          className="flex h-full min-w-0 flex-1 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-black text-slate-900 shadow-sm shadow-slate-200/40 2xl:px-5 2xl:text-base"
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
        <span className="inline-flex h-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-black text-emerald-700 2xl:px-4 2xl:text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          실시간
        </span>
        <p className="ml-auto hidden text-xs font-bold text-slate-600 xl:block 2xl:text-sm">
          기준 시간: {area.standardTimeLabel}
          <Info aria-hidden="true" className="ml-2 inline text-slate-400" size={15} />
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5 2xl:gap-3">
        {area.metrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid gap-1.5 xl:grid-cols-[1.65fr_0.82fr_1.23fr] 2xl:gap-2.5">
        <TrendPanel data={area.trend} />
        <RiskBasisPanel factors={area.riskFactors} finalRiskScore={area.finalRiskScore} />
        <ActionPanel actions={area.actions} />
      </div>

      <div className="grid gap-1.5 xl:grid-cols-[1.13fr_0.94fr_0.88fr_1fr] 2xl:gap-2.5">
        <LiveMessagePanel liveMessage={area.liveMessage} />
        <TransportPanel rows={area.transport} />
        <RecommendedPanel places={area.recommendedPlaces} />
        <CulturePanel questions={area.cultureQuestions} />
      </div>

      <div className="grid gap-1.5 xl:grid-cols-[0.74fr_1.5fr] 2xl:gap-2.5">
        <ResponseMetricsPanel metrics={area.responseMetrics} />
        <OperationLogPanel logs={area.operationLogs} />
      </div>
    </div>
  );
}
