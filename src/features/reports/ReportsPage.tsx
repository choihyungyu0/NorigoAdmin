import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  Download,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  MoreVertical,
  RefreshCw,
  Settings,
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
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getReportsDashboard, getReportsDashboardSnapshot } from '../../services/reportsApi';
import {
  type CongestionAreaReport,
  type CultureQuestionReport,
  type GeneratedReport,
  type ReportMetric,
  type ReportPreviewItem,
  type ReportStatusItem,
  type ReportTemplate,
  type ReportTone,
  type RetripEffectPoint,
} from '../../types/reports';

const metricIconAssets: Record<ReportMetric['iconKey'], string> = {
  alert: new URL('../../../asset/image-removebg-preview (5).png', import.meta.url).href,
  retrip: new URL('../../../asset/image-removebg-preview (6).png', import.meta.url).href,
  switch: new URL('../../../asset/image-removebg-preview (7).png', import.meta.url).href,
  culture: new URL('../../../asset/image-removebg-preview (8).png', import.meta.url).href,
  document: new URL('../../../asset/image-Photoroom (38).png', import.meta.url).href,
  success: new URL('../../../asset/image-removebg-preview (10).png', import.meta.url).href,
};

const reportCoverImage = new URL('../../../asset/a34420e0-119e-4642-b5c8-439d1ce5b399.png', import.meta.url).href;

const toneText: Record<ReportTone, string> = {
  danger: 'text-red-500',
  purple: 'text-violet-600',
  teal: 'text-cyan-600',
  blue: 'text-blue-600',
  orange: 'text-orange-500',
  green: 'text-emerald-600',
  slate: 'text-slate-800',
};

const toneBg: Record<ReportTone, string> = {
  danger: 'border-red-200 bg-red-50 text-red-500',
  purple: 'border-violet-200 bg-violet-50 text-violet-600',
  teal: 'border-cyan-200 bg-cyan-50 text-cyan-600',
  blue: 'border-blue-200 bg-blue-50 text-blue-600',
  orange: 'border-orange-200 bg-orange-50 text-orange-500',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
};

const statusIcons: Record<Exclude<ReportStatusItem['iconKey'], 'dot'>, LucideIcon> = {
  refresh: RefreshCw,
  calendar: CalendarCheck,
  api: Activity,
};

const templateIcons: Record<ReportTemplate['iconKey'], LucideIcon> = {
  daily: CalendarCheck,
  weekly: CalendarCheck,
  monthly: CalendarDays,
  csv: FileSpreadsheet,
  pdf: FileText,
};

function deltaClass(deltaTone: ReportMetric['deltaTone'] | CongestionAreaReport['deltaTone']) {
  if (deltaTone === 'success') {
    return 'text-cyan-600';
  }

  if (deltaTone === 'neutral') {
    return 'text-blue-600';
  }

  return 'text-red-500';
}

function rankClass(rank: number) {
  if (rank === 1) {
    return 'bg-red-600';
  }

  if (rank === 2) {
    return 'bg-red-500';
  }

  if (rank === 3) {
    return 'bg-orange-500';
  }

  return 'bg-slate-600';
}

function SectionTitle({ title, actionLabel }: { title: string; actionLabel?: string }) {
  return (
    <div className="mb-2 flex h-5 items-center justify-between gap-3">
      <h2 className="truncate text-[17px] font-black leading-none tracking-normal text-slate-950">{title}</h2>
      {actionLabel ? (
        <button className="inline-flex shrink-0 items-center gap-0.5 text-xs font-black text-blue-600" type="button">
          {actionLabel}
          <ChevronRight aria-hidden="true" size={15} />
        </button>
      ) : null}
    </div>
  );
}

function NoriGoLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center ${compact ? 'gap-1.5' : 'gap-2.5'}`}>
      <span className={`relative shrink-0 ${compact ? 'h-4 w-4' : 'h-7 w-7'}`}>
        <span className="absolute left-0.5 top-[38%] h-[45%] w-[34%] rounded-[2px] bg-amber-400" />
        <span className="absolute left-[34%] top-[8%] h-[76%] w-[34%] rounded-[2px] bg-blue-500" />
        <span className="absolute left-[60%] top-0 h-[86%] w-[34%] rounded-[2px] bg-emerald-500" />
      </span>
      <span className={`${compact ? 'text-[10px]' : 'text-[18px]'} font-black leading-none tracking-normal text-blue-600`}>
        NoriGo
      </span>
    </div>
  );
}

function StatusStrip({ items }: { items: ReportStatusItem[] }) {
  return (
    <Card className="ml-auto h-10 w-full max-w-[1040px] rounded-xl px-5 py-0 [@media(min-height:1000px)]:h-12">
      <div className="grid h-full grid-cols-2 items-center gap-0 text-[13px] font-black text-slate-900 lg:grid-cols-[1.12fr_0.9fr_1.04fr_0.78fr]">
        {items.map((item, index) => {
          const Icon = item.iconKey === 'dot' ? null : statusIcons[item.iconKey];
          const iconClass = item.tone === 'teal' ? 'text-cyan-600' : item.tone === 'blue' ? 'text-blue-600' : 'text-slate-600';

          return (
            <div
              className={`flex min-w-0 items-center justify-center gap-2 px-2 ${index > 0 ? 'lg:border-l lg:border-slate-200' : ''}`}
              key={item.id}
            >
              {Icon ? <Icon aria-hidden="true" className={iconClass} size={16} /> : <span className="h-3 w-3 rounded-full bg-emerald-500" />}
              <span className="truncate">{item.label}</span>
              {item.value ? <strong className="whitespace-nowrap text-base leading-none text-slate-950">{item.value}</strong> : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function MetricTile({ metric }: { metric: ReportMetric }) {
  const iconAsset = metricIconAssets[metric.iconKey];

  return (
    <Card className="flex h-[104px] items-center rounded-xl p-4 [@media(min-height:1000px)]:h-[118px]">
      <div className="mr-4 flex h-[60px] w-[60px] shrink-0 items-center justify-center [@media(min-height:1000px)]:h-[72px] [@media(min-height:1000px)]:w-[72px]">
        <img
          alt=""
          aria-hidden="true"
          className="h-[60px] w-[60px] object-contain drop-shadow-[0_8px_12px_rgba(15,23,42,0.10)] [@media(min-height:1000px)]:h-[68px] [@media(min-height:1000px)]:w-[68px]"
          src={iconAsset}
        />
      </div>
      <div className="min-w-0">
        <p className="font-admin-label truncate text-[14px] leading-none text-slate-950">{metric.label}</p>
        <p className={`font-admin-metric mt-2 truncate text-[29px] font-extrabold leading-none tracking-normal ${toneText[metric.tone]}`}>
          {metric.value}
          {metric.unit ? <span className="font-admin-label ml-2 text-[15px] text-slate-900">{metric.unit}</span> : null}
        </p>
        <p className="font-admin-caption mt-2 text-[13px] leading-none text-slate-600">
          {metric.helper}
          <span className={`font-admin-metric ml-4 text-[11px] font-extrabold ${deltaClass(metric.deltaTone)}`}>{metric.delta}</span>
        </p>
      </div>
    </Card>
  );
}

function TemplateTile({ template }: { template: ReportTemplate }) {
  const Icon = templateIcons[template.iconKey];

  return (
    <button
      className="flex h-[74px] min-w-0 items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
      type="button"
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md border bg-white ${toneBg[template.tone]}`}>
        <Icon aria-hidden="true" size={27} strokeWidth={2.5} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-base font-black leading-none text-slate-950">{template.title}</span>
        <span className="mt-2 block truncate text-sm font-bold leading-none text-slate-500">{template.description}</span>
      </span>
    </button>
  );
}

