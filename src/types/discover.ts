export type DiscoverTone = 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan' | 'slate';

export type DiscoverTrendTone = 'success' | 'danger' | 'neutral';

export type DiscoverIconKey =
  | 'eye'
  | 'cursor'
  | 'percent'
  | 'bookmark'
  | 'pin'
  | 'calendar'
  | 'retrip'
  | 'growth'
  | 'check'
  | 'refresh'
  | 'database'
  | 'shield'
  | 'cafe'
  | 'culture'
  | 'food'
  | 'camera'
  | 'indoor'
  | 'crowd'
  | 'warning'
  | 'clock'
  | 'edit'
  | 'file';

export type DiscoverMetric = {
  id: string;
  label: string;
  value: string;
  unit: string;
  previousLabel: string;
  change: string;
  trendTone: DiscoverTrendTone;
  iconKey: DiscoverIconKey;
  tone: DiscoverTone;
};

export type DiscoverStatusItem = {
  id: string;
  label: string;
  value?: string;
  iconKey: DiscoverIconKey;
  tone: DiscoverTone;
};

export type DiscoverFunnelStep = {
  id: string;
  rank: number;
  label: string;
  count: string;
  conversion: string;
  dropoff: string;
  tone: DiscoverTone;
  widthPercent: number;
};

export type DiscoverCategoryInterest = {
  id: string;
  category: string;
  exposure: string;
  clickRate: string;
  saveRate: string;
  scheduleRate: string;
  dailyChange: string;
  changeTone: DiscoverTrendTone;
  iconKey: DiscoverIconKey;
  tone: DiscoverTone;
};

export type DiscoverHiddenSpot = {
  id: string;
  rank: number;
  place: string;
  category: string;
  currentCrowd: 'Low' | 'Moderate';
  clicks: string;
  saves: string;
  schedules: string;
  status: '우수' | '안정' | '상승';
  statusTone: DiscoverTone;
};

export type DiscoverOriginFlow = {
  id: string;
  origin: string;
  originNote: string;
  destinations: Array<{
    id: string;
    place: string;
    share: string;
  }>;
};

export type DiscoverTimePoint = {
  hour: string;
  cardClicks: number;
  saves: number;
  scheduleAdds: number;
  routeClicks: number;
};

export type DiscoverInsight = {
  id: string;
  title: string;
  description: string;
  iconKey: DiscoverIconKey;
  tone: DiscoverTone;
};

export type DiscoverPerformanceDashboard = {
  statusItems: DiscoverStatusItem[];
  metrics: DiscoverMetric[];
  funnelSteps: DiscoverFunnelStep[];
  categories: DiscoverCategoryInterest[];
  hiddenSpots: DiscoverHiddenSpot[];
  originFlows: DiscoverOriginFlow[];
  timeSeries: DiscoverTimePoint[];
  insights: DiscoverInsight[];
};
