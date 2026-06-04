import { type AdminAuditLog } from '../types/admin';

export const adminAuditLogs: AdminAuditLog[] = [
  {
    id: 'audit-001',
    actorTeam: '서울시 관광 운영팀',
    action: '혼잡 안내 문안 승인',
    target: 'notice-001',
    result: 'success',
    createdAt: '2025-05-19T10:03:00+09:00',
  },
  {
    id: 'audit-002',
    actorTeam: '관광 데이터 품질팀',
    action: 'Culture Scan 지연 이슈 검토',
    target: 'dq-001',
    result: 'pending',
    createdAt: '2025-05-19T10:18:00+09:00',
  },
  {
    id: 'audit-003',
    actorTeam: '서울시 관광 운영팀',
    action: '개별 위치 조회 시도 차단',
    target: 'privacy-guard',
    result: 'blocked',
    createdAt: '2025-05-19T09:51:00+09:00',
  },
];
