'use client';

import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6 md:mb-8', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h1>
          {description && (
            <p className="text-slate-600 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
