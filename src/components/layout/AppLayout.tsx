import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const pageTitles: Record<string, string> = {
  '/': 'Overview',
  '/live-map': 'Live Tourism Control',
  '/re-trip': 'Re-Trip Monitor',
  '/culture': 'Culture Insights',
  '/discover': 'Discover Performance',
  '/notices': 'Visitor Notice Manager',
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
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar pageTitle={resolvePageTitle(location.pathname)} />
          <main className="min-w-0 flex-1 overflow-auto px-4 py-1.5 lg:px-5 2xl:px-7 2xl:py-2.5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
