import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MetricCard } from '../../components/ui/MetricCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { getAreaMetricById } from '../../services/metricsApi';
import { BellDot, Compass, Route, Users } from 'lucide-react';

export function AreaDetailPage() {
  const { areaId = 'myeong-dong' } = useParams();
  const { data: area } = useQuery({ queryKey: ['area-detail', areaId], queryFn: () => getAreaMetricById(areaId) });

  if (!area) {
    return null;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Area detail"
        title={`${area.nameKo} 운영 상세`}
        description="권역 단위의 혼잡, 위험도, 대체 이동, 안내 성과를 집계로 확인합니다."
      />
      <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="집계 인원" value={area.crowdCount.toLocaleString('ko-KR')} trend={area.district} />
        <MetricCard icon={Route} label="Re-Trip outflow" value={area.retripOutflow.toLocaleString('ko-KR')} trend="대체 권역 이동 집계" tone="blue" />
        <MetricCard icon={Compass} label="Culture friction" value={`${area.cultureFrictionScore}`} trend="신호 점수" tone="amber" />
        <MetricCard icon={BellDot} label="공지 도달률" value={`${area.noticeDeliveryRate}%`} trend="집계 대상 기준" tone="emerald" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <SectionHeader title="risk_score trend" description="운영 시간 버킷 기준입니다." />
          <div className="h-80">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={area.riskTrend}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="bucket" tickLine={false} />
                <YAxis tickLine={false} width={36} />
                <Tooltip />
                <Line dataKey="value" dot={{ r: 4 }} stroke="#2563eb" strokeWidth={3} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionHeader title="운영 상태" />
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <span className="text-sm font-black text-slate-600">혼잡 단계</span>
              <StatusBadge
                label={area.crowdLevel}
                tone={area.crowdLevel === 'critical' ? 'danger' : area.crowdLevel === 'high' ? 'warning' : 'info'}
              />
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-600">
              최근 갱신: {area.updatedAt}. 운영 화면에는 개인 방문자 위치, 개인 여정, 단말 식별자를 표시하지 않습니다.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
