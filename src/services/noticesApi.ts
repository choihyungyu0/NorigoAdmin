import { noticeHistory, noticeManagerSnapshot } from '../mocks/noticeHistory';
import { type NoticeDraftInput } from '../types/notices';

export async function getNoticeHistory() {
  return noticeHistory;
}

export async function getNoticeManagerSnapshot() {
  return noticeManagerSnapshot;
}

export async function scheduleNoticeDraft(draft: NoticeDraftInput) {
  return {
    id: `draft-${draft.targetAreaIds.join('-')}`,
    status: 'queued-for-edge-function',
    message: '공지 발송 쓰기 작업은 추후 Supabase Edge Function에서 처리합니다.',
  };
}
