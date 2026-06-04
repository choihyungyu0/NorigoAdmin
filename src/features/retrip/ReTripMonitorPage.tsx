import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../../components/ui/Card';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { retripFlows } from '../../mocks/retripFlows';
import { type ReTripFlow } from '../../types/retrip';

const columns: Array<DataTableColumn<ReTripFlow>> = [
  { key: 'from', header: '출발 권역', render: (row) => row.fromArea },
  { key: 'to', header: '대체 권역', render: (row) => row.toArea },
  { key: 'bucket', header: '시간대', render: (row) => row.hourBucket },
  { key: 'visitors', header: '집계 이동', align: 'right', render: (row) => row.aggregateVisitors.toLocaleString('ko-KR') },
  { key: 'rate', header: '전환율', align: 'right', render: (row) => `${row.diversionRate}%` },
  {
    key: 'status',
    header: '상태',
    render: (row) => (
      <StatusBadge
        label={row.status}
        tone={row.status === 'intervention' ? 'danger' : row.status === 'watch' ? 'warning' : 'success'}
      />
    ),
  },
];

async function getReTripFlows() {
  return retripFlows;
}

export function ReTripMonitorPage() {
  const { data = [] } = useQuery({ queryKey: ['retrip-flows'], queryFn: getReTripFlows });

  return (
    <div>
      <PageHeader
        eyebrow="Re-Trip flows"
        title="대체 이동 흐름 모니터"
        description="혼잡 권역에서 대체 관광 권역으로 이동한 집계 흐름과 추천 신뢰도를 확인합니다."
      />
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <SectionHeader title="대체 이동량" description="시간 버킷별 집계 이동자 수입니다." />
          <div className="h-80">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={data}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="toArea" tickLine={false} />
                <YAxis tickLine={false} width={48} />
                <Tooltip />
                <Bar dataKey="aggregateVisitors" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionHeader title="Flow detail" />
          <DataTable columns={columns} data={data} getRowKey={(row) => row.id} />
        </Card>
      </div>
    </div>
  );
}
