import { useQuery } from '@tanstack/react-query';
import { getOverviewMetrics } from '../../services/metricsApi';
import {
  type OverviewAssetIconKey,
  type OverviewDeltaTone,
  type OverviewTone,
} from '../../types/dashboard';

const iconAssets: Record<OverviewAssetIconKey, string> = {
  veryHigh: new URL('../../../asset/image-removebg-preview (11).png', import.meta.url).href,
  retrip: new URL('../../../asset/image-removebg-preview (6).png', import.meta.url).href,
  switch: new URL('../../../asset/image-removebg-preview (7).png', import.meta.url).href,
  culture: new URL('../../../asset/image-removebg-preview (8).png', import.meta.url).href,
  discover: new URL('../../../asset/image-removebg-preview (2).png', import.meta.url).href,
  cursor: new URL('../../../asset/2.png', import.meta.url).href,
  shield: new URL('../../../asset/image-removebg-preview (10).png', import.meta.url).href,
  warning: new URL('../../../asset/image-removebg-preview (1).png', import.meta.url).href,
  calendar: new URL('../../../asset/image-removebg-preview (13).png', import.meta.url).href,
  sync: new URL('../../../asset/image-removebg-preview (15).png', import.meta.url).href,
  check: new URL('../../../asset/image-removebg-preview (19).png', import.meta.url).href,
  chart: new URL('../../../asset/6.png', import.meta.url).href,
  megaphone: new URL('../../../asset/7.png', import.meta.url).href,
  database: new URL('../../../asset/5.png', import.meta.url).href,
  pencil: new URL('../../../asset/4.png', import.meta.url).href,
  clock: new URL('../../../asset/image-removebg-preview (4).png', import.meta.url).href,
};

const valueToneClasses: Record<OverviewTone, string> = {
  red: 'text-red-600',
  purple: 'text-violet-600',
  teal: 'text-cyan-600',
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
  orange: 'text-orange-600',
  amber: 'text-amber-600',
  slate: 'text-slate-700',
};

const dotToneClasses: Record<OverviewTone, string> = {
  red: 'bg-red-500',
  purple: 'bg-violet-500',
  teal: 'bg-cyan-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  slate: 'bg-slate-500',
};

const softToneClasses: Record<OverviewTone, string> = {
  red: 'border-red-200 bg-red-50 text-red-600',
  purple: 'border-violet-200 bg-violet-50 text-violet-600',
  teal: 'border-cyan-200 bg-cyan-50 text-cyan-600',
  blue: 'border-blue-200 bg-blue-50 text-blue-600',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-600',
  orange: 'border-orange-200 bg-orange-50 text-orange-600',
  amber: 'border-amber-200 bg-amber-50 text-amber-600',
  slate: 'border-slate-200 bg-slate-50 text-slate-600',
};

const flowToneClasses: Record<OverviewTone, string> = {
  red: 'from-red-500 to-red-200',
  purple: 'from-violet-500 to-violet-200',
  teal: 'from-cyan-500 to-cyan-100',
  blue: 'from-blue-500 to-blue-200',
  emerald: 'from-emerald-500 to-emerald-100',
  orange: 'from-orange-500 to-orange-200',
  amber: 'from-amber-400 to-amber-100',
  slate: 'from-slate-500 to-slate-200',
};

const funnelToneClasses: Record<OverviewTone, string> = {
  red: 'bg-red-500',
  purple: 'bg-violet-500',
  teal: 'bg-cyan-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-400',
  slate: 'bg-slate-500',
};

const rowToneClasses: Record<'red' | 'orange' | 'amber', string> = {
  red: 'border-red-200 bg-red-50/80 text-red-600',
  orange: 'border-orange-200 bg-orange-50/80 text-orange-600',
  amber: 'border-amber-200 bg-amber-50/80 text-amber-600',
};

const deltaToneClasses: Record<OverviewDeltaTone, string> = {
  danger: 'text-red-600',
  success: 'text-emerald-600',
  neutral: 'text-slate-500',
};

function IconImage({
  iconKey,
  className,
}: {
  iconKey: OverviewAssetIconKey;
  className: string;
}) {
  return <img alt="" aria-hidden="true" className={`object-contain ${className}`} draggable={false} src={iconAssets[iconKey]} />;
}

