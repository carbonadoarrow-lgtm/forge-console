"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  approveAndTickAutonomyRun,
  continueAutonomyRun,
  tickAutonomyRun,
  type AutonomyRunDetail,
} from "@/lib/api/autonomy";
import type { RunPlanStep } from "@/lib/forge/autonomy/templates";
import { selectRunPlanCurrentStepIndex } from "@/lib/forge/autonomy/run-plan";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";

type RunPlanData = {
  templateId: string;
  steps: RunPlanStep[];
};

type RunPlanPanelProps = {
  runId: string;
  state: AutonomyRunDetail["state"];
  lastError?: AutonomyRunDetail["last_error"];
};

export default function RunPlanPanel({ runId, state, lastError }: RunPlanPanelProps) {
  const [planData, setPlanData] = useState<RunPlanData | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`run_plan_${runId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored) as RunPlanData | (RunPlanData & { currentStepIndex?: number });
        // We intentionally ignore any persisted currentStepIndex; the active step
        // is derived heuristically from the latest run state and last_error.
        setPlanData({
          templateId: data.templateId,
          steps: data.steps,
        });
      } catch (e) {
        console.error("Failed to parse run plan data", e);
      }
    }
  }, [runId]);

  const rawStatus = state?.status ?? "UNKNOWN";
  const status = String(rawStatus).toUpperCase();

  // Determine current step index based on run status and presence of last_error.
  const effectiveCurrentStepIndex =
    planData && planData.steps.length > 0
      ? selectRunPlanCurrentStepIndex(planData.steps, {
          status,
          last_error: lastError ?? null,
        })
      : 0;
  const currentStep = planData?.steps[effectiveCurrentStepIndex];
  const isBlocked = status === "BLOCKED";
  const isCompleted = status === "SUCCESS" || status === "HALT";

  // Heuristic: if blocked and current step requires approval, stay on that step
  // Otherwise, if the run has an error, we might be stuck
  const shouldShowPanel = planData && !isCompleted;

  if (!shouldShowPanel) {
    return null;
  }

  const handleStepAction = async () => {
    if (!currentStep) return;

    setBusy(true);
    setErr(null);

    try {
      switch (currentStep.action_type) {
        case "approve_and_tick":
          await approveAndTickAutonomyRun(runId);
          break;
        case "continue":
          await continueAutonomyRun(runId);
          break;
        case "tick_once":
          await tickAutonomyRun(runId, false);
          break;
        default:
          throw new Error(`Unsupported action type: ${currentStep.action_type}`);
      }
      // No mutation of backend state beyond the explicit cockpit action.
      // We do not advance any client-side step index; highlighting is
      // derived heuristically from the latest run status and last_error.
    } catch (e: any) {
      setErr(e?.message || "Failed to execute step action");
    } finally {
      setBusy(false);
    }
  };

  const getStepIcon = (index: number) => {
    if (index < effectiveCurrentStepIndex) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (index === effectiveCurrentStepIndex) {
      if (isBlocked && currentStep?.requires_approval) {
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      }
      return <Clock className="w-4 h-4 text-blue-500" />;
    }
    return <Circle className="w-4 h-4 text-gray-300" />;
  };

  const getStepStatus = (index: number) => {
    if (index < effectiveCurrentStepIndex) return "completed";
    if (index === effectiveCurrentStepIndex) return "current";
    return "pending";
  };

  const canExecuteCurrentStep = () => {
    if (!currentStep) return false;
    
    // If step requires approval and run is blocked, we can execute
    if (currentStep.requires_approval && isBlocked) return true;
    
    // If step doesn't require approval and run is not in a terminal state
    if (!currentStep.requires_approval && !["HALT", "FAILED", "ERROR"].includes(status)) return true;
    
    return false;
  };

  return (
    <Card className="border-dashed border-blue-300">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Run Plan: {planData?.templateId}</div>
          <div className="text-xs text-muted-foreground">
            Step {effectiveCurrentStepIndex + 1} of {planData?.steps.length}
          </div>
        </div>

        {err && (
          <div className="text-xs text-red-600 p-2 bg-red-50 rounded">{err}</div>
        )}

        <div className="space-y-2">
          {planData?.steps.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-2 rounded ${
                  status === "current" ? "bg-blue-50" : ""
                }`}
              >
                <div className="mt-0.5">{getStepIcon(index)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{step.title}</div>
                    {status === "current" && (
                      <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        Current
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                  {status === "current" && (
                    <div className="text-xs mt-2 space-y-1">
                      <div>
                        <span className="font-medium">Action:</span>{" "}
                        <code className="text-xs bg-gray-100 px-1 rounded">
                          {step.action_type}
                        </code>
                      </div>
                      {step.requires_approval && (
                        <div className="text-amber-600">
                          Requires operator approval
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {currentStep && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                {currentStep.requires_approval && isBlocked ? (
                  <span className="text-amber-600">
                    Run is blocked. Use "Approve + Continue" below or in Recovery Panel.
                  </span>
                ) : canExecuteCurrentStep() ? (
                  <span className="text-green-600">
                    Ready to execute next step.
                  </span>
                ) : (
                  <span className="text-gray-600">
                    Wait for run status to become ready.
                  </span>
                )}
              </div>
              <Button
                size="sm"
                onClick={handleStepAction}
                disabled={busy || !canExecuteCurrentStep()}
                variant={
                  currentStep.requires_approval && isBlocked
                    ? "default"
                    : "outline"
                }
                className={
                  currentStep.requires_approval && isBlocked
                    ? "bg-amber-600 hover:bg-amber-700"
                    : ""
                }
              >
                {busy
                  ? "Executing..."
                  : currentStep.requires_approval && isBlocked
                  ? "Approve + Continue"
                  : `Execute: ${currentStep.title}`}
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div className="flex justify-between">
            <span>Run Status: {status}</span>
            {lastError && (
              <span className="text-red-600">Error detected</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
