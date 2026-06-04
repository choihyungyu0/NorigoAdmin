import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { getAreaMetrics } from '../../services/metricsApi';
import { SeoulMapMock } from './SeoulMapMock';
import { AlertTriangle, MapPinned, ShieldCheck } from 'lucide-react';

export function LiveMapPage() {
  const { data = [] } = useQuery({ queryKey: ['area-metrics'], queryFn: getAreaMetrics });
  const criticalCount = data.filter((area) => area.crowdLevel === 'critical').length;
  const highCount = data.filter((area) => area.crowdLevel === 'high').length;

  return (
    <div>
      <PageHeader
        eyebrow="Live crowd map"
        title="서울 관광 권역 실시간 집계 지도"
        description="운영 판단에 필요한 권역 단위 혼잡도와 위험도만 표시합니다. 개별 사용자 위치나 동선은 표시하지 않습니다."
      />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <MetricCard icon={MapPinned} label="표시 권역 샘플" value={`${data.length}개`} trend="전체 121권역 확장 예정" />
        <MetricCard icon={AlertTriangle} label="고위험 이상" value={`${criticalCount + highCount}개`} trend="현장 공지 우선 검토" tone="amber" />
        <MetricCard icon={ShieldCheck} label="개인 위치" value="미표시" trend="집계 버킷만 사용" tone="emerald" />
      </div>
      <Card>
        <SectionHeader title="권역별 risk_score heat layer" description="현재 mock map은 실제 지리 좌표가 아닌 운영용 집계 타일입니다." />
        <SeoulMapMock areas={data} />
      </Card>
    </div>
  );
}
