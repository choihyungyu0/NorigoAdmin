import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  FilePenLine,
  Info,
  MapPin,
  Pencil,
  Play,
  RefreshCw,
  Smartphone,
  TriangleAlert,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  coordinateAccuracyDistribution,
  dataCollectionSources,
  dataQualitySummaryCards,
  matchingFailures,
  missingPlaceIssues,
  qualityFields,
  qualityTimeline,
} from '../../mocks/dataQualityIssues';
import {
  type DataCollectionSource,
  type DataQualityTone,
  type DataQualityTrendDirection,
  type MatchingFailure,
  type MissingPlaceIssue,
  type QualityFieldOption,
  type QualityTimelineEvent,
} from '../../types/dataQuality';

const numberFormatter = new Intl.NumberFormat('ko-KR');

const summaryToneText: Record<DataQualityTone, string> = {
  success: 'text-emerald-600',
  info: 'text-blue-600',
  purple: 'text-violet-600',
  warning: 'text-orange-500',
  danger: 'text-rose-500',
  cyan: 'text-cyan-600',
  neutral: 'text-slate-600',
};

const issueToneClasses: Record<MissingPlaceIssue['tone'] | MatchingFailure['tone'], string> = {
  warning: 'border-orange-200 bg-orange-50 text-orange-600',
  danger: 'border-rose-200 bg-rose-50 text-rose-600',
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-600',
  info: 'border-blue-200 bg-blue-50 text-blue-600',
};

const optionToneClasses: Record<QualityFieldOption['tone'], string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  warning: 'border-orange-200 bg-orange-50 text-orange-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
};

const timelineToneClasses: Record<QualityTimelineEvent['tone'], string> = {
  success: 'bg-emerald-500 text-white',
  info: 'bg-blue-600 text-white',
  warning: 'bg-orange-500 text-white',
  danger: 'bg-rose-500 text-white',
};

function toCssUrl(src: string) {
  return src.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

function getTrendTextClass(direction?: DataQualityTrendDirection) {
  if (direction === 'down') {
    return 'text-emerald-600';
  }

  if (direction === 'up') {
    return 'text-emerald-600';
  }

  return 'text-slate-500';
}

function SourceIcon({ icon }: { icon: DataCollectionSource['icon'] }) {
  const iconClass = 'h-4 w-4';

  if (icon === 'city') {
    return <Building2 aria-hidden="true" className={iconClass} />;
  }

  if (icon === 'tourism') {
    return <BriefcaseBusiness aria-hidden="true" className={iconClass} />;
  }

  if (icon === 'app') {
    return <Smartphone aria-hidden="true" className={iconClass} />;
  }

  return <MapPin aria-hidden="true" className={iconClass} />;
}

function sourceIconTone(icon: DataCollectionSource['icon']) {
  if (icon === 'city') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-600';
  }

  if (icon === 'tourism') {
    return 'border-blue-200 bg-blue-50 text-blue-600';
  }

  if (icon === 'app') {
    return 'border-violet-200 bg-violet-50 text-violet-600';
  }

  return 'border-orange-200 bg-orange-50 text-orange-600';
}

function PanelHeader({ title, actionLabel }: { title: string; actionLabel?: string }) {
  return (
    <div className="mb-3 flex h-7 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-1.5">
        <h2 className="truncate text-lg font-black text-slate-900">{title}</h2>
        <Info aria-hidden="true" className="shrink-0 text-slate-400" size={15} />
      </div>
      {actionLabel ? (
        <button className="inline-flex shrink-0 items-center gap-1 text-sm font-black text-blue-600" type="button">
          {actionLabel}
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      ) : null}
    </div>
  );
}

function DataQualityBadge({ label, tone }: { label: string; tone: MissingPlaceIssue['tone'] | MatchingFailure['tone'] }) {
  return (
    <span className={`inline-flex h-8 shrink-0 items-center rounded-md border px-2.5 text-xs font-black ${issueToneClasses[tone]}`}>
      {label}
    </span>
  );
}

function TimelineIcon({ tone }: { tone: QualityTimelineEvent['tone'] }) {
  const iconProps = { 'aria-hidden': true, size: 15 };

  if (tone === 'success') {
    return <CheckCircle2 {...iconProps} />;
  }

  if (tone === 'info') {
    return <Pencil {...iconProps} />;
  }

  if (tone === 'warning') {
    return <RefreshCw {...iconProps} />;
  }

  return <TriangleAlert {...iconProps} />;
}

