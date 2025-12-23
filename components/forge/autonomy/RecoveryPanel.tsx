"use client";

import * as React from "react";
import { useState } from "react";
import { approveAndTickAutonomyRun, continueAutonomyRun, retryAutonomyRun } from "@/lib/api/autonomy";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type RecoveryPanelProps = {
  runId: string;
  state: Record<string, any>;
  lastError?: {
    source?: string;
    state_status?: string | null;
    event?: Record<string, any> | null;
    job?: {
      status?: string | null;
      message?: string | null;
      job_id?: string | null;
      job_type?: string | null;
    } | null;
  } | null;
};

export default function RecoveryPanel({ runId, state, lastError }: RecoveryPanelProps) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const rawStatus = state?.status ?? "UNKNOWN";
  const status = String(rawStatus).toUpperCase();

  const canRetry = status === "FAILED" || status === "ERROR";
  const canApproveContinue = status === "BLOCKED";
  const canContinue = !["HALT", "FAILED", "ERROR", "BLOCKED"].includes(status);

  async function wrap(fn: () => Promise<void>) {
    setBusy(true);
    setErr(null);
    try {
      await fn();
    } catch (e: any) {
      setErr(e?.message || "recovery action failed");
    } finally {
      setBusy(false);
    }
  }

  function onRetry() {
    void wrap(async () => {
      await retryAutonomyRun(runId);
      // RunTimeline polling will refresh UI; nothing else to do.
    });
  }

  function onApproveAndContinue() {
    void wrap(async () => {
      await approveAndTickAutonomyRun(runId);
    });
  }

  function onContinue() {
    void wrap(async () => {
      await continueAutonomyRun(runId);
    });
  }

  const summarySource = lastError?.source ?? null;
  const summaryStatus = lastError?.state_status ?? rawStatus;
  const summaryMessage =
    lastError?.job?.message ||
    (lastError?.event ? String(lastError.event.type || "") : null) ||
    null;

  // Hide panel if there is clearly nothing to recover from and status is healthy.
  if (!lastError && !canRetry && !canApproveContinue && !canContinue) {
    return null;
  }

  return (
    <Card className="border-dashed">
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Recovery</div>
          <div className="text-xs text-muted-foreground">status={summaryStatus ?? "UNKNOWN"}</div>
        </div>

        {summarySource || summaryMessage ? (
          <div className="text-xs text-muted-foreground">
            {summarySource ? <span>source={summarySource} · </span> : null}
            {summaryMessage ? <span>hint={summaryMessage}</span> : null}
          </div>
        ) : null}

        {err ? <div className="text-xs text-red-600">{err}</div> : null}

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            disabled={busy || !canRetry}
            title={canRetry ? "" : "Retry enabled only when run is in FAILED/ERROR state"}
          >
            Retry
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onApproveAndContinue}
            disabled={busy || !canApproveContinue}
            title={canApproveContinue ? "" : "Approve & Continue enabled only when status is BLOCKED"}
          >
            Approve + Continue
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onContinue}
            disabled={busy || !canContinue}
            title={canContinue ? "" : "Continue disabled for HALT/FAILED/ERROR/BLOCKED runs"}
          >
            Continue (tick once)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
