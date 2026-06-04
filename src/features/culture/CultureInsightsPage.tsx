import { useQuery } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import {
  Armchair,
  Banknote,
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Ellipsis,
  Globe,
  Info,
  Landmark,
  MapPin,
  Radio,
  ScanLine,
  ServerCog,
  Star,
  type LucideIcon,
} from 'lucide-react';
import alertIcon from '../../../asset/image-removebg-preview (5).png';
import { getCultureInsightsSnapshot, getCultureInsightsSnapshotPreview } from '../../services/cultureInsightsApi';
import {
  type CultureConfusionSignal,
  type CultureGuideImprovement,
  type CultureMetric,
  type CultureMetricId,
  type CultureMetricTone,
  type CultureObjectIcon,
  type CulturePlaceScan,
  type CultureQuestion,
  type CultureQuestionHotspot,
  type CultureScannedObject,
} from '../../types/culture';
import { CultureHotspotLeafletMap } from './CultureHotspotLeafletMap';

type ToneClassSet = {
  border: string;
  icon: string;
  value: string;
};

type LanguageDistributionItem = {
  color: string;
  count: number;
  language: string;
  percent: number;
};

const metricIconById: Record<CultureMetricId, LucideIcon> = {
  todayScan: ScanLine,
  foreignerConfusion: Bell,
  growthAreas: MapPin,
  supportedLanguages: Globe,
  guideNeededPlaces: CircleAlert,
  improvementPriority: Star,
};

const metricToneClasses: Record<CultureMetricTone, ToneClassSet> = {
  blue: { border: 'border-blue-200', icon: 'text-blue-600', value: 'text-blue-600' },
  emerald: { border: 'border-emerald-200', icon: 'text-emerald-600', value: 'text-emerald-600' },
  orange: { border: 'border-orange-200', icon: 'text-orange-500', value: 'text-orange-500' },
  purple: { border: 'border-purple-200', icon: 'text-purple-600', value: 'text-purple-600' },
  red: { border: 'border-red-200', icon: 'text-red-500', value: 'text-red-500' },
  violet: { border: 'border-violet-200', icon: 'text-violet-600', value: 'text-violet-600' },
};

const objectIconById: Record<CultureObjectIcon, LucideIcon> = {
  bell: Bell,
  camera: Camera,
  cash: Banknote,
  etc: Ellipsis,
  seat: Armchair,
  temple: Landmark,
};

const objectToneClasses: Record<CultureScannedObject['tone'], string> = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  orange: 'bg-orange-50 text-orange-500',
  slate: 'bg-slate-100 text-slate-700',
  violet: 'bg-violet-50 text-violet-600',
};

const needLevelClasses: Record<CultureGuideImprovement['needLevel'], string> = {
  낮음: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  보통: 'border-orange-200 bg-orange-50 text-orange-500',
  높음: 'border-red-200 bg-red-50 text-red-500',
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatNumber(value: number) {
  return value.toLocaleString('ko-KR');
}

function buildDonutGradient(languages: LanguageDistributionItem[]) {
  let start = 0;

  const segments = languages.map((language) => {
    const end = start + language.percent * 3.6;
    const segment = `${language.color} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`;
    start = end;
    return segment;
  });

  return `conic-gradient(${segments.join(', ')})`;
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx('min-h-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm', className)}>{children}</section>;
}

function ViewAllButton({ label = '전체 보기' }: { label?: string }) {
  return (
    <button className="inline-flex items-center gap-0.5 text-xs font-black text-blue-600" type="button">
      {label}
      <ChevronRight aria-hidden="true" size={15} />
    </button>
  );
}

