import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Bell, ChevronDown, Search } from 'lucide-react';

type TopbarProps = {
  pageTitle: string;
};

const operationTime = format(new Date(2025, 4, 19, 10, 32), 'yyyy.MM.dd (EEE) HH:mm', {
  locale: ko,
});

export function Topbar({ pageTitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">NoriGo Control Center</p>
          <h1 className="truncate text-2xl font-black tracking-normal text-slate-950">{pageTitle}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            실시간
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
            {operationTime}
          </span>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
            type="button"
          >
            서울시 전체
            <ChevronDown aria-hidden="true" size={16} />
          </button>
          <label className="flex h-10 w-64 max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500">
            <Search aria-hidden="true" size={17} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              placeholder="장소, 지역 검색"
              type="search"
            />
          </label>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600"
            type="button"
            aria-label="알림"
          >
            <Bell aria-hidden="true" size={18} />
          </button>
          <div className="hidden min-w-0 border-l border-slate-200 pl-3 xl:block">
            <p className="text-sm font-black text-slate-800">서울시 관광 운영팀</p>
            <p className="text-xs font-bold text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
