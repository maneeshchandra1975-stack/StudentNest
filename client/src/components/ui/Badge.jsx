import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

const badgeVariants = {
  verified: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  completed: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  secondary: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  inactive: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20',
  overdue: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  upcoming: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  low: 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] border-[var(--border-light)]',
};

export default function Badge({ children, variant = 'verified', className }) {
  const isVerifiedBadge = variant === 'verified' && !children;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-tight shadow-xs backdrop-blur-md',
        badgeVariants[variant] || badgeVariants.verified,
        className
      )}
    >
      {isVerifiedBadge ? (
        <>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>✓ Verified Student</span>
        </>
      ) : (
        children
      )}
    </span>
  );
}
