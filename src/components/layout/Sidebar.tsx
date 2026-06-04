import {
  BarChart3,
  BellDot,
  Database,
  FileText,
  Gauge,
  Grid2X2,
  Home,
  MapPin,
  PanelLeftClose,
  RefreshCcw,
  Settings,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Overview', path: '/', icon: Home },
  { label: 'Live Map', path: '/live-map', icon: MapPin },
  { label: 'Area Detail', path: '/areas/bukchon', icon: Grid2X2 },
  { label: 'Re-Trip Monitor', path: '/re-trip', icon: RefreshCcw },
  { label: 'Culture Insights', path: '/culture', icon: Gauge },
  { label: 'Discover Performance', path: '/discover', icon: BarChart3 },
  { label: 'Notices', path: '/notices', icon: BellDot },
  { label: 'Data Quality', path: '/data-quality', icon: Database },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Admin Settings', path: '/settings', icon: Settings },
];

function LogoMark() {
  return (
    <span className="relative block h-11 w-11 shrink-0">
      <span className="absolute left-1 top-3 h-6 w-3 rounded-sm bg-blue-600" />
      <span className="absolute left-3.5 top-1 h-9 w-3 rounded-sm bg-cyan-500" />
      <span className="absolute left-6 top-2 h-8 w-3 rounded-sm bg-amber-400" />
      <span className="absolute left-3.5 top-8 h-3 w-3 rounded-sm bg-blue-500" />
    </span>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[216px] shrink-0 border-r border-slate-200 bg-white px-3 py-5 lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3 px-3">
        <LogoMark />
        <span className="text-[26px] font-black tracking-normal text-blue-600">NoriGo</span>
      </div>

      <nav className="space-y-2.5" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              className={({ isActive }) =>
                [
                  'flex h-[43px] items-center gap-3 rounded-lg px-3 text-[14px] font-bold transition',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950',
                ].join(' ')
              }
              end={item.path === '/'}
              key={item.path}
              to={item.path}
            >
              <Icon aria-hidden="true" size={20} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        className="mt-auto flex h-12 items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700"
        type="button"
      >
        <PanelLeftClose aria-hidden="true" size={20} />
        사이트맵 접기
      </button>
    </aside>
  );
}
