export type CultureSignalSeverity = 'low' | 'medium' | 'high';

export type CultureSignal = {
  id: string;
  areaName: string;
  category: string;
  signalCount: number;
  severity: CultureSignalSeverity;
  trend: string;
  summary: string;
};

export type CultureMetricTone = 'purple' | 'orange' | 'blue' | 'emerald' | 'red' | 'violet';

export type CultureMetricId =
  | 'todayScan'
  | 'foreignerConfusion'
  | 'growthAreas'
  | 'supportedLanguages'
  | 'guideNeededPlaces'
  | 'improvementPriority';

export type CultureMetric = {
  id: CultureMetricId;
  label: string;
  value: string;
  unit: string;
  caption: string;
  delta: string;
  tone: CultureMetricTone;
};

export type CulturePlaceScan = {
  rank: number;
  place: string;
  scanCount: number;
  deltaPercent: number;
};

export type CultureObjectIcon = 'cash' | 'seat' | 'bell' | 'camera' | 'temple' | 'etc';

export type CultureScannedObject = {
  id: string;
  label: string;
  count: number;
  percent: number;
  icon: CultureObjectIcon;
  tone: 'emerald' | 'violet' | 'orange' | 'slate' | 'blue';
};

export type CultureQuestion = {
  rank: number;
  question: string;
  count: number;
  percent: number;
};

export type CultureLanguageDistribution = {
  language: string;
  count: number;
  percent: number;
  color: string;
};

export type CultureConfusionSignal = {
  rank: number;
  type: string;
  count: number;
  deltaPercent: number;
};

export type CultureGuideImprovement = {
  rank: number;
  place: string;
  signalCount: number;
  needLevel: '높음' | '보통' | '낮음';
};

export type CultureHotspotTone = 'red' | 'orange' | 'blue';

export type CultureQuestionHotspot = {
  rank: number;
  place: string;
  lat: number;
  lng: number;
  increasePercent: number;
  tone: CultureHotspotTone;
};

export type CultureInsightSummary = {
  title: string;
  bullets: string[];
  actionLabel: string;
};

export type CultureInsightsSnapshot = {
  operationDate: string;
  updatedAt: string;
  monitoredAreaCount: number;
  receivedAreaCount: number;
  apiUptime: string;
  metrics: CultureMetric[];
  placeScans: CulturePlaceScan[];
  scannedObjects: CultureScannedObject[];
  frequentQuestions: CultureQuestion[];
  otherQuestion: Omit<CultureQuestion, 'rank'>;
  languageDistribution: CultureLanguageDistribution[];
  confusionSignals: CultureConfusionSignal[];
  guideImprovements: CultureGuideImprovement[];
  questionHotspots: CultureQuestionHotspot[];
  summary: CultureInsightSummary;
};
