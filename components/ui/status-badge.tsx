import { Badge } from "@/components/ui/badge"
import type { RunStatus, SystemStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: RunStatus | SystemStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    queued: { variant: "secondary" as const, label: "Queued" },
    running: { variant: "default" as const, label: "Running" },
    succeeded: { variant: "success" as const, label: "Succeeded" },
    failed: { variant: "destructive" as const, label: "Failed" },
    cancelled: { variant: "outline" as const, label: "Cancelled" },
    ok: { variant: "success" as const, label: "OK" },
    warning: { variant: "warning" as const, label: "Warning" },
    error: { variant: "destructive" as const, label: "Error" },
    degraded: { variant: "warning" as const, label: "Degraded" },
  }

  const config = variants[status] || { variant: "outline" as const, label: status }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
