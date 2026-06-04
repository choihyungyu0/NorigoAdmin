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
