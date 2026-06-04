import { adminAuditLogs } from '../mocks/adminAuditLogs';
import { type AdminActionRequest } from '../types/admin';

export async function getAdminAuditLogs() {
  return adminAuditLogs;
}

export async function requestAdminAction(action: AdminActionRequest) {
  return {
    id: `edge-action-${action.targetId}`,
    status: 'queued-for-edge-function',
    message: '브라우저에서는 직접 쓰기를 수행하지 않고 Supabase Edge Function 호출로 위임합니다.',
  };
}
