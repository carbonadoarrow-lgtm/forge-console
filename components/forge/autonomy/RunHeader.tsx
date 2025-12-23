"use client";

import { useState } from "react";
import {
  haltAutonomyRun,
  tickAutonomyRun,
  setAutonomyRunMode,
  type AutonomyRunMode,
} from "@/lib/api/autonomy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type RunHeaderProps = {
  runId: string;
  initialState: Record<string, any>;
};

export default function RunHeader({ runId, initialState }: RunHeaderProps) {
  const [state, setState] = useState<Record<string, any>>(initialState);
  const [busy, setBusy] = useState(false);

  const status = (state?.status as string) ?? "UNKNOWN";
  const env = (state?.env as string) ?? "dev";
  const lane = (state?.lane as string) ?? "innovation";
  const mode: AutonomyRunMode =
    (state?.mode as AutonomyRunMode | undefined) ?? "manual";

  async function doTick(approveBlocked: boolean) {
    setBusy(true);
    try {
      const res = await tickAutonomyRun(runId, approveBlocked);
      setState(res.state);
    } finally {
      setBusy(false);
    }
  }

  async function doHalt() {
    setBusy(true);
    try {
      const res = await haltAutonomyRun(runId, "halt_requested_via_cockpit");
      setState(res.state);
    } finally {
      setBusy(false);
    }
  }

  async function doSetMode(nextMode: AutonomyRunMode) {
    setBusy(true);
    try {
      const res = await setAutonomyRunMode(runId, nextMode);
      setState(res.state);
    } catch (e) {
      // Backend enforces policy (e.g., disallow autonomous for prod/protected lanes).
      // eslint-disable-next-line no-console
      console.error("failed to set mode", e);
    } finally {
      setBusy(false);
    }
  }

  const autonomousDisallowed =
    env.toLowerCase() === "prod" ||
    ["prod", "production"].includes(lane.toLowerCase());

  return (
    <Card className="space-y-3">
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-sm">{runId}</div>
            <div className="text-xs text-muted-foreground mt-1">
              status={status} · step={state?.step_idx ?? 0} · env={env} · lane={lane}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              mode={mode}
            </div>
            {state?.halt_reason ? (
              <div className="text-xs text-muted-foreground mt-1">
                halt_reason={state.halt_reason}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Mode</span>
                <select
                  className="rounded-md border px-2 py-1 text-xs bg-background"
                  value={mode}
                  disabled={busy}
                  onChange={(e) => doSetMode(e.target.value as AutonomyRunMode)}
                >
                  <option value="manual">manual</option>
                  <option value="assisted">assisted</option>
                  <option
                    value="autonomous"
                    disabled={autonomousDisallowed}
                  >
                    autonomous
                  </option>
                </select>
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => doTick(false)}
                disabled={busy}
              >
                Tick
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => doTick(true)}
                disabled={busy || status !== "BLOCKED"}
                title={
                  status !== "BLOCKED"
                    ? "Approve is only enabled in BLOCKED state"
                    : ""
                }
              >
                Approve & Resume
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={doHalt}
                disabled={busy || status === "HALT"}
              >
                Halt
              </Button>
            </div>
          </div>
        </div>

        <details className="rounded-xl border p-3">
          <summary className="text-sm cursor-pointer">State JSON</summary>
          <pre className="text-xs overflow-auto mt-2">
            {JSON.stringify(state, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}
