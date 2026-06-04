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
