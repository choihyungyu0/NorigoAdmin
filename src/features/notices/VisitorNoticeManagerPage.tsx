import { useQuery } from '@tanstack/react-query';
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
import bukchonPreviewImage from '../../../asset/a34420e0-119e-4642-b5c8-439d1ce5b399.png';
import statusCheckIcon from '../../../asset/image-Photoroom (11).png';
import statusRefreshIcon from '../../../asset/image-Photoroom (12).png';
import calendarIcon from '../../../asset/image-Photoroom (40).png';
import sendIcon from '../../../asset/image-Photoroom (52).png';
import cursorIcon from '../../../asset/image-Photoroom (53).png';
import clockIcon from '../../../asset/image-Photoroom (54).png';
import refreshIcon from '../../../asset/image-Photoroom (55).png';
import globeIcon from '../../../asset/image-Photoroom (56).png';
import alertIcon from '../../../asset/image-Photoroom (57).png';
import { getNoticeManagerSnapshot } from '../../services/noticesApi';
import {
  type NoticeDeliveryRecord,
  type NoticeDeliveryStatus,
  type NoticeKpi,
  type NoticeKpiIcon,
  type NoticeKpiTone,
} from '../../types/notices';

const kpiIcons: Record<NoticeKpiIcon, string> = {
  alert: alertIcon,
  clock: clockIcon,
  cursor: cursorIcon,
  globe: globeIcon,
  refresh: refreshIcon,
  send: sendIcon,
};

const kpiToneClasses: Record<NoticeKpiTone, string> = {
  amber: 'text-amber-500',
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  purple: 'text-violet-600',
  red: 'text-red-500',
  teal: 'text-cyan-600',
};

const statusClasses: Record<NoticeDeliveryStatus, string> = {
  cancelled: 'bg-slate-100 text-slate-600',
  failed: 'bg-red-50 text-red-600',
  sent: 'bg-emerald-50 text-emerald-700',
};

const statusLabels: Record<NoticeDeliveryStatus, string> = {
  cancelled: '취소',
  failed: '실패',
  sent: '발송 완료',
};

function formatNumber(value: number | null) {
  return value === null ? '-' : value.toLocaleString('ko-KR');
}

function formatPercent(value: number | null) {
  return value === null ? '-' : `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function ImageIcon({ className, src }: { className: string; src: string }) {
  return <img alt="" aria-hidden="true" className={`${className} shrink-0 object-contain`} src={src} />;
}

function InfoDot() {
  return (
    <span
      aria-hidden="true"
      className="inline-grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full border border-slate-300 text-[11px] font-black leading-none text-slate-400"
    >
      i
    </span>
  );
}

function KpiCard({ item }: { item: NoticeKpi }) {
  const iconSrc = kpiIcons[item.icon];
  const trendPrefix = item.deltaDirection === 'up' ? '▲' : item.deltaDirection === 'down' ? '▼' : '';

  return (
    <section className="h-[124px] rounded-lg border border-slate-200 bg-white px-6 py-5 shadow-sm shadow-slate-200/50">
      <div className="flex h-full items-center gap-5">
        <ImageIcon className="h-[58px] w-[58px] drop-shadow-sm" src={iconSrc} />
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[14px] font-black leading-tight text-slate-950">{item.label}</p>
          <p className={`mt-1 text-[34px] font-black leading-none tracking-normal ${kpiToneClasses[item.tone]}`}>
            {item.value}
            <span className="ml-1 text-xl font-black">{item.unit}</span>
          </p>
          <p className="mt-2 text-[13px] font-bold text-slate-500">
            {item.baseline}
            <span
              className={
                item.deltaTone === 'good'
                  ? 'ml-3 font-black text-emerald-600'
                  : item.deltaTone === 'bad'
                    ? 'ml-3 font-black text-red-500'
                    : 'ml-3 font-black text-slate-500'
              }
            >
              {trendPrefix} {item.delta}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: NoticeDeliveryStatus }) {
  return (
    <span className={`inline-flex h-6 items-center whitespace-nowrap rounded-md px-2 text-xs font-black ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <span className="pt-2 text-[13px] font-black text-slate-700">{children}</span>;
}

