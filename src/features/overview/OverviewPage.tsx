import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, MapPinned, Route, Signal } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { MetricCard } from '../../components/ui/MetricCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { getOverviewMetrics } from '../../services/metricsApi';
import { type TourismAreaMetric } from '../../types/area';

const areaColumns: Array<DataTableColumn<TourismAreaMetric>> = [
  { key: 'area', header: '권역', render: (row) => `${row.nameKo} · ${row.district}` },
  { key: 'crowd', header: '집계 인원', align: 'right', render: (row) => row.crowdCount.toLocaleString('ko-KR') },
  { key: 'risk', header: 'risk_score', align: 'right', render: (row) => row.riskScore },
  { key: 'notice', header: '공지 도달률', align: 'right', render: (row) => `${row.noticeDeliveryRate}%` },
];

export function OverviewPage() {
  const { data } = useQuery({ queryKey: ['overview-metrics'], queryFn: getOverviewMetrics });

  if (!data) {
    return null;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Seoul 121-area monitoring"
        title="서울 관광 운영 통합 현황"
        description="121개 관광 권역의 혼잡, 위험도, 대체 이동 흐름, 공지 도달률을 집계 수준으로 모니터링합니다."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={MapPinned} label="관측 권역" trend="서울 121-area 기준" value={`${data.serviceAreaCount}개`} />
        <MetricCard
          icon={Activity}
          label="현재 집계 인원"
          tone="emerald"
          trend="개인 위치 미표시"
          value={data.totalCrowd.toLocaleString('ko-KR')}
        />
        <MetricCard icon={AlertTriangle} label="평균 risk_score" tone="amber" trend="상위 권역 집중 관리" value={`${data.averageRisk}`} />
        <MetricCard
          icon={Route}
          label="Re-Trip 이동"
          tone="blue"
          trend="대체 권역 이동 집계"
          value={data.totalRetripFlow.toLocaleString('ko-KR')}
        />
        <MetricCard
          icon={Signal}
          label="Culture Scan"
          tone="rose"
          trend="마찰 신호 총량"
          value={data.highFrictionSignals.toLocaleString('ko-KR')}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <SectionHeader title="도시 risk_score 추이" description="시간대별 집계 위험도입니다." />
          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={data.cityRiskTrend}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="bucket" tickLine={false} />
                <YAxis tickLine={false} width={36} />
                <Tooltip />
                <Area dataKey="value" fill="#dbeafe" stroke="#2563eb" strokeWidth={2} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title="상위 혼잡 권역" description="개별 이동이 아닌 권역별 집계 인원만 표시합니다." />
          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={data.topRiskAreas.slice(0, 5)}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="nameKo" tickLine={false} />
                <YAxis tickLine={false} width={48} />
                <Tooltip />
                <Bar dataKey="crowdCount" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <SectionHeader title="권역별 운영 우선순위" />
          <DataTable columns={areaColumns} data={data.topRiskAreas} getRowKey={(row) => row.id} />
        </Card>
        <Card>
          <SectionHeader title="API Health" description="데이터 신선도와 응답 지연을 확인합니다." />
          <div className="space-y-3">
            {data.apiHealthChecks.map((check) => (
              <div className="rounded-xl border border-slate-200 p-3" key={check.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-slate-800">{check.service}</p>
                  <StatusBadge
                    label={check.status}
                    tone={check.status === 'healthy' ? 'success' : check.status === 'degraded' ? 'warning' : 'danger'}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {check.latencyMs}ms · {check.freshnessMinutes}분 전 갱신
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
