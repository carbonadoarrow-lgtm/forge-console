"use client";

import { useEffect, useState } from "react";
import { getAutonomyRun } from "@/lib/api/autonomy";
import { Card, CardContent } from "@/components/ui/card";
import RunPlanPanel from "./RunPlanPanel";
import LastErrorPanel from "./LastErrorPanel";
import RecoveryPanel from "./RecoveryPanel";

type RunTimelineProps = {
  runId: string;
  initialEvents: Array<Record<string, any>>;
  initialState: Record<string, any>;
  initialLinkedJob?: Record<string, any> | null;
  initialLastError?: Record<string, any> | null;
};

export default function RunTimeline({
  runId,
  initialEvents,
  initialState,
  initialLinkedJob,
  initialLastError,
}: RunTimelineProps) {
  const [events, setEvents] = useState(initialEvents || []);
  const [state, setState] = useState(initialState || {});
  const [linkedJob, setLinkedJob] = useState<Record<string, any> | null>(initialLinkedJob || null);
  const [lastError, setLastError] = useState<Record<string, any> | null>(initialLastError || null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await getAutonomyRun(runId);
        setEvents(res.events || []);
        setState(res.state || {});
        setLinkedJob((res as any).linked_job || null);
        setLastError((res as any).last_error || null);
        setErr(null);
      } catch (e: any) {
        setErr(e?.message || "poll failed");
      }
    }, 2000);

    return () => clearInterval(id);
  }, [runId]);

  return (
    <Card className="space-y-3">
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Timeline</div>
          <div className="text-xs text-muted-foreground">polled every 2s</div>
        </div>

        {err ? <div className="text-xs text-red-600">{err}</div> : null}

        <RunPlanPanel runId={runId} state={state} lastError={lastError || undefined} />

        <RecoveryPanel runId={runId} state={state} lastError={lastError || undefined} />

        <LastErrorPanel events={events} state={state} />

        <div className="rounded-xl border p-3 space-y-1">
          <div className="text-sm text-muted-foreground">Linked Job</div>
          {linkedJob ? (
            <div className="text-xs space-y-1">
              <div>
                job_id: <span className="font-mono">{linkedJob.job_id}</span>
              </div>
              <div>
                job_type: <span className="font-mono">{linkedJob.job_type ?? "—"}</span>
              </div>
              <div>
                status: <span className="font-mono">{linkedJob.status ?? "—"}</span>
              </div>
              <div>
                message: <span className="font-mono">{linkedJob.message ?? "—"}</span>
              </div>

              <details className="mt-2 rounded-lg border p-2">
                <summary className="cursor-pointer">Raw Job JSON</summary>
                <pre className="text-xs overflow-auto mt-2">
                  {JSON.stringify(linkedJob.raw ?? linkedJob, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No linked job found in state.</div>
          )}
        </div>

        <div className="space-y-2">
          {events.length === 0 ? (
            <div className="text-sm text-muted-foreground">No events.</div>
          ) : (
            events
              .slice()
              .reverse()
              .map((ev, idx) => (
                <div key={idx} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xs">{(ev as any).type ?? "EVENT"}</div>
                    <div className="text-xs text-muted-foreground">{(ev as any).ts ?? ""}</div>
                  </div>
                  <pre className="text-xs overflow-auto mt-2">{JSON.stringify(ev, null, 2)}</pre>
                </div>
              ))
          )}
        </div>

        <details className="rounded-xl border p-3">
          <summary className="text-sm cursor-pointer">Current state snapshot</summary>
          <pre className="text-xs overflow-auto mt-2">{JSON.stringify(state, null, 2)}</pre>
        </details>
      </CardContent>
    </Card>
  );
}
