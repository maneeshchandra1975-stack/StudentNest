import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No items found',
  description = 'There are no items to display right now.',
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div className={cn('sn-card p-10 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto', className)}>
      <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold text-[var(--text-main)] font-heading">{title}</h4>
        <p className="text-xs text-[#64748B] leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
