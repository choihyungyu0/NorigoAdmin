import { type NoticeHistoryItem } from '../types/notices';

export const noticeHistory: NoticeHistoryItem[] = [
  {
    id: 'notice-001',
    title: '명동 혼잡 완화 및 대체 동선 안내',
    targetArea: '명동 관광특구',
    audienceSegment: '해당 권역 방문객 집계군',
    sentAt: '2025-05-19T10:05:00+09:00',
    deliveryRate: 96.4,
    openRate: 42.8,
    status: 'sent',
  },
  {
    id: 'notice-002',
    title: '북촌 생활 예절 안내 강화',
    targetArea: '북촌한옥마을',
    audienceSegment: '문화 체험 관심 집계군',
    sentAt: '2025-05-19T09:45:00+09:00',
    deliveryRate: 95.8,
    openRate: 39.1,
    status: 'sent',
  },
  {
    id: 'notice-003',
    title: '홍대 야간 혼잡 사전 안내',
    targetArea: '홍대 걷고싶은거리',
    audienceSegment: '야간 이동 예측 집계군',
    sentAt: '2025-05-19T18:00:00+09:00',
    deliveryRate: 0,
    openRate: 0,
    status: 'scheduled',
  },
];
