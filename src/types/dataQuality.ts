export type IssueSeverity = 'low' | 'medium' | 'high';

export type DataQualityIssue = {
  id: string;
  source: string;
  issue: string;
  severity: IssueSeverity;
  status: 'open' | 'reviewing' | 'resolved';
  affectedAreas: number;
  detectedAt: string;
};

export type DataQualityTone = 'success' | 'info' | 'purple' | 'warning' | 'danger' | 'cyan' | 'neutral';

export type DataQualityTrendDirection = 'up' | 'down' | 'flat';

export type DataQualitySummaryCard = {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  denominator?: string;
  subLabel: string;
  trendLabel?: string;
  trendDirection?: DataQualityTrendDirection;
  tone: DataQualityTone;
  iconSrc: string;
};

export type DataCollectionSource = {
  id: string;
  source: string;
  icon: 'city' | 'tourism' | 'app' | 'mapping';
  normal: number;
  normalRate: string;
  delayed: number;
  delayedRate: string;
  failed: number;
  failedRate: string;
  total: number;
  lastReceived: string;
  status: '정상' | '주의';
};

export type CoordinateAccuracySlice = {
  id: string;
  label: string;
  description: string;
  count: number;
  ratio: string;
  color: string;
};

export type MissingPlaceIssue = {
  id: string;
  placeName: string;
  address: string;
  issueType: string;
  tone: 'warning' | 'danger' | 'cyan';
};

export type MatchingFailure = {
  id: string;
  source: string;
  icon: DataCollectionSource['icon'];
  expectedValue: string;
  issueType: string;
  tone: 'warning' | 'danger' | 'info' | 'cyan';
  lastCheckedAt: string;
};

export type QualityFieldOption = {
  label: string;
  tone: 'success' | 'info' | 'warning' | 'danger';
};

export type QualityField = {
  id: string;
  name: string;
  description: string;
  options: QualityFieldOption[];
};

export type QualityTimelineEvent = {
  id: string;
  time: string;
  title: string;
  description: string;
  operator: string;
  tone: 'success' | 'info' | 'warning' | 'danger';
};
