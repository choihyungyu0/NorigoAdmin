import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { getAdminAuditLogs } from '../../services/adminApi';
import { type AdminAuditLog } from '../../types/admin';

const columns: Array<DataTableColumn<AdminAuditLog>> = [
  { key: 'actor', header: '팀', render: (row) => row.actorTeam },
  { key: 'action', header: '작업', render: (row) => row.action },
  { key: 'target', header: '대상', render: (row) => row.target },
  {
    key: 'result',
    header: '결과',
    render: (row) => (
      <StatusBadge
        label={row.result}
        tone={row.result === 'success' ? 'success' : row.result === 'blocked' ? 'danger' : 'warning'}
      />
    ),
  },
  { key: 'created', header: '시간', render: (row) => row.createdAt },
];

export function AdminSettingsPage() {
  const { data = [] } = useQuery({ queryKey: ['admin-audit-logs'], queryFn: getAdminAuditLogs });

  return (
    <div>
      <PageHeader
        eyebrow="Admin settings"
        title="관리 설정 및 감사 로그"
        description="운영자 작업은 감사 가능해야 하며, 브라우저에서 서비스 롤 권한을 사용하지 않습니다."
      />
      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Card>
          <SectionHeader title="보안 원칙" />
          <ul className="space-y-3 text-sm font-semibold leading-6 text-slate-600">
            <li>Supabase service role key는 브라우저 번들에 포함하지 않습니다.</li>
            <li>쓰기 작업은 Supabase Edge Function으로 위임합니다.</li>
            <li>개인 위치와 개인 여정 UI는 만들지 않습니다.</li>
          </ul>
        </Card>
        <Card>
          <SectionHeader title="감사 로그" description="관리자 작업 결과만 기록하며 민감한 방문자 정보는 포함하지 않습니다." />
          <DataTable columns={columns} data={data} getRowKey={(row) => row.id} />
        </Card>
      </div>
    </div>
  );
}
