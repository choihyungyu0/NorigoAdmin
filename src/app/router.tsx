import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AreaDetailPage } from '../features/area-detail/AreaDetailPage';
import { CultureInsightsPage } from '../features/culture/CultureInsightsPage';
import { DataQualityPage } from '../features/data-quality/DataQualityPage';
import { DiscoverPerformancePage } from '../features/discover/DiscoverPerformancePage';
import { LiveMapPage } from '../features/live-map/LiveMapPage';
import { OverviewPage } from '../features/overview/OverviewPage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { ReTripMonitorPage } from '../features/retrip/ReTripMonitorPage';
import { AdminSettingsPage } from '../features/settings/AdminSettingsPage';
import { VisitorNoticeManagerPage } from '../features/notices/VisitorNoticeManagerPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'live-map', element: <LiveMapPage /> },
      { path: 'areas/:areaId', element: <AreaDetailPage /> },
      { path: 're-trip', element: <ReTripMonitorPage /> },
      { path: 'culture', element: <CultureInsightsPage /> },
      { path: 'discover', element: <DiscoverPerformancePage /> },
      { path: 'notices', element: <VisitorNoticeManagerPage /> },
      { path: 'data-quality', element: <DataQualityPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: '*', element: <Navigate replace to="/" /> },
    ],
  },
]);
