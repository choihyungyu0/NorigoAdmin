import { useQuery } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { getNoticeHistory } from '../../services/noticesApi';
import { type NoticeHistoryItem } from '../../types/notices';

const columns: Array<DataTableColumn<NoticeHistoryItem>> = [
  { key: 'title', header: '공지', render: (row) => row.title },
  { key: 'area', header: '대상 권역', render: (row) => row.targetArea },
  { key: 'segment', header: '대상 집계군', render: (row) => row.audienceSegment },
  { key: 'delivery', header: '도달률', align: 'right', render: (row) => `${row.deliveryRate}%` },
  { key: 'open', header: '열람률', align: 'right', render: (row) => `${row.openRate}%` },
  {
    key: 'status',
    header: '상태',
    render: (row) => (
      <StatusBadge label={row.status} tone={row.status === 'sent' ? 'success' : row.status === 'scheduled' ? 'info' : 'neutral'} />
    ),
  },
];

export function VisitorNoticeManagerPage() {
  const { data = [] } = useQuery({ queryKey: ['notice-history'], queryFn: getNoticeHistory });

  return (
    <div>
      <PageHeader
        actions={
          <Button variant="primary">
            <Send aria-hidden="true" size={16} />
            Edge Function 예약
          </Button>
        }
        eyebrow="Visitor notice delivery"
        title="방문객 공지 운영"
        description="권역 단위 대상군에 보낸 공지의 도달률과 열람률을 추적합니다. 브라우저 직접 쓰기는 사용하지 않습니다."
      />
      <Card>
        <SectionHeader title="공지 이력" description="대상은 개인이 아닌 집계 세그먼트로 관리합니다." />
        <DataTable columns={columns} data={data} getRowKey={(row) => row.id} />
      </Card>
    </div>
  );
}
