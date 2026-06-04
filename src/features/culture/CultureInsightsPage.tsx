import { useQuery } from '@tanstack/react-query';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Card } from '../../components/ui/Card';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { cultureSignals } from '../../mocks/cultureSignals';
import { type CultureSignal } from '../../types/culture';

const colors = ['#2563eb', '#f59e0b', '#e11d48'];

const columns: Array<DataTableColumn<CultureSignal>> = [
  { key: 'area', header: '권역', render: (row) => row.areaName },
  { key: 'category', header: '분류', render: (row) => row.category },
  { key: 'count', header: '신호 수', align: 'right', render: (row) => row.signalCount.toLocaleString('ko-KR') },
  { key: 'trend', header: '추이', align: 'right', render: (row) => row.trend },
  {
    key: 'severity',
    header: '심각도',
    render: (row) => (
      <StatusBadge label={row.severity} tone={row.severity === 'high' ? 'danger' : row.severity === 'medium' ? 'warning' : 'success'} />
    ),
  },
];

async function getCultureSignals() {
  return cultureSignals;
}

export function CultureInsightsPage() {
  const { data = [] } = useQuery({ queryKey: ['culture-signals'], queryFn: getCultureSignals });

  return (
    <div>
      <PageHeader
        eyebrow="Culture Scan"
        title="관광 마찰 신호 인사이트"
        description="번역, 예절, 행사 동선 등 문화적 마찰 신호를 권역별 집계로 관찰합니다."
      />
      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Card>
          <SectionHeader title="신호 구성" />
          <div className="h-72">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie data={data} dataKey="signalCount" innerRadius={64} nameKey="category" outerRadius={96}>
                  {data.map((entry, index) => (
                    <Cell fill={colors[index % colors.length]} key={entry.id} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionHeader title="마찰 신호 목록" description="메시지 원문이나 사용자별 여정은 표시하지 않습니다." />
          <DataTable columns={columns} data={data} getRowKey={(row) => row.id} />
        </Card>
      </div>
    </div>
  );
}
