import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarDays, ChevronDown, Search, UserRound } from 'lucide-react';

type TopbarProps = {
  pageTitle: string;
};

const operationTime = format(new Date(2025, 4, 19, 10, 32), 'yyyy.MM.dd (EEE) HH:mm', {
  locale: ko,
});

export function Topbar({ pageTitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 h-[76px] border-b border-slate-200 bg-white/95 px-6 backdrop-blur lg:px-8">
      <div className="flex h-full min-w-0 items-center justify-between gap-6">
        <h1 className="min-w-[340px] truncate font-admin-title text-[31px] leading-none tracking-normal text-slate-950">
          {pageTitle}
        </h1>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
          <span className="hidden items-center gap-3 text-[16px] font-bold text-slate-800 xl:inline-flex">
            <CalendarDays aria-hidden="true" size={20} strokeWidth={2.2} />
            <span className="font-number">{operationTime}</span>
          </span>
          <span className="inline-flex h-10 items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-[15px] font-black text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            실시간
          </span>
          <button
            className="inline-flex h-10 min-w-[156px] items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 text-[15px] font-bold text-slate-800 transition hover:bg-slate-50"
            type="button"
          >
            서울시 전체
            <ChevronDown aria-hidden="true" size={17} strokeWidth={2.2} />
          </button>
          <label className="hidden h-10 w-[260px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-500 xl:flex 2xl:w-[340px]">
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
              placeholder="장소, 지역 검색"
              type="search"
            />
            <Search aria-hidden="true" size={20} strokeWidth={2.2} />
          </label>
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
              <UserRound aria-hidden="true" size={24} strokeWidth={2.2} />
            </span>
            <div className="hidden min-w-0 leading-tight 2xl:block">
              <p className="truncate text-[15px] font-black text-slate-900">서울시 관광 운영팀</p>
              <p className="text-[13px] font-bold text-slate-500">Admin</p>
            </div>
            <ChevronDown aria-hidden="true" className="text-slate-500" size={17} strokeWidth={2.2} />
          </div>
        </div>
      </div>
    </header>
  );
}