function NoticeComposer() {
  return (
    <section className="h-[632px] rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <h2 className="text-xl font-black text-slate-950">공지 작성</h2>

      <div className="mt-4 grid gap-3">
        <div className="grid grid-cols-[86px_1fr] gap-4">
          <FieldLabel>대상 지역</FieldLabel>
          <div>
            <label className="block">
              <span className="sr-only">대상 지역</span>
              <select
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm outline-none"
                defaultValue="bukchon"
              >
                <option value="bukchon">북촌한옥마을</option>
                <option value="myeongdong">명동 관광특구</option>
                <option value="hongdae">홍대 걷고싶은거리</option>
              </select>
            </label>
            <p className="mt-1.5 text-[11px] font-bold leading-tight text-slate-400">
              지역 단위의 집계 대상에게만 발송됩니다. (개별 사용자 추적 아님)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[86px_1fr] gap-4">
          <FieldLabel>조건</FieldLabel>
          <div className="flex items-center gap-1.5">
            <input
              className="h-10 w-[100px] rounded-md border border-slate-300 px-3 text-sm font-bold text-slate-800 outline-none"
              defaultValue="risk_score"
              aria-label="조건 지표"
            />
            <select
              className="h-10 w-[64px] rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-slate-800 outline-none"
              defaultValue="gte"
              aria-label="조건 연산자"
            >
              <option value="gte">&gt;=</option>
              <option value="lte">&lt;=</option>
            </select>
            <input
              className="h-10 w-[52px] rounded-md border border-slate-300 px-3 text-sm font-bold text-slate-800 outline-none"
              defaultValue="85"
              aria-label="조건 값"
            />
            <span className="text-sm font-black text-slate-700">반경</span>
            <select
              className="h-10 w-[76px] rounded-md border border-slate-300 bg-white px-2 text-sm font-bold text-slate-800 outline-none"
              defaultValue="500"
              aria-label="반경"
            >
              <option value="500">500m</option>
              <option value="700">700m</option>
              <option value="1000">1km</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-[86px_1fr] gap-4">
          <FieldLabel>대상 유형</FieldLabel>
          <div className="flex gap-2">
            <button className="h-10 rounded-md border border-blue-600 bg-blue-50 px-4 text-sm font-black text-blue-700" type="button">
              관광객
            </button>
            <button className="h-10 rounded-md border border-blue-600 bg-blue-50 px-4 text-sm font-black text-blue-700" type="button">
              외국인
            </button>
            <select
              className="h-10 min-w-[138px] rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-slate-800 outline-none"
              defaultValue="all"
              aria-label="세부 대상"
            >
              <option value="all">전체</option>
              <option value="culture">문화 체험 관심</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-[86px_1fr] gap-4">
          <FieldLabel>언어 선택</FieldLabel>
          <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-700">
            {['한국어', 'English', '日本語', '中文'].map((language) => (
              <label className="inline-flex items-center gap-1.5" key={language}>
                <input className="h-4 w-4 accent-blue-600" defaultChecked type="checkbox" />
                {language}
              </label>
            ))}
            <button className="ml-auto h-8 rounded-md border border-slate-300 px-3 text-xs font-black text-slate-600" type="button">
              전체 선택
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[86px_1fr] gap-4">
          <FieldLabel>발송 방식</FieldLabel>
          <div>
            <div className="flex items-center gap-8 text-sm font-black text-slate-700">
              <label className="inline-flex items-center gap-2">
                <input className="h-5 w-5 accent-blue-600" defaultChecked name="send-type" type="radio" />
                즉시 발송
              </label>
              <label className="inline-flex items-center gap-2">
                <input className="h-5 w-5 accent-blue-600" name="send-type" type="radio" />
                예약 발송
              </label>
            </div>
            <div className="mt-3 flex items-center gap-2 pl-6">
              <span className="text-slate-300">└</span>
              <label className="relative">
                <span className="sr-only">예약 날짜</span>
                <input
                  className="h-10 w-[144px] rounded-md border border-slate-300 px-3 pr-9 text-sm font-bold text-slate-800 outline-none"
                  defaultValue="2025-05-19"
                />
                <ImageIcon className="absolute right-2.5 top-2 h-6 w-6" src={calendarIcon} />
              </label>
              <label className="relative">
                <span className="sr-only">예약 시간</span>
                <input
                  className="h-10 w-[118px] rounded-md border border-slate-300 px-3 pr-9 text-sm font-bold text-slate-800 outline-none"
                  defaultValue="12:00"
                />
                <ImageIcon className="absolute right-2.5 top-2 h-6 w-6" src={clockIcon} />
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[86px_1fr] gap-4">
          <FieldLabel>메시지 내용</FieldLabel>
          <div>
            <div className="grid grid-cols-4 overflow-hidden rounded-md border border-slate-300 text-center text-sm font-black">
              {['한국어', 'English', '日本語', '中文'].map((language, index) => (
                <button
                  className={
                    index === 0
                      ? 'h-8 border-r border-blue-400 bg-blue-50 text-blue-700'
                      : 'h-8 border-r border-slate-200 bg-slate-50 text-slate-500 last:border-r-0'
                  }
                  key={language}
                  type="button"
                >
                  {language}
                </button>
              ))}
            </div>
            <textarea
              className="mt-2 h-[84px] w-full resize-none rounded-md border border-slate-300 p-3 text-[13px] font-semibold leading-5 text-slate-800 outline-none"
              defaultValue={'Bukchon Hanok Village is very crowded now.\nWould you like to explore a quieter indoor cultural spot nearby?'}
              maxLength={200}
            />
            <p className="-mt-6 mr-3 text-right text-xs font-bold text-slate-500">92 / 200</p>
            <textarea
              className="mt-3 h-[78px] w-full resize-none rounded-md border border-slate-300 p-3 text-[13px] font-semibold leading-5 text-slate-800 outline-none"
              defaultValue={'북촌한옥마을은 지금 매우 혼잡합니다.\n근처의 한적한 실내 문화공간을 둘러보시는 건 어떠세요?'}
              maxLength={200}
            />
            <p className="-mt-6 mr-3 text-right text-xs font-bold text-slate-500">59 / 200</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NoticePreview() {
  return (
    <section className="h-[632px] rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <h2 className="text-xl font-black text-slate-950">미리보기</h2>
      <div className="mt-5 flex justify-center">
        <div className="h-[462px] w-[314px] rounded-[36px] bg-slate-700 p-3 shadow-[0_12px_24px_rgba(15,23,42,0.2)]">
          <div className="h-full rounded-[28px] bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-md bg-blue-600 text-[10px] font-black text-white">N</div>
                <p className="text-base font-black text-slate-950">NoriGo</p>
              </div>
              <span className="text-xs font-bold text-slate-500">지금</span>
            </div>
            <div className="mt-5">
              <p className="text-sm font-black text-slate-950">북촌한옥마을 혼잡 안내</p>
              <p className="mt-2 text-[13px] font-semibold leading-5 text-slate-800">
                Bukchon Hanok Village is very crowded now. Would you like to explore a quieter indoor cultural spot nearby?
              </p>
            </div>
            <img
              alt="북촌한옥마을 한옥 골목"
              className="mt-4 h-[168px] w-full rounded-md object-cover"
              src={bukchonPreviewImage}
            />
            <button
              className="mt-5 flex h-11 w-full items-center justify-center rounded-md border border-slate-300 text-sm font-black text-slate-700"
              type="button"
            >
              추천 장소 보기
            </button>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs font-bold text-slate-400">* 실제 앱에서 표시되는 푸시/배너 미리보기입니다.</p>
    </section>
  );
}

function DeliveryHistory({ rows }: { rows: NoticeDeliveryRecord[] }) {
  return (
    <section className="h-[414px] rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
      <div className="flex h-[56px] items-center justify-between border-b border-slate-200 px-5">
        <h2 className="text-xl font-black text-slate-950">발송 이력</h2>
        <button className="inline-flex items-center gap-1 text-sm font-black text-blue-600" type="button">
          전체 보기
          <span aria-hidden="true" className="text-lg leading-none">
            ›
          </span>
        </button>
      </div>

      <div className="overflow-hidden">
        <table className="w-full table-fixed text-left text-[13px]">
          <thead className="bg-slate-50 text-xs font-black text-slate-500">
            <tr>
              <th className="w-[22%] px-5 py-3">시간</th>
              <th className="w-[15%] px-3 py-3">지역</th>
              <th className="w-[12%] px-3 py-3">언어</th>
              <th className="w-[14%] px-3 py-3 text-right">대상 수</th>
              <th className="w-[14%] px-3 py-3 text-right">클릭률</th>
              <th className="w-[14%] px-3 py-3 text-right">Re-Trip 전환율</th>
              <th className="w-[13%] px-3 py-3 text-right">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr className="h-[41px]" key={row.id}>
                <td className="truncate px-5 font-semibold text-slate-800">{row.time}</td>
                <td className="truncate px-3 font-bold text-slate-800">{row.area}</td>
                <td className="truncate px-3 font-semibold text-slate-800">{row.language}</td>
                <td className="px-3 text-right font-semibold text-slate-800">{formatNumber(row.audienceCount)}</td>
                <td className="px-3 text-right font-semibold text-slate-800">{formatPercent(row.clickRate)}</td>
                <td className="px-3 text-right font-semibold text-slate-800">{formatPercent(row.reTripConversionRate)}</td>
                <td className="px-3 text-right">
                  <StatusPill status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NoticePerformanceChart({ data }: { data: Array<{ date: string; clicks: number; reTripConversions: number; reTripConversionRate: number }> }) {
  return (
    <section className="h-[278px] rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-black text-slate-950">공지 성과</h2>
          <InfoDot />
        </div>
        <button
          className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-black text-slate-700"
          type="button"
        >
          최근 7일
          <span aria-hidden="true" className="text-sm leading-none">
            ▾
          </span>
        </button>
      </div>

      <div className="mt-2 flex justify-center gap-5 text-xs font-black text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-5 rounded-sm bg-blue-600" />
          클릭 수
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-5 rounded-sm bg-teal-500" />
          Re-Trip 전환 수
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-violet-600" />
          Re-Trip 전환율(%)
        </span>
      </div>

      <div className="mt-2 h-[184px]">
        <ResponsiveContainer height="100%" width="100%">
          <ComposedChart barGap={6} barCategoryGap="28%" data={data} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
            <CartesianGrid stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} tickLine={false} />
            <YAxis
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              width={44}
              yAxisId="count"
            />
            <YAxis
              domain={[0, 50]}
              orientation="right"
              tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              width={42}
              yAxisId="rate"
            />
            <Tooltip />
            <Bar barSize={16} dataKey="clicks" fill="#1263f1" name="클릭 수" radius={[3, 3, 0, 0]} yAxisId="count" />
            <Bar barSize={16} dataKey="reTripConversions" fill="#14b8a6" name="Re-Trip 전환 수" radius={[3, 3, 0, 0]} yAxisId="count" />
            <Line
              dataKey="reTripConversionRate"
              dot={{ fill: '#fff', r: 3, strokeWidth: 2 }}
              name="Re-Trip 전환율"
              stroke="#7c3aed"
              strokeWidth={2}
              type="monotone"
              yAxisId="rate"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function VisitorNoticeManagerPage() {
  const { data } = useQuery({ queryKey: ['notice-manager-snapshot'], queryFn: getNoticeManagerSnapshot });

  if (!data) {
    return null;
  }

  return (
    <div className="min-w-[1280px] space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex h-11 items-center gap-6 rounded-lg border border-slate-200 bg-white px-6 text-[15px] font-black text-slate-900 shadow-sm shadow-slate-200/50">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            서울 실시간 도시데이터 정상
          </span>
          <span className="inline-flex items-center gap-2">
            <ImageIcon className="h-5 w-5" src={statusRefreshIcon} />
            마지막 갱신 10:32
          </span>
          <span className="inline-flex items-center gap-2">
            <ImageIcon className="h-5 w-5" src={calendarIcon} />
            121개 중 118개 수신 성공
          </span>
          <span className="inline-flex items-center gap-2">
            <ImageIcon className="h-5 w-5" src={statusCheckIcon} />
            API 상태&nbsp; 98.4%
          </span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
        {data.kpis.map((item) => (
          <KpiCard item={item} key={item.id} />
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.04fr_0.92fr]">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_336px]">
          <NoticeComposer />
          <NoticePreview />

          <div className="grid gap-7 xl:col-span-2 xl:grid-cols-3">
            <button
              className="h-12 rounded-md border border-slate-300 bg-white text-base font-black text-slate-700 shadow-sm"
              type="button"
            >
              초안 저장
            </button>
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-blue-500 bg-white text-base font-black text-blue-700 shadow-sm"
              type="button"
            >
              <ImageIcon className="h-5 w-5" src={calendarIcon} />
              예약 저장
            </button>
            <button
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-blue-600 bg-blue-600 text-base font-black text-white shadow-sm"
              type="button"
            >
              <ImageIcon className="h-5 w-5 brightness-0 invert" src={sendIcon} />
              즉시 발송
            </button>
          </div>

          <p className="flex items-center gap-2 text-xs font-bold text-slate-400 xl:col-span-2">
            <InfoDot />
            공지 발송은 지역 단위 집계 데이터 기반으로 이루어지며, 개별 사용자를 식별하거나 추적하지 않습니다.
          </p>
        </div>

        <div className="grid gap-3">
          <DeliveryHistory rows={data.deliveryHistory} />
          <NoticePerformanceChart data={data.performance} />
        </div>
      </div>
    </div>
  );
}
