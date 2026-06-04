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
