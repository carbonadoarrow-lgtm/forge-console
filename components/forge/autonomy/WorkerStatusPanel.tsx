"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  getAutonomyWorkerStatus,
  listAutonomyRuns,
  tickAutonomyWorkerOnce,
  type AutonomyRunMode,
  type AutonomyWorkerStatus,
  type AutonomyWorkerTickSummary,
  type AutonomyRunSummary,
} from "@/lib/api/autonomy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type WorkerStatusPanelProps = {
  adminTokenHeaderName?: string;
};

type WorkerStatusWithRuns = {
  status: AutonomyWorkerStatus | null;
  runs: AutonomyRunSummary[];
};

export default function WorkerStatusPanel({ adminTokenHeaderName }: WorkerStatusPanelProps) {
  const [data, setData] = useState<WorkerStatusWithRuns>({ status: null, runs: [] });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [lastTick, setLastTick] = useState<AutonomyWorkerTickSummary | null>(null);

  async function refresh() {
    setErr(null);
    try {
      const [statusRes, runsRes] = await Promise.all([
        getAutonomyWorkerStatus(),
        listAutonomyRuns(),
      ]);

      const autonomousRuns =
        runsRes.runs?.filter((r) => (r.mode as AutonomyRunMode | null) === "autonomous") ?? [];

      setData({
        status: statusRes,
        runs: autonomousRuns,
      });
    } catch (e: any) {
      setErr(e?.message || "failed to load worker status");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onTickOnce() {
    setBusy(true);
    setErr(null);
    try {
      const res = await tickAutonomyWorkerOnce();
      setLastTick(res);
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "worker tick failed");
    } finally {
      setBusy(false);
    }
  }

  const enabled = data.status?.enabled ?? false;

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-medium">Autonomy Worker</div>
            <div className="text-xs text-muted-foreground">
              Background autonomy is{" "}
              <span className={enabled ? "text-green-600" : "text-red-600"}>
                {enabled ? "enabled" : "disabled"}
              </span>
              .
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={refresh}
              disabled={busy}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={onTickOnce}
              disabled={busy || !enabled}
              title={
                enabled
                  ? "Trigger one bounded worker tick invocation (admin only)"
                  : "Worker is disabled by policy or env; see backend configuration"
              }
            >
              Tick worker once
            </Button>
          </div>
        </div>

        {adminTokenHeaderName ? (
          <div className="text-xs text-muted-foreground">
            Protected endpoint. Ensure requests include{" "}
            <code className="bg-muted px-1 rounded">{adminTokenHeaderName}</code>.
          </div>
        ) : null}

        {err ? <div className="text-xs text-red-600">{err}</div> : null}

        {data.status ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-muted-foreground">Status</div>
              <div>enabled: {String(data.status.enabled)}</div>
              <div>last_tick_at: {data.status.last_tick_at ?? "—"}</div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-muted-foreground">Caps</div>
              {data.status.caps ? (
                <pre className="text-xs bg-muted rounded p-2 overflow-auto">
                  {JSON.stringify(data.status.caps, null, 2)}
                </pre>
              ) : (
                <div className="text-muted-foreground">No caps reported.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            Worker status endpoint returned no data. It may be disabled or not yet configured.
          </div>
        )}

        {lastTick ? (
          <div className="rounded border bg-muted/30 p-2 text-xs space-y-1">
            <div className="font-semibold text-muted-foreground">Last tick summary</div>
            <div>enabled: {String(lastTick.enabled)}</div>
            <div>considered: {lastTick.considered}</div>
            <div>ticked: {lastTick.ticked}</div>
            <div>skipped: {lastTick.skipped}</div>
            <div>errors: {lastTick.errors}</div>
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="text-sm font-medium">Autonomous runs</div>
          {data.runs.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              No runs currently in autonomous mode.
            </div>
          ) : (
            <div className="space-y-1 text-xs">
              {data.runs.map((r) => (
                <div
                  key={r.run_id}
                  className="flex items-center justify-between rounded border px-2 py-1"
                >
                  <div className="space-y-0.5">
                    <div className="font-mono text-xs">{r.run_id}</div>
                    <div className="text-[10px] text-muted-foreground">
                      status={r.status ?? "UNKNOWN"} · env={r.env ?? "?"} · lane={r.lane ?? "?"}
                    </div>
                  </div>
                  <a
                    href={`/forge/builder/${encodeURIComponent(r.run_id)}`}
                    className="text-xs underline"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
