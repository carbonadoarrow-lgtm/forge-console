import { apiClient } from "./client";

export type AutonomyRunMode = "manual" | "assisted" | "autonomous";

export type AutonomyRunSummary = {
  run_id: string;
  status: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  task_id?: string | null;
  task_kind?: string | null;
  env?: string | null;
  lane?: string | null;
  mode?: AutonomyRunMode | null;
};

export type AutonomyRunDetail = {
  state: Record<string, any>;
  events: Array<Record<string, any>>;
  linked_job?: {
    job_id: string;
    job_type?: string | null;
    status?: string | null;
    message?: string | null;
    raw?: Record<string, any>;
  } | null;
  artifacts_root?: string | null;
  artifacts_tree?: Record<string, any> | null;
  last_error?: {
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

export type AutonomyWorkerStatus = {
  enabled: boolean;
  last_tick_at?: string | null;
  caps?: Record<string, any>;
  counters?: Record<string, any>;
};

export type AutonomyWorkerTickSummary = {
  enabled: boolean;
  considered: number;
  ticked: number;
  skipped: number;
  errors: number;
};

export async function listAutonomyRuns(): Promise<{ runs: AutonomyRunSummary[] }> {
  return apiClient.get<{ runs: AutonomyRunSummary[] }>("/api/autonomy/runs");
}

export async function getAutonomyRun(runId: string): Promise<AutonomyRunDetail> {
  return apiClient.get<AutonomyRunDetail>(`/api/autonomy/runs/${encodeURIComponent(runId)}`);
}

export async function tickAutonomyRun(
  runId: string,
  approveBlocked: boolean,
): Promise<{ state: Record<string, any> }> {
  return apiClient.post<{ state: Record<string, any> }>(
    `/api/autonomy/runs/${encodeURIComponent(runId)}/tick`,
    { approve_blocked: approveBlocked },
  );
}

export async function haltAutonomyRun(
  runId: string,
  reason?: string,
): Promise<{ state: Record<string, any> }> {
  return apiClient.post<{ state: Record<string, any> }>(
    `/api/autonomy/runs/${encodeURIComponent(runId)}/halt`,
    { reason: reason || "halt_requested_via_cockpit" },
  );
}

export type StartAutonomyRunRequest = {
  task: {
    id: string;
    kind: "analysis" | "plan" | "patch" | "audit";
    description: string;
    repo_root?: string;
    paths?: string[];
    constraints?: string[];
    tags?: Record<string, string>;
    lane?: string | null;
  };
  job_type?: "coding_lane" | "autobuilder" | "builder";
};

export async function startAutonomyRun(
  body: StartAutonomyRunRequest,
): Promise<{ run_id: string; state?: Record<string, any> }> {
  return apiClient.post<{ run_id: string; state?: Record<string, any> }>(`/api/autonomy/runs/start`, body);
}

export async function startAutonomyRunAndTickOnce(
  body: StartAutonomyRunRequest,
): Promise<{ run_id: string; state?: Record<string, any> }> {
  return apiClient.post<{ run_id: string; state?: Record<string, any> }>(
    `/api/autonomy/runs/start_and_tick_once`,
    body,
  );
}

export async function retryAutonomyRun(runId: string): Promise<{ state: Record<string, any> }> {
  return apiClient.post<{ state: Record<string, any> }>(
    `/api/autonomy/runs/${encodeURIComponent(runId)}/retry`,
    {},
  );
}

export async function approveAndTickAutonomyRun(runId: string): Promise<{ state: Record<string, any> }> {
  return apiClient.post<{ state: Record<string, any> }>(
    `/api/autonomy/runs/${encodeURIComponent(runId)}/approve_and_tick`,
    {},
  );
}

export async function continueAutonomyRun(runId: string): Promise<{ state: Record<string, any> }> {
  return apiClient.post<{ state: Record<string, any> }>(
    `/api/autonomy/runs/${encodeURIComponent(runId)}/continue`,
    {},
  );
}

export async function setAutonomyRunMode(
  runId: string,
  mode: AutonomyRunMode,
): Promise<{ state: Record<string, any> }> {
  return apiClient.post<{ state: Record<string, any> }>(
    `/api/autonomy/runs/${encodeURIComponent(runId)}/set_mode`,
    { mode },
  );
}

export async function getAutonomyWorkerStatus(): Promise<AutonomyWorkerStatus> {
  return apiClient.get<AutonomyWorkerStatus>("/api/autonomy/worker/status");
}

export async function tickAutonomyWorkerOnce(): Promise<AutonomyWorkerTickSummary> {
  return apiClient.post<AutonomyWorkerTickSummary>("/api/autonomy/worker/tick_once", {});
}
