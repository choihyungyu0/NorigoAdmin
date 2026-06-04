import { type HTMLAttributes, type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <section
      className={cn('rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40', className)}
      {...props}
    >
      {children}
    </section>
  );
}
