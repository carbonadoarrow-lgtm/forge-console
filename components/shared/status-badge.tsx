import { Badge } from '@/components/ui/badge';
import { RunStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: RunStatus | 'ok' | 'warning' | 'error' | 'degraded' | 'critical';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'info'> = {
    succeeded: 'success',
    ok: 'success',
    running: 'info',
    queued: 'secondary',
    failed: 'destructive',
    error: 'destructive',
    critical: 'destructive',
    cancelled: 'secondary',
    warning: 'warning',
    degraded: 'warning',
  };

  const labels: Record<string, string> = {
    succeeded: 'Succeeded',
    ok: 'OK',
    running: 'Running',
    queued: 'Queued',
    failed: 'Failed',
    error: 'Error',
    critical: 'Critical',
    cancelled: 'Cancelled',
    warning: 'Warning',
    degraded: 'Degraded',
  };

  return (
    <Badge variant={variants[status] || 'secondary'} className={className}>
      {labels[status] || status}
    </Badge>
  );
}
