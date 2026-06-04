export type NoticeStatus = 'sent' | 'scheduled' | 'draft';

export type NoticeDeliveryStatus = 'sent' | 'failed' | 'cancelled';

export type NoticeLanguage = '한국어' | 'English' | '日本語' | '中文';

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

export type NoticeKpiTone = 'blue' | 'amber' | 'purple' | 'green' | 'teal' | 'red';

export type NoticeKpiIcon = 'send' | 'clock' | 'cursor' | 'refresh' | 'globe' | 'alert';

export type NoticeKpi = {
  id: string;
  label: string;
  value: string;
  unit: string;
  baseline: string;
  delta: string;
  deltaDirection: 'up' | 'down' | 'flat';
  deltaTone: 'good' | 'bad' | 'neutral';
  icon: NoticeKpiIcon;
  tone: NoticeKpiTone;
};

export type NoticeDeliveryRecord = {
  id: string;
  time: string;
  area: string;
  language: NoticeLanguage;
  audienceCount: number | null;
  clickRate: number | null;
  reTripConversionRate: number | null;
  status: NoticeDeliveryStatus;
};

export type NoticePerformancePoint = {
  date: string;
  clicks: number;
  reTripConversions: number;
  reTripConversionRate: number;
};

export type NoticeManagerSnapshot = {
  kpis: NoticeKpi[];
  deliveryHistory: NoticeDeliveryRecord[];
  performance: NoticePerformancePoint[];
};
