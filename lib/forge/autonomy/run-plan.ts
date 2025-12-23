import type { RunPlanStep } from "./templates";

export type SimpleRunState = {
  status?: string | null;
  last_error?: { [key: string]: unknown } | null;
};

/**
 * Heuristic selection of the current RunPlan step index based on run state.
 *
 * This is intentionally simple and does NOT mutate backend state. It only
 * interprets the current state snapshot.
 */
export function selectRunPlanCurrentStepIndex(steps: RunPlanStep[], state: SimpleRunState): number {
  if (!steps.length) return 0;

  const rawStatus = state.status ?? "UNKNOWN";
  const status = String(rawStatus).toUpperCase();
  const hasLastError = !!state.last_error;

  // Terminal states: point to the last step.
  if (status === "HALT" || status === "FAILED" || status === "ERROR" || status === "SUCCESS") {
    return Math.max(steps.length - 1, 0);
  }

  // Blocked or error present: favor the first approval-requiring step.
  if (status === "BLOCKED" || hasLastError) {
    const idx = steps.findIndex((s) => s.requires_approval);
    if (idx >= 0) return idx;
  }

  // Default: prefer the first non-approval step that is not the initial
  // "create_and_tick_once" step, so that the plan highlights a "next" action
  // after the run has already been created+ticked once.
  const nonCreateNonApprovalIdx = steps.findIndex(
    (s, idx) => !s.requires_approval && !(idx === 0 && s.action_type === "create_and_tick_once"),
  );
  if (nonCreateNonApprovalIdx >= 0) return nonCreateNonApprovalIdx;

  // Fallback: first non-approval step if any, otherwise 0.
  const nonApprovalIdx = steps.findIndex((s) => !s.requires_approval);
  if (nonApprovalIdx >= 0) return nonApprovalIdx;

  return 0;
}

/**
 * Lightweight unit tests for selectRunPlanCurrentStepIndex.
 * Pure function tests using basic assertions (no external test runner).
 */
function assertEqual(actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) {
    // Throwing ensures any manual invocation will clearly fail.
    throw new Error(`Assertion failed: ${message} (expected=${String(expected)}, actual=${String(actual)})`);
  }
}

export function runSelectRunPlanCurrentStepIndexTests() {
  const steps: RunPlanStep[] = [
    {
      id: "create_and_initial_tick",
      title: "Create & Initial Analysis",
      description: "",
      action_type: "create_and_tick_once",
      requires_approval: false,
    },
    {
      id: "review_changes",
      title: "Review Changes",
      description: "",
      action_type: "approve_and_tick",
      requires_approval: true,
    },
    {
      id: "finalize",
      title: "Finalize",
      description: "",
      action_type: "continue",
      requires_approval: false,
    },
  ];

  // Healthy running state: should point at the first "next" non-approval step
  // after the initial create_and_tick_once step.
  assertEqual(
    selectRunPlanCurrentStepIndex(steps, { status: "RUNNING", last_error: null }),
    2,
    "RUNNING without error should select first non-create non-approval step",
  );

  // Blocked state: should point at first approval-requiring step.
  assertEqual(
    selectRunPlanCurrentStepIndex(steps, { status: "BLOCKED", last_error: null }),
    1,
    "BLOCKED should select first approval-requiring step",
  );

  // Error present even if status is not BLOCKED.
  assertEqual(
    selectRunPlanCurrentStepIndex(steps, { status: "READY", last_error: { reason: "test" } }),
    1,
    "READY with last_error should select first approval-requiring step",
  );

  // Terminal states should point to last step.
  assertEqual(
    selectRunPlanCurrentStepIndex(steps, { status: "HALT", last_error: null }),
    2,
    "HALT should select last step",
  );
  assertEqual(
    selectRunPlanCurrentStepIndex(steps, { status: "FAILED", last_error: null }),
    2,
    "FAILED should select last step",
  );
  assertEqual(
    selectRunPlanCurrentStepIndex(steps, { status: "ERROR", last_error: null }),
    2,
    "ERROR should select last step",
  );
}
