import { type CultureSignal } from '../types/culture';

export const cultureSignals: CultureSignal[] = [
  {
    id: 'culture-001',
    areaName: '명동 관광특구',
    category: '다국어 안내',
    signalCount: 214,
    severity: 'high',
    trend: '+22%',
    summary: '집계된 번역 도움 요청과 결제 문의가 동시에 증가했습니다.',
  },
  {
    id: 'culture-002',
    areaName: '북촌한옥마을',
    category: '생활 예절',
    signalCount: 128,
    severity: 'medium',
    trend: '+11%',
    summary: '소음과 사생활 보호 안내 반응이 높게 관측됩니다.',
  },
  {
    id: 'culture-003',
    areaName: '광화문광장',
    category: '행사 동선',
    signalCount: 74,
    severity: 'low',
    trend: '-4%',
    summary: '행사장 진입 방향 안내 이후 마찰 신호가 감소했습니다.',
  },
];
