import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../../components/ui/Card';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { getAreaMetrics } from '../../services/metricsApi';
import { type TourismAreaMetric } from '../../types/area';

const columns: Array<DataTableColumn<TourismAreaMetric>> = [
  { key: 'area', header: '권역', render: (row) => row.nameKo },
  { key: 'district', header: '자치구', render: (row) => row.district },
  { key: 'discover', header: '숨은 명소 반응', align: 'right', render: (row) => `${row.discoverEngagement}` },
  { key: 'risk', header: 'risk_score', align: 'right', render: (row) => row.riskScore },
];

export function DiscoverPerformancePage() {
  const { data = [] } = useQuery({ queryKey: ['discover-performance'], queryFn: getAreaMetrics });
  const sorted = [...data].sort((a, b) => b.discoverEngagement - a.discoverEngagement);

  return (
    <div>
      <PageHeader
        eyebrow="Discover hidden spots"
        title="숨은 명소 성과 분석"
        description="혼잡 분산을 돕는 Discover 추천의 권역별 집계 성과를 확인합니다."
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card>
          <SectionHeader title="권역별 반응 점수" />
          <div className="h-80">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={sorted}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="nameKo" tickLine={false} />
                <YAxis tickLine={false} width={36} />
                <Tooltip />
                <Bar dataKey="discoverEngagement" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionHeader title="운영 후보" description="혼잡 완화에 기여할 대체 권역 후보입니다." />
          <DataTable columns={columns} data={sorted} getRowKey={(row) => row.id} />
        </Card>
      </div>
    </div>
  );
}
