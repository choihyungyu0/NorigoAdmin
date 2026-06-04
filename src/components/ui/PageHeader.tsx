import { type ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-wide text-blue-700">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-black tracking-normal text-slate-950">{title}</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{description}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
