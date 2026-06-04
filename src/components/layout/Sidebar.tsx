import {
  BarChart3,
  Bell,
  Database,
  FileText,
  Grid2X2,
  Home,
  MapPin,
  PanelLeftClose,
  RefreshCcw,
  Settings,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { iconAssets } from '../../lib/assetPaths';

const navItems: Array<{ label: string; path: string; icon: LucideIcon }> = [
  { label: 'Overview', path: '/', icon: Home },
  { label: 'Live Map', path: '/live-map', icon: MapPin },
  { label: 'Area Detail', path: '/areas/bukchon', icon: Grid2X2 },
  { label: 'Re-Trip Monitor', path: '/re-trip', icon: RefreshCcw },
  { label: 'Culture Insights', path: '/culture', icon: BarChart3 },
  { label: 'Discover Performance', path: '/discover', icon: TrendingUp },
  { label: 'Notices', path: '/notices', icon: Bell },
  { label: 'Data Quality', path: '/data-quality', icon: Database },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Admin Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[262px] shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:flex lg:flex-col">
      <div className="mb-8 flex h-[78px] items-center px-2">
        <img className="h-auto w-[204px] object-contain object-left" src={iconAssets.brandLogo} alt="NoriGo" />
      </div>

      <nav className="space-y-3" aria-label="Dashboard navigation">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              className={({ isActive }) =>
                [
                  'flex h-[56px] items-center gap-3.5 rounded-lg px-4 text-[15px] font-bold transition',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950',
                ].join(' ')
              }
              end={item.path === '/'}
              key={item.path}
              to={item.path}
            >
              <Icon aria-hidden="true" size={25} strokeWidth={2.1} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        className="mt-auto flex h-[58px] items-center gap-4 rounded-lg border border-slate-200 bg-white px-5 text-[15px] font-bold text-slate-700 transition hover:bg-slate-50"
        type="button"
      >
        <PanelLeftClose aria-hidden="true" size={23} strokeWidth={2.1} />
        사이드바 접기
      </button>
    </aside>
  );
}
