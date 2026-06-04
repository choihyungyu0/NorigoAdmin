export type NoticeStatus = 'sent' | 'scheduled' | 'draft';

export type NoticeHistoryItem = {
  id: string;
  title: string;
  targetArea: string;
  audienceSegment: string;
  sentAt: string;
  deliveryRate: number;
  openRate: number;
  status: NoticeStatus;
};

export type NoticeDraftInput = {
  title: string;
  targetAreaIds: string[];
  body: string;
};
