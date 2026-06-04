import { discoverPerformanceDashboard } from '../mocks/discoverPerformance';
import { type DiscoverPerformanceDashboard } from '../types/discover';

export const discoverPerformanceInitialData = discoverPerformanceDashboard;

export async function getDiscoverPerformanceDashboard(): Promise<DiscoverPerformanceDashboard> {
  return discoverPerformanceDashboard;
}
