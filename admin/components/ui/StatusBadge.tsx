import React from 'react';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getColors = (s: string) => {
    switch (s) {
      case 'ACTIVE':
      case 'PUBLISHED':
      case 'HEALTHY':
      case 'PUBLISHING_MODE':
      case '100% OPERATIONAL':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'SCREENING':
      case 'PEER_REVIEW':
      case 'PREPARATION_MODE':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'PENDING_VERIFICATION':
      case 'REVISION':
      case 'DEGRADED':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'SUSPENDED':
      case 'REJECTED':
      case 'MAINTENANCE':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border',
        getColors(status),
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
