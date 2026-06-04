import { areaDetailSnapshots } from '../mocks/areaDetail';
import { apiHealthChecks, areaMetrics, cityRiskTrend } from '../mocks/areaMetrics';
import { cultureSignals } from '../mocks/cultureSignals';
import { dataQualityIssues } from '../mocks/dataQualityIssues';
import { retripFlows } from '../mocks/retripFlows';

export async function getOverviewMetrics() {
  const totalCrowd = areaMetrics.reduce((sum, area) => sum + area.crowdCount, 0);
  const averageRisk = Math.round(areaMetrics.reduce((sum, area) => sum + area.riskScore, 0) / areaMetrics.length);
  const totalRetripFlow = retripFlows.reduce((sum, flow) => sum + flow.aggregateVisitors, 0);
  const highFrictionSignals = cultureSignals.reduce((sum, signal) => sum + signal.signalCount, 0);

  return {
    serviceAreaCount: 121,
    totalCrowd,
    averageRisk,
    totalRetripFlow,
    highFrictionSignals,
    cityRiskTrend,
    topRiskAreas: [...areaMetrics].sort((a, b) => b.riskScore - a.riskScore),
    apiHealthChecks,
    dataQualityOpenCount: dataQualityIssues.filter((issue) => issue.status !== 'resolved').length,
  };
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
