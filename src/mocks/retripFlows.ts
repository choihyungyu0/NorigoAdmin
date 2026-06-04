import { type ReTripFlow } from '../types/retrip';

export const retripFlows: ReTripFlow[] = [
  {
    id: 'flow-001',
    fromArea: '명동 관광특구',
    toArea: '동대문디자인플라자',
    hourBucket: '10:00-11:00',
    aggregateVisitors: 1280,
    diversionRate: 18.6,
    reason: '혼잡 완화 추천',
    confidence: 91,
    status: 'intervention',
  },
  {
    id: 'flow-002',
    fromArea: '홍대 걷고싶은거리',
    toArea: '경의선숲길',
    hourBucket: '10:00-11:00',
    aggregateVisitors: 920,
    diversionRate: 14.1,
    reason: '대체 동선 수용 가능',
    confidence: 87,
    status: 'watch',
  },
  {
    id: 'flow-003',
    fromArea: '북촌한옥마을',
    toArea: '서촌 골목길',
    hourBucket: '10:00-11:00',
    aggregateVisitors: 460,
    diversionRate: 11.4,
    reason: '문화 체험 유사도',
    confidence: 82,
    status: 'stable',
  },
];
