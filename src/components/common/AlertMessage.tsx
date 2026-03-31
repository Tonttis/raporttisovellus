'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertMessageProps {
  type: AlertType;
  title?: string;
  message: string;
  className?: string;
  onClose?: () => void;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    className: 'border-green-200 bg-green-50 text-green-800',
    iconClass: 'text-green-600',
  },
  error: {
    icon: XCircle,
    className: 'border-red-200 bg-red-50 text-red-800',
    iconClass: 'text-red-600',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    iconClass: 'text-yellow-600',
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-800',
    iconClass: 'text-blue-600',
  },
};

export function AlertMessage({ type, title, message, className, onClose }: AlertMessageProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <Alert className={cn(config.className, 'text-base', className)}>
      <Icon className={cn('h-5 w-5', config.iconClass)} />
      {title && <AlertTitle className="text-base font-semibold">{title}</AlertTitle>}
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-sm underline hover:no-underline"
          >
            Sulje
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
