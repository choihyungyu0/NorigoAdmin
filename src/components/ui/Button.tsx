import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100',
  danger: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({ children, className, variant = 'secondary', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
