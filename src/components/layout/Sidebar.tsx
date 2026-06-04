import {
  BarChart3,
  BellDot,
  Compass,
  Gauge,
  Landmark,
  LayoutDashboard,
  Map,
  Route,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Live Map', path: '/live-map', icon: Map },
  { label: 'Area Detail', path: '/areas/myeong-dong', icon: Landmark },
  { label: 'Re-Trip Monitor', path: '/re-trip', icon: Route },
  { label: 'Culture Insights', path: '/culture', icon: Compass },
  { label: 'Discover Performance', path: '/discover', icon: BarChart3 },
  { label: 'Notices', path: '/notices', icon: BellDot },
  { label: 'Data Quality', path: '/data-quality', icon: Gauge },
  { label: 'Reports', path: '/reports', icon: ShieldCheck },
  { label: 'Admin Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-sm font-black text-white">
          NG
        </div>
        <div>
          <p className="text-sm font-black text-slate-950">NoriGo Admin</p>
          <p className="text-xs font-medium text-slate-500">Seoul Tourism Ops</p>
        </div>
      </div>

      <nav className="space-y-1" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              className={({ isActive }) =>
                [
                  'flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                ].join(' ')
              }
              end={item.path === '/'}
              key={item.path}
              to={item.path}
            >
              <Icon aria-hidden="true" size={18} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
