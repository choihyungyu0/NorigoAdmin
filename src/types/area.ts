import { type TimeBucket } from './dashboard';

export type CrowdLevel = 'low' | 'moderate' | 'high' | 'critical';

export type TourismAreaMetric = {
  id: string;
  nameKo: string;
  district: string;
  crowdLevel: CrowdLevel;
  crowdCount: number;
  riskScore: number;
  retripOutflow: number;
  cultureFrictionScore: number;
  discoverEngagement: number;
  noticeDeliveryRate: number;
  updatedAt: string;
  riskTrend: TimeBucket[];
};

export type AreaDetailTone = 'danger' | 'success' | 'info' | 'warning' | 'neutral' | 'purple' | 'teal';

export type AreaMetricIconKey = 'crowd' | 'risk' | 'population' | 'retrip' | 'culture';

export type AreaDetailMetric = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  helper: string;
  delta: string;
  deltaTone: 'danger' | 'success';
  tone: AreaDetailTone;
  iconKey: AreaMetricIconKey;
};

export type AreaTrendBucket = {
  time: string;
  crowd: number;
  retrip: number;
};

export type AreaRiskFactor = {
  id: string;
  label: string;
  value: string;
  iconKey: 'crowd' | 'control' | 'weather';
};

export type AreaAction = {
  id: string;
  label: string;
  iconKey: 'mapPin' | 'megaphone' | 'memo' | 'minus' | 'check';
  tone: AreaDetailTone;
  wide?: boolean;
};

export type AreaMessagePlace = {
  id: string;
  name: string;
  route: string;
};

export type AreaTransportInfo = {
  id: string;
  mode: string;
  value: string;
  iconKey: 'subway' | 'bus' | 'bike' | 'parking' | 'alert' | 'weather';
  tone: AreaDetailTone;
};

export type AreaRecommendedPlace = {
  id: string;
  rank: number;
  name: string;
  share: string;
  imageFile: string;
};

export type AreaCultureQuestion = {
  id: string;
  category: string;
  question: string;
  time: string;
  tone: AreaDetailTone;
};

export type AreaResponseMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  iconKey: 'retrip' | 'clock' | 'shield' | 'search';
};

export type AreaOperationLog = {
  id: string;
  time: string;
  tag: string;
  title: string;
  description: string;
  tone: AreaDetailTone;
  operator: string;
};

export type AreaDetailSnapshot = {
  id: string;
  city: string;
  district: string;
  areaName: string;
  observedAtLabel: string;
  standardTimeLabel: string;
  metrics: AreaDetailMetric[];
  trend: AreaTrendBucket[];
  riskFactors: AreaRiskFactor[];
  finalRiskScore: string;
  actions: AreaAction[];
  liveMessage: {
    title: string;
    description: string;
    guidance: string;
    occurredAt: string;
    places: AreaMessagePlace[];
  };
  transport: AreaTransportInfo[];
  recommendedPlaces: AreaRecommendedPlace[];
  cultureQuestions: AreaCultureQuestion[];
  responseMetrics: AreaResponseMetric[];
  operationLogs: AreaOperationLog[];
};
