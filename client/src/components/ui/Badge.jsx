import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

const badgeVariants = {
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  upcoming: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-[var(--border-light)]',
};

export default function Badge({ children, variant = 'verified', className }) {
  const isVerifiedBadge = variant === 'verified' && !children;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-tight',
        badgeVariants[variant] || badgeVariants.verified,
        className
      )}
    >
      {isVerifiedBadge ? (
        <>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>✓ Verified Student</span>
        </>
      ) : (
        children
      )}
    </span>
  );
}