export function OverviewPage() {
  const { data } = useQuery({ queryKey: ['overview-metrics'], queryFn: getOverviewMetrics });

  if (!data) {
    return <div className="h-40 rounded-lg border border-slate-200 bg-white" />;
  }

  return (
    <div className="mx-auto flex w-full max-w-none flex-col gap-2 pb-2 2xl:grid 2xl:h-[calc(100vh-7rem)] 2xl:grid-rows-[auto_auto_minmax(0,1fr)_minmax(0,1fr)] 2xl:gap-3 2xl:pb-0">
      <section className="ml-auto flex min-h-9 w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-lg border border-slate-200 bg-white px-5 py-1.5 shadow-sm shadow-slate-200/60 xl:w-auto xl:justify-end 2xl:min-h-10 2xl:gap-x-7 2xl:px-7 2xl:py-2">
        {data.statusItems.map((item, index) => (
          <div className="flex items-center gap-2.5" key={item.id}>
            {index > 0 ? <span className="hidden h-5 w-px bg-slate-200 md:block" /> : null}
            <IconImage className="h-4 w-4 2xl:h-5 2xl:w-5" iconKey={item.iconKey} />
            <span className="font-admin-label text-[13px] text-slate-700 2xl:text-[14px]">{item.label}</span>
            <strong className="font-admin-metric text-[14px] font-black text-slate-950 2xl:text-[15px]">{item.value}</strong>
          </div>
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:min-h-0 2xl:gap-4">
        {data.metrics.map((metric) => (
          <article
            className="flex h-[102px] items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 py-3.5 shadow-sm shadow-slate-200/70 2xl:h-[112px] 2xl:gap-5 2xl:px-7 2xl:py-4"
            key={metric.id}
          >
            <IconImage className="h-[54px] w-[54px] shrink-0 2xl:h-[62px] 2xl:w-[62px]" iconKey={metric.iconKey} />
            <div className="min-w-0 flex-1">
              <h2 className="font-admin-label truncate text-[14px] text-slate-900 2xl:text-[16px]">{metric.title}</h2>
              <p className="mt-1.5 flex items-baseline gap-1.5 2xl:mt-2">
                <span className={`font-admin-metric text-[27px] font-black leading-none 2xl:text-[30px] ${valueToneClasses[metric.tone]}`}>
                  {metric.value}
                </span>
                <span className="font-admin-label text-[14px] text-slate-800 2xl:text-[16px]">{metric.unit}</span>
              </p>
              <p className="mt-2 flex items-center gap-4 text-[12px] 2xl:mt-2.5 2xl:text-[13px]">
                <span className="font-admin-caption text-slate-500">{metric.comparisonLabel}</span>
                <span className={`font-admin-metric font-black ${deltaToneClasses[metric.deltaTone]}`}>{metric.delta}</span>
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-3 xl:grid-cols-[1.25fr_0.82fr_1.08fr] 2xl:min-h-0 2xl:gap-4 2xl:grid-cols-[1.22fr_0.9fr_1.08fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/70 2xl:h-full 2xl:p-4">
          <h2 className="font-admin-title text-[16px] leading-none text-slate-950 2xl:text-[17px]">오늘 운영 우선순위 TOP 5</h2>
          <div className="mt-2.5 overflow-hidden rounded-lg border border-slate-100 2xl:mt-3">
            <table className="min-w-full border-separate border-spacing-0 text-[11.5px] 2xl:text-[12.5px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  {['순위', '지역', '문제 유형', '위험도', '추천 조치', '상태'].map((header) => (
                    <th className="border-b border-slate-200 px-3 py-2 text-left font-admin-label" key={header}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.priorities.map((priority) => (
                  <tr className="text-slate-800" key={priority.rank}>
                    <td className="border-b border-slate-100 px-3 py-2">
                      <span
                        className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-black text-white ${
                          priority.rank <= 3 ? 'bg-orange-500' : 'bg-slate-500'
                        }`}
                      >
                        {priority.rank}
                      </span>
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 font-admin-label">{priority.area}</td>
                    <td className="border-b border-slate-100 px-3 py-2 font-admin-caption text-slate-600">
                      {priority.issueType}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 font-admin-metric font-black">
                      {priority.riskScore}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 font-admin-caption text-slate-600">
                      {priority.recommendedAction}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      <span
                        className={`inline-flex h-6 items-center rounded-md border px-2 font-admin-label text-[11px] 2xl:text-[12px] ${
                          softToneClasses[priority.statusTone]
                        }`}
                      >
                        {priority.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/70 2xl:h-full 2xl:p-4">
          <h2 className="font-admin-title text-[16px] leading-none text-slate-950 2xl:text-[17px]">서울 운영 스냅샷</h2>
          <div className="mt-2.5 grid h-[198px] grid-cols-[124px_1fr] gap-3 rounded-lg border border-slate-100 p-2.5 2xl:mt-3 2xl:h-[210px] 2xl:grid-cols-[142px_1fr] 2xl:gap-4 2xl:p-3">
            <div className="flex flex-col justify-between">
              <div className="px-0.5 py-1 2xl:px-1 2xl:py-1.5">
                <div className="flex items-center gap-2">
                  <IconImage className="h-6 w-6 2xl:h-8 2xl:w-8" iconKey="check" />
                  <div>
                    <p className="font-admin-caption text-[11px] text-slate-500 2xl:text-[12px]">{data.snapshot.totalAreasLabel}</p>
                    <p className="whitespace-nowrap font-admin-label text-[13px] text-emerald-600 2xl:text-[16px]">
                      {data.snapshot.healthyAreasLabel}
                    </p>
                  </div>
                </div>
              </div>
              <ul className="space-y-1.5 2xl:space-y-2">
                {data.snapshot.segments.map((segment) => (
                  <li className="flex items-center justify-between gap-3 text-[11.5px] 2xl:text-[13px]" key={segment.id}>
                    <span className="flex items-center gap-2 font-admin-caption text-slate-600">
                      <span className={`h-2 w-2 rounded-full 2xl:h-2.5 2xl:w-2.5 ${dotToneClasses[segment.tone]}`} />
                      {segment.label}
                    </span>
                    <strong className="font-admin-metric text-slate-900">{segment.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid place-items-center">
              <div
                className="relative grid h-36 w-36 place-items-center rounded-full 2xl:h-40 2xl:w-40"
                style={{
                  background:
                    'conic-gradient(#ef4444 0 7%, #f97316 7% 19%, #f59e0b 19% 49%, #10b981 49% 100%)',
                }}
              >
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center shadow-inner 2xl:h-[86px] 2xl:w-[86px]">
                  <div>
                    <IconImage className="mx-auto h-6 w-6 opacity-80 2xl:h-7 2xl:w-7" iconKey="chart" />
                    <p className="mt-1 font-admin-caption text-[11px] text-slate-500 2xl:text-[12px]">정상 수신율</p>
                    <p className="font-admin-metric text-[18px] font-black text-emerald-600 2xl:text-[20px]">
                      {data.snapshot.collectionRate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/70 2xl:h-full 2xl:p-4">
          <h2 className="font-admin-title text-[16px] leading-none text-slate-950 2xl:text-[17px]">즉시 조치 필요</h2>
          <div className="mt-2.5 space-y-2.5 2xl:mt-3">
            {data.actions.map((action) => (
              <div className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 2xl:px-4 2xl:py-3 ${rowToneClasses[action.tone]}`} key={action.id}>
                <IconImage className="h-8 w-8 shrink-0 2xl:h-9 2xl:w-9" iconKey={action.iconKey} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-admin-label text-[14px] text-slate-900 2xl:text-[15px]">{action.title}</p>
                  <p className="mt-1 truncate font-admin-caption text-[12px] text-slate-600 2xl:text-[13px]">{action.description}</p>
                </div>
                <button
                  className="inline-flex h-8 shrink-0 items-center gap-2 rounded-md border border-current bg-white px-3 font-admin-label text-[12px] 2xl:h-9 2xl:px-4 2xl:text-[13px]"
                  type="button"
                >
                  대응 조치 보기
                  <span aria-hidden="true" className="text-lg leading-none">
                    &gt;
                  </span>
                </button>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-3 xl:grid-cols-[0.95fr_1.02fr_1.12fr] 2xl:min-h-0 2xl:gap-4">
        <article className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm shadow-slate-200/70 2xl:h-full 2xl:p-4">
          <h2 className="font-admin-title text-[16px] leading-none text-slate-950 2xl:text-[17px]">NoriGo 분산 효과</h2>
          <div className="mt-2 space-y-1 2xl:mt-3 2xl:space-y-1.5">
            {data.flowItems.map((item) => (
              <div className="grid grid-cols-[45%_55%] items-center" key={item.id}>
                <div className={`flex h-7 items-center rounded-l-sm bg-gradient-to-r px-5 2xl:h-10 ${flowToneClasses[item.tone]}`}>
                  <IconImage className="h-5 w-5 brightness-0 invert 2xl:h-6 2xl:w-6" iconKey={item.iconKey} />
                </div>
                <div className="flex h-7 items-center justify-between border-b border-slate-100 px-4 2xl:h-10">
                  <span className="font-admin-caption text-[11.5px] text-slate-600 2xl:text-[13px]">{item.label}</span>
                  <strong className={`font-admin-metric text-[14px] 2xl:text-[16px] ${item.id === 'overload' ? 'text-emerald-600' : 'text-slate-950'}`}>
                    {item.value}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm shadow-slate-200/70 2xl:h-full 2xl:p-4">
          <h2 className="font-admin-title text-[16px] leading-none text-slate-950 2xl:text-[17px]">앱 반응 패널</h2>
          <div className="mt-2 grid grid-cols-[0.9fr_1fr] gap-5 2xl:mt-3">
            <div className="flex h-[170px] flex-col items-center justify-center gap-1 2xl:h-[230px] 2xl:gap-1.5">
              {data.funnelSteps.map((step) => (
                <div
                  className={`h-6 2xl:h-8 ${funnelToneClasses[step.tone]}`}
                  key={step.id}
                  style={{
                    clipPath: 'polygon(10% 0, 90% 0, 78% 100%, 22% 100%)',
                    width: `${step.widthPercent}%`,
                  }}
                />
              ))}
            </div>
            <ul className="space-y-1 2xl:space-y-2">
              {data.funnelSteps.map((step) => (
                <li className="flex items-center justify-between gap-4 border-b border-slate-100 pb-1 text-[11.5px] 2xl:pb-2 2xl:text-[13px]" key={step.id}>
                  <span className="flex min-w-0 items-center gap-2 font-admin-caption text-slate-600">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${dotToneClasses[step.tone]}`} />
                    <span className="truncate">{step.label}</span>
                  </span>
                  <strong className="font-admin-metric text-[14px] text-slate-950 2xl:text-[16px]">{step.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm shadow-slate-200/70 2xl:h-full 2xl:p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-admin-title text-[16px] leading-none text-slate-950 2xl:text-[17px]">최근 운영 로그</h2>
            <button className="font-admin-label text-[12px] text-blue-600 2xl:text-[13px]" type="button">
              전체 보기 &gt;
            </button>
          </div>
          <div className="mt-1.5 rounded-lg border border-slate-100 px-3 py-0.5 2xl:mt-3 2xl:py-1">
            {data.logs.map((log) => (
              <div className="grid grid-cols-[48px_28px_1fr] gap-2.5 border-b border-slate-100 py-1.5 last:border-b-0 2xl:grid-cols-[54px_34px_1fr] 2xl:gap-3 2xl:py-2" key={log.id}>
                <time className="font-admin-metric text-[11px] text-slate-600 2xl:text-[13px]">{log.time}</time>
                <span className={`grid h-6 w-6 place-items-center rounded-full border 2xl:h-8 2xl:w-8 ${softToneClasses[log.tone]}`}>
                  <IconImage className="h-3.5 w-3.5 2xl:h-5 2xl:w-5" iconKey={log.iconKey} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-admin-label text-[11px] leading-tight text-slate-950 2xl:text-[13px]">
                    {log.actor} / {log.title}
                  </p>
                  <p className="mt-0.5 truncate font-admin-caption text-[10px] leading-tight text-slate-500 2xl:mt-1 2xl:text-[12px]">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
