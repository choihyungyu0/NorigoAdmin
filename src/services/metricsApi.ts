import { areaDetailSnapshots } from '../mocks/areaDetail';
import { apiHealthChecks, areaMetrics } from '../mocks/areaMetrics';
import { overviewDashboard } from '../mocks/overview';

export async function getOverviewMetrics() {
  return overviewDashboard;
}

export async function getAreaMetrics() {
  return areaMetrics;
}

export async function getAreaMetricById(areaId: string) {
  return areaMetrics.find((area) => area.id === areaId) ?? areaMetrics[0];
}

export async function getAreaDetailById(areaId: string) {
  return areaDetailSnapshots.find((area) => area.id === areaId) ?? areaDetailSnapshots[0];
}

export async function getApiHealthChecks() {
  return apiHealthChecks;
}
