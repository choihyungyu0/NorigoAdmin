import { type DataQualityIssue } from '../types/dataQuality';

export const dataQualityIssues: DataQualityIssue[] = [
  {
    id: 'dq-001',
    source: 'Culture Scan API',
    issue: '마찰 신호 집계 지연',
    severity: 'medium',
    status: 'reviewing',
    affectedAreas: 7,
    detectedAt: '2025-05-19T10:12:00+09:00',
  },
  {
    id: 'dq-002',
    source: 'Notice Delivery API',
    issue: '예약 발송 결과 수집 일부 누락',
    severity: 'low',
    status: 'open',
    affectedAreas: 3,
    detectedAt: '2025-05-19T09:58:00+09:00',
  },
  {
    id: 'dq-003',
    source: 'Crowd Sensor API',
    issue: '혼잡도 센서 보정값 정상화 완료',
    severity: 'low',
    status: 'resolved',
    affectedAreas: 2,
    detectedAt: '2025-05-19T08:35:00+09:00',
  },
];