function ReportGenerator({ templates }: { templates: ReportTemplate[] }) {
  return (
    <Card className="h-[132px] rounded-xl p-4">
      <div className="mb-3 flex h-9 items-center justify-between gap-3">
        <h2 className="text-lg font-black leading-none tracking-normal text-slate-950">리포트 생성</h2>
        <div className="flex items-center gap-2">
          <Button className="h-10 w-[132px] rounded-lg" variant="primary">
            리포트 생성
          </Button>
          <Button className="h-10 rounded-lg border-blue-200 text-blue-600" variant="secondary">
            <Settings aria-hidden="true" size={17} />
            자동 발송 설정
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {templates.map((template) => (
          <TemplateTile key={template.id} template={template} />
        ))}
      </div>
    </Card>
  );
}

function PreviewDot({ tone }: { tone: ReportTone }) {
  const dotClass: Record<ReportTone, string> = {
    danger: 'bg-red-500',
    purple: 'bg-violet-600',
    teal: 'bg-cyan-600',
    blue: 'bg-blue-600',
    orange: 'bg-orange-500',
    green: 'bg-emerald-600',
    slate: 'bg-slate-600',
  };

  return <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass[tone]}`} />;
}

function ReportCover({ generatedAtLabel }: { generatedAtLabel: string }) {
  return (
    <div className="relative h-[204px] w-[148px] overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm [@media(min-height:1000px)]:h-[235px] [@media(min-height:1000px)]:w-[174px]">
      <div className="relative z-10 p-4 [@media(min-height:1000px)]:p-5">
        <NoriGoLogo compact />
        <p className="mt-7 text-[13px] font-black text-slate-900 [@media(min-height:1000px)]:mt-8 [@media(min-height:1000px)]:text-sm">Daily Report</p>
        <p className="mt-2 text-[10px] font-bold text-slate-600">{generatedAtLabel}</p>
        <p className="mt-3 text-[10px] font-bold text-slate-600">서울시 관광 운영팀</p>
      </div>
      <img alt="" aria-hidden="true" className="absolute bottom-0 left-0 h-[96px] w-full object-cover [@media(min-height:1000px)]:h-[116px]" src={reportCoverImage} />
      <div className="absolute bottom-0 left-0 h-[110px] w-full bg-gradient-to-t from-blue-200/80 via-blue-50/70 to-white/20 [@media(min-height:1000px)]:h-[132px]" />
      <div className="absolute bottom-0 left-0 h-14 w-full bg-white/35" />
    </div>
  );
}

function ReportPreviewCard({
  generatedAtLabel,
  items,
  reportTitle,
}: {
  generatedAtLabel: string;
  items: ReportPreviewItem[];
  reportTitle: string;
}) {
  return (
    <Card className="h-[315px] rounded-xl p-4 [@media(min-height:1000px)]:h-[360px]">
      <SectionTitle title="리포트 미리보기" />
      <div className="flex gap-5">
        <div className="shrink-0">
          <ReportCover generatedAtLabel={generatedAtLabel} />
          <button
            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-sm font-black text-slate-700 [@media(min-height:1000px)]:h-10"
            type="button"
          >
            미리보기 열기
            <FileBarChart aria-hidden="true" size={16} />
          </button>
        </div>
        <div className="min-w-0 pt-2">
          <h3 className="truncate text-[22px] font-black leading-none tracking-normal text-slate-950">{reportTitle}</h3>
          <div className="mt-7 space-y-4 [@media(min-height:1000px)]:space-y-5">
            {items.map((item) => (
              <div className="grid grid-cols-[16px_minmax(0,1fr)_auto] items-center gap-3 text-base font-bold" key={item.id}>
                <PreviewDot tone={item.tone} />
                <span className="truncate text-slate-900">{item.label}</span>
                <span className={`whitespace-nowrap font-black ${toneText[item.tone]}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function TopAreasPanel({ rows }: { rows: CongestionAreaReport[] }) {
  return (
    <Card className="h-[262px] rounded-xl p-3 [@media(min-height:1000px)]:h-[320px]">
      <SectionTitle actionLabel="전체 보기" title="혼잡 TOP 지역" />
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="grid h-7 grid-cols-[48px_1fr_100px_74px] items-center bg-slate-50 px-3 text-xs font-black text-slate-600">
          <span>순위</span>
          <span>지역</span>
          <span className="text-right">혼잡도 점수</span>
          <span className="text-right">전일 대비</span>
        </div>
        {rows.map((row) => (
          <div
            className="grid h-[34px] grid-cols-[48px_1fr_100px_74px] items-center border-t border-slate-200 px-3 text-sm font-black [@media(min-height:1000px)]:h-[45px]"
            key={row.id}
          >
            <span className={`grid h-6 w-6 place-items-center rounded-full text-xs text-white ${rankClass(row.rank)}`}>{row.rank}</span>
            <span className="truncate text-slate-900">{row.areaName}</span>
            <span className="text-right text-red-500">
              {row.score}
              <span className="ml-0.5 text-xs text-slate-600">/100</span>
            </span>
            <span className={`text-right text-xs ${deltaClass(row.deltaTone)}`}>{row.delta}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RetripEffectPanel({ data }: { data: RetripEffectPoint[] }) {
  return (
    <Card className="h-[262px] rounded-xl p-3 [@media(min-height:1000px)]:h-[320px]">
      <SectionTitle actionLabel="전체 보기" title="Re-Trip 효과" />
      <div className="mb-1 flex justify-center gap-8 text-xs font-black text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 bg-blue-600" />
          Re-Trip 발생 건수 (건)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 bg-cyan-600" />
          대체 전환 건수 (건)
        </span>
      </div>
      <div className="h-[198px] [@media(min-height:1000px)]:h-[258px]">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data} margin={{ bottom: 0, left: 0, right: 8, top: 8 }}>
            <CartesianGrid stroke="#e2e8f0" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="time"
              interval={3}
              tick={{ fill: '#334155', fontSize: 12, fontWeight: 800 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[0, 2500]}
              tick={{ fill: '#334155', fontSize: 12, fontWeight: 800 }}
              tickFormatter={(value: number) => value.toLocaleString('ko-KR')}
              tickLine={false}
              ticks={[0, 500, 1000, 1500, 2000, 2500]}
              width={64}
              yAxisId="left"
            />
            <YAxis
              axisLine={false}
              domain={[0, 2500]}
              orientation="right"
              tick={{ fill: '#0891b2', fontSize: 12, fontWeight: 800 }}
              tickFormatter={(value: number) => value.toLocaleString('ko-KR')}
              tickLine={false}
              ticks={[0, 500, 1000, 1500, 2000, 2500]}
              width={54}
              yAxisId="right"
            />
            <Tooltip formatter={(value) => (typeof value === 'number' ? value.toLocaleString('ko-KR') : String(value ?? ''))} />
            <Line
              dataKey="retripCount"
              dot={{ fill: '#2563eb', r: 3 }}
              name="Re-Trip 발생 건수"
              stroke="#2563eb"
              strokeWidth={3}
              type="monotone"
              yAxisId="left"
            />
            <Line
              dataKey="switchCount"
              dot={{ fill: '#0891b2', r: 3 }}
              name="대체 전환 건수"
              stroke="#0891b2"
              strokeWidth={3}
              type="monotone"
              yAxisId="right"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function CultureQuestionsPanel({ rows }: { rows: CultureQuestionReport[] }) {
  return (
    <Card className="h-[185px] rounded-xl p-3 [@media(min-height:1000px)]:h-[250px]">
      <SectionTitle actionLabel="전체 보기" title="문화 질문 TOP" />
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="grid h-7 grid-cols-[48px_1fr_66px] items-center bg-slate-50 px-3 text-xs font-black text-slate-600">
          <span>순위</span>
          <span>질문</span>
          <span className="text-right">질문 수</span>
        </div>
        {rows.map((row) => (
          <div className="grid h-[23px] grid-cols-[48px_1fr_66px] items-center border-t border-slate-200 px-3 text-[13px] font-black [@media(min-height:1000px)]:h-[35px] [@media(min-height:1000px)]:text-sm" key={row.id}>
            <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] text-white ${rankClass(row.rank)}`}>{row.rank}</span>
            <span className="truncate text-slate-900">{row.question}</span>
            <span className="text-right text-slate-950">{row.count.toLocaleString('ko-KR')}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function FormatIcon({ report }: { report: GeneratedReport }) {
  const isPdf = report.format === 'PDF';
  const Icon = isPdf ? FileText : FileSpreadsheet;

  return (
    <span className={`inline-flex items-center gap-2 font-black ${isPdf ? 'text-red-500' : 'text-emerald-600'}`}>
      <Icon aria-hidden="true" size={16} />
      {report.format}
    </span>
  );
}

function RecentReportsPanel({ rows }: { rows: GeneratedReport[] }) {
  return (
    <Card className="h-[240px] rounded-xl p-0 [@media(min-height:1000px)]:h-[285px]">
      <div className="flex h-10 items-center justify-between px-4">
        <h2 className="truncate text-lg font-black leading-none tracking-normal text-slate-950">최근 생성 리포트</h2>
        <button className="inline-flex shrink-0 items-center gap-0.5 text-xs font-black text-blue-600" type="button">
          전체 보기
          <ChevronRight aria-hidden="true" size={15} />
        </button>
      </div>
      <div className="grid h-8 grid-cols-[1.35fr_0.9fr_0.48fr_0.52fr_0.5fr_84px] items-center border-y border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-600">
        <span>리포트 이름</span>
        <span>생성 시간</span>
        <span>형식</span>
        <span>파일 크기</span>
        <span className="text-center">상태</span>
        <span className="text-center">작업</span>
      </div>
      {rows.map((report) => (
        <div
          className="grid h-[33px] grid-cols-[1.35fr_0.9fr_0.48fr_0.52fr_0.5fr_84px] items-center border-b border-slate-100 px-4 text-[13px] font-bold text-slate-700 [@media(min-height:1000px)]:h-[42px] [@media(min-height:1000px)]:text-sm"
          key={report.id}
        >
          <span className="flex min-w-0 items-center gap-3">
            <FileBarChart aria-hidden="true" className="shrink-0 text-slate-400" size={17} />
            <span className="truncate">{report.fileName}</span>
          </span>
          <span className="truncate">{report.createdAt}</span>
          <FormatIcon report={report} />
          <span>{report.fileSize}</span>
          <span className="text-center">
            <span className="inline-flex h-6 min-w-[50px] items-center justify-center rounded-full bg-emerald-50 px-3 text-xs font-black text-emerald-600">
              {report.status}
            </span>
          </span>
          <span className="flex items-center justify-center gap-3 text-slate-600">
            <button className="grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100" type="button" aria-label={`${report.fileName} 다운로드`}>
              <Download aria-hidden="true" size={15} />
            </button>
            <button className="grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100" type="button" aria-label={`${report.fileName} 메뉴`}>
              <MoreVertical aria-hidden="true" size={16} />
            </button>
          </span>
        </div>
      ))}
    </Card>
  );
}

export function ReportsPage() {
  const { data } = useQuery({
    queryKey: ['reports-dashboard'],
    queryFn: getReportsDashboard,
    initialData: getReportsDashboardSnapshot,
  });

  return (
    <div className="mx-auto w-full max-w-[1608px] space-y-[10px] [@media(min-height:1000px)]:space-y-3">
      <StatusStrip items={data.statusItems} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        {data.metrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} />
        ))}
      </div>

      <ReportGenerator templates={data.templates} />

      <div className="grid gap-3 xl:grid-cols-[466px_minmax(0,1fr)]">
        <div className="space-y-[10px] [@media(min-height:1000px)]:space-y-3">
          <ReportPreviewCard generatedAtLabel={data.generatedAtLabel} items={data.previewItems} reportTitle={data.reportTitle} />
          <CultureQuestionsPanel rows={data.cultureQuestions} />
        </div>
        <div className="space-y-[10px] [@media(min-height:1000px)]:space-y-3">
          <div className="grid gap-3 xl:grid-cols-[386px_minmax(0,1fr)]">
            <TopAreasPanel rows={data.topAreas} />
            <RetripEffectPanel data={data.retripEffect} />
          </div>
          <RecentReportsPanel rows={data.generatedReports} />
        </div>
      </div>
    </div>
  );
}