function CompactHeader({ info = false, title }: { info?: boolean; title: string }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <h2 className="truncate text-base font-black leading-tight text-slate-950">{title}</h2>
        {info ? <Info aria-hidden="true" className="shrink-0 text-slate-400" size={15} /> : null}
      </div>
      <ViewAllButton />
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={cx(
        'inline-grid h-6 w-6 place-items-center rounded-full text-xs font-black text-white',
        rank <= 2 ? 'bg-red-500' : null,
        rank === 3 ? 'bg-orange-500' : null,
        rank > 3 ? 'bg-slate-600' : null,
      )}
    >
      {rank}
    </span>
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
    <section className="flex min-h-0 items-center justify-end text-sm font-black text-slate-800">
      <div className="flex h-full flex-wrap items-center justify-end gap-x-7 gap-y-1 rounded-lg border border-slate-200 bg-white px-5 shadow-sm">
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

function MetricTile({ metric }: { metric: CultureMetric }) {
  const Icon = metricIconById[metric.id];
  const tone = metricToneClasses[metric.tone];

  return (
    <article className={cx('flex h-full items-center gap-4 rounded-lg border bg-white px-5 py-3 shadow-sm', tone.border)}>
      <div className={cx('grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white', tone.icon)}>
        <Icon aria-hidden="true" strokeWidth={2.4} size={46} />
      </div>
      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-sm font-black text-slate-900">{metric.label}</p>
        <div className="mt-1 flex items-baseline justify-center gap-1">
          <span className={cx('text-3xl font-black leading-none tracking-normal', tone.value)}>{metric.value}</span>
          <span className="text-sm font-black text-slate-900">{metric.unit}</span>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
          <span>{metric.caption}</span>
          <span className={metric.delta === '-' ? 'text-slate-500' : 'text-red-500'}>
            {metric.delta === '-' ? '-' : `▲ ${metric.delta}`}
          </span>
        </div>
      </div>
    </article>
  );
}

function PlaceScanCard({ rows }: { rows: CulturePlaceScan[] }) {
  const maxCount = 800;

  return (
    <Card>
      <CompactHeader info title="장소별 Culture Scan 현황" />
      <div className="overflow-hidden rounded-lg border border-slate-100">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="w-12 px-2 py-1.5 text-left">순위</th>
              <th className="w-28 px-2 py-1.5 text-left">장소</th>
              <th className="px-2 py-1.5 text-right">Scan 수</th>
              <th className="w-20 px-2 py-1.5 text-right">전일 대비</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
            {rows.map((row) => (
              <tr key={row.rank}>
                <td className="px-2 py-1.5">
                  <RankBadge rank={row.rank} />
                </td>
                <td className="truncate px-2 py-1.5">{row.place}</td>
                <td className="px-2 py-1.5">
                  <div className="flex items-center justify-end gap-2">
                    <span className="h-1.5 min-w-0 flex-1 rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-blue-600"
                        style={{ width: `${Math.min((row.scanCount / maxCount) * 100, 100)}%` }}
                      />
                    </span>
                    <span className="w-14 text-right">{formatNumber(row.scanCount)}건</span>
                  </div>
                </td>
                <td className="px-2 py-1.5 text-right text-xs font-black text-red-500">▲ {row.deltaPercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid grid-cols-5 border-t border-slate-100 px-4 py-1.5 text-xs font-bold text-slate-500">
          {[0, 200, 400, 600, 800].map((tick) => (
            <span className={tick === 0 ? 'text-left' : 'text-right'} key={tick}>
              {tick}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ScannedObjectsCard({ objects }: { objects: CultureScannedObject[] }) {
  return (
    <Card>
      <CompactHeader title="자주 스캔된 객체" />
      <div className="grid h-[calc(100%-32px)] grid-cols-2 grid-rows-3 gap-2">
        {objects.map((object) => {
          const Icon = objectIconById[object.icon];

          return (
            <div className="flex min-h-0 items-center gap-3 rounded-lg border border-slate-200 px-3 py-2" key={object.id}>
              <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-lg', objectToneClasses[object.tone])}>
                <Icon aria-hidden="true" size={24} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-black text-slate-900">{object.label}</p>
                <p className="mt-0.5 text-xl font-black leading-none tracking-normal text-slate-950">{formatNumber(object.count)}건</p>
                <p className="mt-0.5 text-xs font-bold text-slate-500">{object.percent.toFixed(1)}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function FrequentQuestionsCard({
  otherQuestion,
  questions,
}: {
  otherQuestion: Omit<CultureQuestion, 'rank'>;
  questions: CultureQuestion[];
}) {
  return (
    <Card>
      <CompactHeader title="자주 나온 질문" />
      <div className="overflow-hidden rounded-lg border border-slate-100">
        {questions.map((question) => (
          <div className="grid grid-cols-[32px_minmax(0,1fr)_76px_58px] items-center border-b border-slate-100 px-2 py-1.5" key={question.rank}>
            <RankBadge rank={question.rank} />
            <p className="truncate text-sm font-black text-slate-900">{question.question}</p>
            <p className="text-right text-sm font-black text-slate-900">{formatNumber(question.count)}건</p>
            <p className="text-right text-sm font-bold text-slate-600">{question.percent.toFixed(1)}%</p>
          </div>
        ))}
        <div className="grid grid-cols-[32px_minmax(0,1fr)_76px_58px] items-center px-2 py-1.5">
          <span />
          <p className="truncate text-sm font-bold text-slate-700">{otherQuestion.question}</p>
          <p className="text-right text-sm font-black text-slate-900">{formatNumber(otherQuestion.count)}건</p>
          <p className="text-right text-sm font-bold text-slate-600">{otherQuestion.percent.toFixed(1)}%</p>
        </div>
      </div>
    </Card>
  );
}

function LanguageDistributionCard({
  languages,
}: {
  languages: LanguageDistributionItem[];
}) {
  return (
    <Card>
      <CompactHeader title="언어별 질문 분포" />
      <div className="grid min-h-0 grid-cols-[210px_minmax(0,1fr)] items-center gap-3">
        <div className="relative mx-auto h-[188px] w-[188px]">
          <div className="absolute inset-[11px] rounded-full" style={{ background: buildDonutGradient(languages) }} />
          <div className="absolute inset-[54px] rounded-full bg-white shadow-inner shadow-slate-200/70" />
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-xs font-black text-slate-700">총 질문 수</p>
              <p className="text-xl font-black leading-tight tracking-normal text-slate-950">2,756건</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {languages.map((language) => (
            <div className="grid grid-cols-[minmax(0,1fr)_70px_48px] items-center gap-2 text-sm font-bold" key={language.language}>
              <span className="inline-flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: language.color }} />
                <span className="truncate text-slate-700">{language.language}</span>
              </span>
              <span className="text-right text-slate-900">{formatNumber(language.count)}건</span>
              <span className="text-right text-slate-600">{language.percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ConfusionTopCard({ signals }: { signals: CultureConfusionSignal[] }) {
  return (
    <Card>
      <CompactHeader title="외국인 혼란 신호 TOP 10" />
      <div className="overflow-hidden rounded-lg border border-slate-100">
        <table className="w-full table-fixed text-[11px] leading-4">
          <thead className="bg-slate-50 text-[11px] font-black text-slate-500">
            <tr>
              <th className="w-10 px-2 py-0.5 text-left">순위</th>
              <th className="px-2 py-1 text-left">혼란 신호 유형</th>
              <th className="w-20 px-2 py-0.5 text-right">건수</th>
              <th className="w-20 px-2 py-0.5 text-right">전일 대비</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
            {signals.map((signal) => (
              <tr key={signal.rank}>
                <td className="px-2 py-px">
                  <span className="inline-grid h-4 w-4 place-items-center rounded-full bg-slate-700 text-[9px] font-black text-white">
                    {signal.rank}
                  </span>
                </td>
                <td className="truncate px-2 py-px">{signal.type}</td>
                <td className="px-2 py-px text-right">{formatNumber(signal.count)}</td>
                <td className="px-2 py-px text-right font-black text-red-500">▲ {signal.deltaPercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function GuideImprovementCard({ improvements }: { improvements: CultureGuideImprovement[] }) {
  return (
    <Card>
      <CompactHeader title="장소별 안내 개선 필요도" />
      <div className="overflow-hidden rounded-lg border border-slate-100">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="w-12 px-2 py-1 text-left">순위</th>
              <th className="px-2 py-1 text-left">장소</th>
              <th className="w-28 px-2 py-1 text-right">혼란 신호 건수</th>
              <th className="w-28 px-2 py-1 text-center">개선 필요도</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
            {improvements.map((improvement) => (
              <tr key={improvement.rank}>
                <td className="px-2 py-1">
                  <RankBadge rank={improvement.rank} />
                </td>
                <td className="truncate px-2 py-1">{improvement.place}</td>
                <td className="px-2 py-1 text-right">
                  <span className="font-black text-red-500">{formatNumber(improvement.signalCount)}</span>건
                </td>
                <td className="px-2 py-1 text-center">
                  <span
                    className={cx(
                      'inline-flex h-6 min-w-14 items-center justify-center rounded-full border px-3 text-xs font-black',
                      needLevelClasses[improvement.needLevel],
                    )}
                  >
                    {improvement.needLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs font-bold text-slate-500">※ 혼란 신호 비율, 질문 증가율, 재발 빈도 종합 산정</p>
    </Card>
  );
}

function HotspotMapCard({ hotspots }: { hotspots: CultureQuestionHotspot[] }) {
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-base font-black leading-tight text-slate-950">질문이 급증하는 지역</h2>
          <span className="text-xs font-bold text-slate-500">(지난 24시간)</span>
          <Info aria-hidden="true" className="shrink-0 text-slate-400" size={15} />
        </div>
        <ViewAllButton label="전체 지도 보기" />
      </div>
      <div className="grid h-[calc(100%-32px)] min-h-0 grid-cols-[minmax(0,1fr)_300px] gap-3">
        <CultureHotspotLeafletMap hotspots={hotspots} />
        <div className="overflow-hidden rounded-lg border border-slate-100">
          {hotspots.map((hotspot) => (
            <div className="grid grid-cols-[28px_minmax(0,1fr)_56px] items-center border-b border-slate-100 px-3 py-2.5 last:border-b-0" key={hotspot.rank}>
              <RankBadge rank={hotspot.rank} />
              <p className="truncate text-sm font-black text-slate-900">{hotspot.place}</p>
              <p className="text-right text-sm font-black text-red-500">▲ {hotspot.increasePercent}%</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function SummaryCard({
  actionLabel,
  bullets,
  title,
}: {
  actionLabel: string;
  bullets: string[];
  title: string;
}) {
  return (
    <section className="min-h-0 rounded-lg border border-red-200 bg-red-50/40 p-4 shadow-sm">
      <h2 className="text-base font-black text-slate-950">{title}</h2>
      <div className="mt-4 flex min-h-0 items-center gap-5 rounded-lg border border-red-200 bg-white/70 p-5">
        <img alt="" className="h-16 w-16 shrink-0 object-contain" src={alertIcon} />
        <div className="min-w-0 flex-1">
          <ul className="space-y-2 text-sm font-bold leading-relaxed text-slate-800">
            {bullets.map((bullet) => (
              <li className="flex gap-2" key={bullet}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-700" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="inline-flex h-10 shrink-0 items-center gap-3 rounded-lg border border-red-300 bg-white px-5 text-sm font-black text-red-500"
          type="button"
        >
          {actionLabel}
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>
    </section>
  );
}

export function CultureInsightsPage() {
  const { data: snapshot, isLoading } = useQuery({
    queryFn: getCultureInsightsSnapshot,
    queryKey: ['culture-insights-snapshot'],
    placeholderData: getCultureInsightsSnapshotPreview,
  });

  if (isLoading || !snapshot) {
    return (
      <div className="grid h-[calc(100vh-96px)] place-items-center rounded-lg border border-slate-200 bg-white text-sm font-black text-slate-500">
        Culture Scan 집계 데이터를 불러오는 중입니다.
      </div>
    );
  }

  return (
    <div className="grid gap-3 xl:h-[calc(100vh-96px)] xl:min-h-[884px] xl:grid-rows-[40px_112px_250px_260px_minmax(0,1fr)] xl:overflow-hidden">
      <ControlStatusStrip
        apiUptime={snapshot.apiUptime}
        monitoredAreaCount={snapshot.monitoredAreaCount}
        receivedAreaCount={snapshot.receivedAreaCount}
        updatedAt={snapshot.updatedAt}
      />

      <section className="grid min-h-0 gap-3 md:grid-cols-2 xl:grid-cols-6">
        {snapshot.metrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid min-h-0 gap-3 xl:grid-cols-3">
        <PlaceScanCard rows={snapshot.placeScans} />
        <ScannedObjectsCard objects={snapshot.scannedObjects} />
        <FrequentQuestionsCard otherQuestion={snapshot.otherQuestion} questions={snapshot.frequentQuestions} />
      </section>

      <section className="grid min-h-0 gap-3 xl:grid-cols-3">
        <LanguageDistributionCard languages={snapshot.languageDistribution} />
        <ConfusionTopCard signals={snapshot.confusionSignals} />
        <GuideImprovementCard improvements={snapshot.guideImprovements} />
      </section>

      <section className="grid min-h-0 gap-3 xl:grid-cols-[1.1fr_0.9fr]">
        <HotspotMapCard hotspots={snapshot.questionHotspots} />
        <SummaryCard
          actionLabel={snapshot.summary.actionLabel}
          bullets={snapshot.summary.bullets}
          title={snapshot.summary.title}
        />
      </section>
    </div>
  );
}
