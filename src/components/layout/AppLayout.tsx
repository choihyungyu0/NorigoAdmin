import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const pageTitles: Record<string, string> = {
  '/': 'Overview',
  '/live-map': 'Live Map',
  '/re-trip': 'Re-Trip Monitor',
  '/culture': 'Culture Insights',
  '/discover': 'Discover Performance',
  '/notices': 'Visitor Notices',
  '/data-quality': 'Data Quality',
  '/reports': 'Reports',
  '/settings': 'Admin Settings',
};

function resolvePageTitle(pathname: string) {
  if (pathname.startsWith('/areas/')) {
    return 'Area Detail';
  }

  return pageTitles[pathname] ?? 'Overview';
}

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar pageTitle={resolvePageTitle(location.pathname)} />
          <main className="min-w-0 flex-1 px-6 py-5 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