function CoordinateDonutChart({ total }: { total: number }) {
  const radius = 82;
  const strokeWidth = 38;
  const circumference = 2 * Math.PI * radius;
  const visibleSlices = coordinateAccuracyDistribution.filter((slice) => slice.count > 0);
  const gap = 5;
  const usableCircumference = circumference - gap * visibleSlices.length;

  return (
    <svg aria-label="좌표 정확도 분포" className="h-full w-full overflow-visible" role="img" viewBox="0 0 240 240">
      <circle cx="120" cy="120" fill="none" r={radius} stroke="#f1f5f9" strokeWidth={strokeWidth} />
      <g transform="rotate(-90 120 120)">
        {visibleSlices.map((slice, index) => {
          const dashLength = (slice.count / total) * usableCircumference;
          const previousDashLength = visibleSlices
            .slice(0, index)
            .reduce((sum, previousSlice) => sum + (previousSlice.count / total) * usableCircumference, 0);
          const dashOffset = -(previousDashLength + gap * index);

          return (
            <circle
              cx="120"
              cy="120"
              fill="none"
              key={slice.id}
              r={radius}
              stroke={slice.color}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              strokeWidth={strokeWidth}
            />
          );
        })}
      </g>
    </svg>
  );
}

export function DataQualityPage() {
  const coordinateTotal = coordinateAccuracyDistribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="mx-auto min-h-[calc(100vh-104px)] max-w-[1660px] space-y-4">
      <div className="flex h-11 items-center justify-end gap-3">
        <Button className="h-11 rounded-lg px-5 shadow-sm shadow-blue-200/60" variant="primary">
          <Play aria-hidden="true" fill="currentColor" size={16} />
          재검증 실행
        </Button>
        <Button className="h-11 rounded-lg px-4">
          <FilePenLine aria-hidden="true" size={17} />
          매핑 수정
        </Button>
        <Button className="h-11 rounded-lg px-4">
          <Download aria-hidden="true" size={17} />
          누락 리포트 다운로드
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 2xl:grid-cols-8">
        {dataQualitySummaryCards.map((card) => (
          <Card className="h-[128px] rounded-xl p-3.5 shadow-none" key={card.id}>
            <div className="flex h-full min-w-0 items-center gap-3">
              <span
                aria-hidden="true"
                className="block h-14 w-14 shrink-0 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${toCssUrl(card.iconSrc)})` }}
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 min-h-[33px] text-[13px] font-extrabold leading-tight text-slate-700">{card.label}</p>
                <div className="mt-1 flex min-w-0 items-baseline gap-1 whitespace-nowrap">
                  <span className={`text-[31px] font-black leading-none ${summaryToneText[card.tone]}`}>{card.value}</span>
                  {card.suffix ? <span className={`text-base font-black ${summaryToneText[card.tone]}`}>{card.suffix}</span> : null}
                  {card.denominator ? <span className="text-sm font-bold text-slate-500">/ {card.denominator}</span> : null}
                </div>
                <p className={`mt-2 truncate text-[13px] font-black ${card.trendLabel ? getTrendTextClass(card.trendDirection) : summaryToneText[card.tone]}`}>
                  {card.trendLabel ? `${card.trendDirection === 'down' ? '↘' : '↗'} ${card.trendLabel}` : card.subLabel}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr_1.18fr]">
        <Card className="h-[372px] rounded-xl p-4 shadow-none">
          <PanelHeader title="데이터 수신 현황" />
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full table-fixed text-left text-[13px]">
              <thead className="bg-slate-50 text-xs font-black text-slate-500">
                <tr className="h-9">
                  <th className="w-[34%] px-3">데이터 소스</th>
                  <th className="w-[14%] px-2 text-right">정상</th>
                  <th className="w-[14%] px-2 text-right">지연 (5분+)</th>
                  <th className="w-[14%] px-2 text-right">실패</th>
                  <th className="w-[12%] px-2 text-right">총 항목 수</th>
                  <th className="w-[12%] px-3 text-right">최근 수신</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataCollectionSources.map((source) => (
                  <tr className="h-[63px] text-slate-700" key={source.id}>
                    <td className="px-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${sourceIconTone(source.icon)}`}>
                          <SourceIcon icon={source.icon} />
                        </span>
                        <span className="truncate font-black text-slate-800">{source.source}</span>
                      </div>
                    </td>
                    <td className="px-2 text-right">
                      <p className="font-black text-emerald-600">● {numberFormatter.format(source.normal)}</p>
                      <p className="text-xs font-bold text-slate-500">({source.normalRate})</p>
                    </td>
                    <td className="px-2 text-right">
                      <p className="font-black text-orange-500">● {numberFormatter.format(source.delayed)}</p>
                      <p className="text-xs font-bold text-slate-500">({source.delayedRate})</p>
                    </td>
                    <td className="px-2 text-right">
                      <p className="font-black text-rose-500">● {numberFormatter.format(source.failed)}</p>
                      <p className="text-xs font-bold text-slate-500">({source.failedRate})</p>
                    </td>
                    <td className="px-2 text-right font-black text-slate-800">{numberFormatter.format(source.total)}</td>
                    <td className="px-3 text-right">
                      <p className="font-black text-slate-700">{source.lastReceived}</p>
                      <span className="mt-1 inline-flex h-5 items-center rounded-md border border-emerald-200 bg-emerald-50 px-1.5 text-[11px] font-black text-emerald-700">
                        {source.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="h-[372px] rounded-xl p-4 shadow-none">
          <PanelHeader title="좌표 정확도 분포" />
          <div className="grid h-[306px] grid-cols-[1.05fr_1fr] items-center gap-2">
            <div className="relative h-full min-w-0">
              <CoordinateDonutChart total={coordinateTotal} />
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="text-[15px] font-black text-slate-900">총 {coordinateTotal}개</p>
                  <p className="text-xs font-bold text-slate-500">좌표 항목</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {coordinateAccuracyDistribution.map((slice) => (
                <div className="grid grid-cols-[1fr_auto] items-start gap-3" key={slice.id}>
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                      <p className="truncate text-[13px] font-black text-slate-800">
                        {slice.label} <span className="text-[11px] font-bold text-slate-500">({slice.description})</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-black" style={{ color: slice.color }}>
                      {slice.count}개
                    </p>
                    <p className="text-[11px] font-bold text-slate-500">{slice.ratio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="h-[372px] rounded-xl p-4 shadow-none">
          <PanelHeader actionLabel="전체 보기" title="데이터 누락 장소" />
          <div className="divide-y divide-slate-100">
            {missingPlaceIssues.map((issue) => (
              <div className="flex h-[59px] items-center gap-3" key={issue.id}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">
                  <MapPin aria-hidden="true" size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-slate-800">{issue.placeName}</p>
                  <p className="truncate text-xs font-bold text-slate-500">{issue.address}</p>
                </div>
                <DataQualityBadge label={issue.issueType} tone={issue.tone} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.18fr_1fr_1.18fr]">
        <Card className="h-[384px] rounded-xl p-4 shadow-none">
          <PanelHeader actionLabel="전체 보기" title="매칭 실패 목록" />
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full table-fixed text-left text-[13px]">
              <thead className="bg-slate-50 text-xs font-black text-slate-500">
                <tr className="h-9">
                  <th className="w-[31%] px-3">데이터 소스</th>
                  <th className="w-[31%] px-3">기대 값</th>
                  <th className="w-[24%] px-3">이슈 유형</th>
                  <th className="w-[14%] px-3 text-right">마지막 확인</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchingFailures.map((failure) => (
                  <tr className="h-[57px]" key={failure.id}>
                    <td className="px-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${sourceIconTone(failure.icon)}`}>
                          <SourceIcon icon={failure.icon} />
                        </span>
                        <span className="truncate font-black text-slate-800">{failure.source}</span>
                      </div>
                    </td>
                    <td className="truncate px-3 font-bold text-slate-700">{failure.expectedValue}</td>
                    <td className="px-3">
                      <DataQualityBadge label={failure.issueType} tone={failure.tone} />
                    </td>
                    <td className="px-3 text-right font-bold text-slate-700">{failure.lastCheckedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="h-[384px] rounded-xl p-4 shadow-none">
          <PanelHeader title="품질 관리 필드" />
          <div className="space-y-2.5">
            {qualityFields.map((field) => (
              <div className="grid min-h-[74px] grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-dashed border-slate-200 bg-white px-3 py-2" key={field.id}>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-black text-blue-600">{field.name}</p>
                  <p className="mt-1 truncate text-xs font-bold text-slate-500">{field.description}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {field.options.map((option) => (
                    <span className={`inline-flex h-7 items-center rounded-md border px-2 text-xs font-black ${optionToneClasses[option.tone]}`} key={option.label}>
                      {option.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="h-[384px] rounded-xl p-4 shadow-none">
          <PanelHeader actionLabel="전체 보기" title="최근 품질 이슈 및 조치" />
          <div className="relative pl-9">
            <div className="absolute bottom-3 left-[17px] top-3 w-px bg-slate-200" />
            <div className="space-y-4">
              {qualityTimeline.map((event) => (
                <div className="relative min-h-[74px]" key={event.id}>
                  <span className={`absolute -left-9 top-0 grid h-8 w-8 place-items-center rounded-full ${timelineToneClasses[event.tone]}`}>
                    <TimelineIcon tone={event.tone} />
                  </span>
                  <div className="grid grid-cols-[44px_1fr] gap-3">
                    <p className="text-sm font-black text-slate-500">{event.time}</p>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-800">{event.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs font-bold text-slate-500">{event.description}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">조치자 : {event.operator}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
