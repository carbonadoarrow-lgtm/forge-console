"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";

function isErrorEvent(ev: any): boolean {
  const t = (ev?.type ?? "").toString().toUpperCase();
  return (
    t.includes("ERROR") ||
    t.includes("FAILED") ||
    t.includes("BLOCKED") ||
    t.includes("EXCEPTION") ||
    t.includes("AUDIT_FAILED")
  );
}

export default function LastErrorPanel({
  events,
  state,
}: {
  events: Array<Record<string, any>>;
  state: Record<string, any>;
}) {
  const lastErr = useMemo(() => {
    if (!Array.isArray(events) || events.length === 0) return null;
    for (let i = events.length - 1; i >= 0; i--) {
      const ev = events[i] as any;
      if (isErrorEvent(ev)) return ev;
    }
    return null;
  }, [events]);

  const status = state?.status ?? "UNKNOWN";

  if (!lastErr && status !== "FAILED" && status !== "BLOCKED" && status !== "ERROR") {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-2">
        <div className="text-sm text-muted-foreground">Last error</div>
        {lastErr ? (
          <pre className="text-xs overflow-auto rounded-lg border p-2">
            {JSON.stringify(lastErr, null, 2)}
          </pre>
        ) : (
          <div className="text-xs text-muted-foreground">
            status={status} (no explicit error event found in tail)
          </div>
        )}
      </CardContent>
    </Card>
  );
}
