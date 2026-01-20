import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ className, variant = 'primary', size = 'md', ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-white/10',
    outline: 'border border-indigo-500/30 bg-transparent text-indigo-400 hover:bg-indigo-500/10',
    danger: 'bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50',
        variants[variant],
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm',
        className
      )}
      {...props}
    />
  );
};