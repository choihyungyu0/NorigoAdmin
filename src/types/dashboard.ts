export type TimeBucket = {
  bucket: string;
  value: number;
};

export type DashboardMetric = {
  label: string;
  value: string;
  trend: string;
  tone: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
};

export type ApiHealthStatus = 'healthy' | 'degraded' | 'down';

export type ApiHealthCheck = {
  id: string;
  service: string;
  status: ApiHealthStatus;
  latencyMs: number;
  freshnessMinutes: number;
};

export type OverviewAssetIconKey =
  | 'veryHigh'
  | 'retrip'
  | 'switch'
  | 'culture'
  | 'discover'
  | 'cursor'
  | 'shield'
  | 'warning'
  | 'calendar'
  | 'sync'
  | 'check'
  | 'chart'
  | 'megaphone'
  | 'database'
  | 'pencil'
  | 'clock';

export type OverviewTone =
  | 'red'
  | 'purple'
  | 'teal'
  | 'blue'
  | 'emerald'
  | 'orange'
  | 'amber'
  | 'slate';

export type OverviewDeltaTone = 'danger' | 'success' | 'neutral';

export type OverviewStatusItem = {
  id: string;
  label: string;
  value: string;
  iconKey: OverviewAssetIconKey;
  tone: OverviewTone;
};

export type OverviewMetric = {
  id: string;
  title: string;
  value: string;
  unit: string;
  comparisonLabel: string;
  delta: string;
  deltaTone: OverviewDeltaTone;
  iconKey: OverviewAssetIconKey;
  tone: OverviewTone;
};

export type OverviewPriority = {
  rank: number;
  area: string;
  issueType: string;
  riskScore: string;
  recommendedAction: string;
  status: string;
  statusTone: OverviewTone;
};

export type OverviewSnapshotSegment = {
  id: string;
  label: string;
  value: string;
  tone: OverviewTone;
};

export type OverviewAction = {
  id: string;
  title: string;
  description: string;
  tone: 'red' | 'orange' | 'amber';
  iconKey: OverviewAssetIconKey;
};

export type OverviewFlowItem = {
  id: string;
  label: string;
  value: string;
  tone: OverviewTone;
  iconKey: OverviewAssetIconKey;
};

export type OverviewFunnelStep = {
  id: string;
  label: string;
  value: string;
  tone: OverviewTone;
  widthPercent: number;
};

export type OverviewLog = {
  id: string;
  time: string;
  actor: string;
  title: string;
  description: string;
  iconKey: OverviewAssetIconKey;
  tone: OverviewTone;
};

export type OverviewDashboard = {
  statusItems: OverviewStatusItem[];
  metrics: OverviewMetric[];
  priorities: OverviewPriority[];
  snapshot: {
    totalAreasLabel: string;
    healthyAreasLabel: string;
    collectionRate: string;
    segments: OverviewSnapshotSegment[];
  };
  actions: OverviewAction[];
  flowItems: OverviewFlowItem[];
  funnelSteps: OverviewFunnelStep[];
  logs: OverviewLog[];
};
