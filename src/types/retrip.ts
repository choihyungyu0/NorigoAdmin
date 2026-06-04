export type FlowStatus = 'stable' | 'watch' | 'intervention';

export type ReTripFlow = {
  id: string;
  fromArea: string;
  toArea: string;
  hourBucket: string;
  aggregateVisitors: number;
  diversionRate: number;
  reason: string;
  confidence: number;
  status: FlowStatus;
};

export type ReTripKpiTone = 'purple' | 'teal' | 'blue' | 'green' | 'amber';

export type ReTripKpi = {
  id: string;
  label: string;
  value: string;
  unit: string;
  deltaLabel: string;
  deltaDirection: 'up' | 'down';
  deltaTone: 'good' | 'bad';
  baseline: string;
  icon: 'reroute' | 'switch' | 'calendar' | 'pin' | 'trend' | 'alert';
  tone: ReTripKpiTone;
};

export type ReTripFlowTarget = {
  id: string;
  name: string;
  value: number;
  icon: 'museum' | 'cafe' | 'book' | 'calendar';
  tone: 'purple' | 'teal' | 'blue' | 'slate';
};

export type ReTripRecommendationStatus = 'recommendable' | 'caution' | 'paused';
export type ReTripCrowdLevel = 'High' | 'Moderate' | 'Low';

export type ReTripRecommendation = {
  id: string;
  rank: number;
  place: string;
  selectionRate: number;
  currentCrowd: ReTripCrowdLevel;
  capacityMargin: number;
  status: ReTripRecommendationStatus;
};

export type ReTripHourlyTrend = {
  bucket: string;
  occurrences: number;
  diversions: number;
  successRate: number;
};

export type ReTripControlAction = {
  id: string;
  label: string;
  icon: 'sliders' | 'exclude' | 'calendar' | 'star';
};

export type ReTripPolicyAdjustment = {
  id: string;
  time: string;
  manager: string;
  title: string;
  reason: string;
  tone: 'purple' | 'teal' | 'blue';
};

export type ReTripInsight = {
  id: string;
  title: string;
  description: string;
  icon: 'trend' | 'check' | 'up';
  tone: 'purple' | 'green' | 'blue';
};

export type ReTripMonitorSnapshot = {
  sourceArea: {
    name: string;
    status: string;
    occurrences: number;
  };
  kpis: ReTripKpi[];
  flowTargets: ReTripFlowTarget[];
  recommendations: ReTripRecommendation[];
  hourlyTrend: ReTripHourlyTrend[];
  controlActions: ReTripControlAction[];
  policyAdjustments: ReTripPolicyAdjustment[];
  insights: ReTripInsight[];
};
