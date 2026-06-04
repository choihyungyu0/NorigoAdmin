import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { getApiHealthChecks } from '../../services/metricsApi';
import { dataQualityIssues } from '../../mocks/dataQualityIssues';
import { type DataQualityIssue } from '../../types/dataQuality';

const columns: Array<DataTableColumn<DataQualityIssue>> = [
  { key: 'source', header: '소스', render: (row) => row.source },
  { key: 'issue', header: '이슈', render: (row) => row.issue },
  { key: 'areas', header: '영향 권역', align: 'right', render: (row) => `${row.affectedAreas}개` },
  {
    key: 'severity',
    header: '심각도',
    render: (row) => (
      <StatusBadge label={row.severity} tone={row.severity === 'high' ? 'danger' : row.severity === 'medium' ? 'warning' : 'neutral'} />
    ),
  },
  { key: 'status', header: '처리 상태', render: (row) => <StatusBadge label={row.status} tone={row.status === 'resolved' ? 'success' : 'info'} /> },
];

async function getDataQualityIssues() {
  return dataQualityIssues;
}

export function DataQualityPage() {
  const { data: health = [] } = useQuery({ queryKey: ['api-health'], queryFn: getApiHealthChecks });
  const { data: issues = [] } = useQuery({ queryKey: ['data-quality-issues'], queryFn: getDataQualityIssues });

  return (
    <div>
      <PageHeader
        eyebrow="Data quality"
        title="데이터 품질 및 API 상태"
        description="집계 데이터의 신선도, 지연, 누락 위험을 운영자가 빠르게 판단할 수 있게 표시합니다."
      />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        {health.map((check) => (
          <Card className="p-4" key={check.id}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-black text-slate-800">{check.service}</p>
              <StatusBadge label={check.status} tone={check.status === 'healthy' ? 'success' : 'warning'} />
            </div>
            <p className="mt-3 text-sm font-bold text-slate-500">
              {check.latencyMs}ms · freshness {check.freshnessMinutes}m
            </p>
          </Card>
        ))}
      </div>
      <Card>
        <SectionHeader title="품질 이슈 큐" />
        <DataTable columns={columns} data={issues} getRowKey={(row) => row.id} />
      </Card>
    </div>
  );
}
