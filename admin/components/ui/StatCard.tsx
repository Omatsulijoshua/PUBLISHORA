import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  description,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-lg relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
          {value}
        </div>
        {change && (
          <span
            className={cn(
              'text-xs font-mono font-medium px-2 py-0.5 rounded-full',
              isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            )}
          >
            {change}
          </span>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
          {description}
        </p>
      )}
    </div>
  );
}
