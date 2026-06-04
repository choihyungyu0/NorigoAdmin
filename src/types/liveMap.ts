export type LiveMapRiskLevel = 'veryHigh' | 'high' | 'moderate' | 'low' | 'noData';

export type LiveMapMetricTone = 'rose' | 'orange' | 'violet' | 'teal' | 'blue' | 'emerald';

export type LiveMapMetric = {
  id:
    | 'criticalAreas'
    | 'veryHighPlaces'
    | 'retripEvents'
    | 'scheduleSwitch'
    | 'cultureQuestions'
    | 'complaints'
    | 'freshness'
    | 'apiHealth';
  label: string;
  value: string;
  unit: string;
  caption: string;
  delta: string;
  deltaTone: 'up' | 'down' | 'good' | 'flat';
  tone: LiveMapMetricTone;
};

export type LiveMapAreaMarker = {
  id: string;
  nameKo: string;
  district: string;
  lat: number;
  lng: number;
  riskLevel: LiveMapRiskLevel;
  riskScore: number | null;
  trend: 'up' | 'down' | 'flat';
  signal?: 'retrip' | 'culture';
};

export type LiveRiskArea = {
  rank: number;
  nameKo: string;
  riskScore: number;
  delta: number;
};

export type LiveDataStatus = {
  id: 'normal' | 'delayed' | 'missing' | 'api';
  label: string;
  value: string;
  caption: string;
  tone: 'emerald' | 'amber' | 'rose' | 'blue';
};

export type LiveSignalPoint = {
  time: string;
  retrip: number;
  culture: number;
};

export type LiveMapSummary = {
  operationDate: string;
  updatedAt: string;
  monitoredAreaCount: number;
  receivedAreaCount: number;
  apiUptime: string;
  metrics: LiveMapMetric[];
  markers: LiveMapAreaMarker[];
  topRiskAreas: LiveRiskArea[];
  dataStatus: LiveDataStatus[];
  signalTimeline: LiveSignalPoint[];
};
