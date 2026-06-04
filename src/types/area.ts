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
