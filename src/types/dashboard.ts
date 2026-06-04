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
