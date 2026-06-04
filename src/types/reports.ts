export type ReportTone = 'danger' | 'purple' | 'teal' | 'blue' | 'orange' | 'green' | 'slate';

export type ReportMetric = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  helper: string;
  delta: string;
  deltaTone: 'danger' | 'success' | 'neutral';
  tone: ReportTone;
  iconKey: 'alert' | 'retrip' | 'switch' | 'culture' | 'document' | 'clock';
};

export type ReportStatusItem = {
  id: string;
  label: string;
  value?: string;
  tone: 'green' | 'teal' | 'blue' | 'slate';
  iconKey: 'dot' | 'refresh' | 'calendar' | 'api';
};

export type ReportTemplate = {
  id: string;
  title: string;
  description: string;
  tone: ReportTone;
  iconKey: 'daily' | 'weekly' | 'monthly' | 'csv' | 'pdf';
};

export type ReportPreviewItem = {
  id: string;
  label: string;
  value: string;
  tone: ReportTone;
};

export type CongestionAreaReport = {
  id: string;
  rank: number;
  areaName: string;
  score: number;
  delta: string;
  deltaTone: 'danger' | 'success' | 'neutral';
};

export type CultureQuestionReport = {
  id: string;
  rank: number;
  question: string;
  count: number;
};

export type RetripEffectPoint = {
  time: string;
  retripCount: number;
  switchCount: number;
};

export type GeneratedReportFormat = 'PDF' | 'CSV';

export type GeneratedReport = {
  id: string;
  fileName: string;
  createdAt: string;
  format: GeneratedReportFormat;
  fileSize: string;
  status: '완료' | '대기';
};

export type ReportsDashboard = {
  generatedAtLabel: string;
  reportTitle: string;
  statusItems: ReportStatusItem[];
  metrics: ReportMetric[];
  templates: ReportTemplate[];
  previewItems: ReportPreviewItem[];
  topAreas: CongestionAreaReport[];
  cultureQuestions: CultureQuestionReport[];
  retripEffect: RetripEffectPoint[];
  generatedReports: GeneratedReport[];
};
