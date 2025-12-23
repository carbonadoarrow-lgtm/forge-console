"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { startAutonomyRun, startAutonomyRunAndTickOnce } from "@/lib/api/autonomy";
import { BUILDER_RUN_TEMPLATES, RUN_PLAN_TEMPLATES, type RunPlanTemplate } from "@/lib/forge/autonomy/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewRunForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [taskId, setTaskId] = useState(`ui-${Date.now()}`);
  const [kind, setKind] = useState<"analysis" | "plan" | "patch" | "audit">("patch");
  const [description, setDescription] = useState("");
  const [env, setEnv] = useState("dev");
  const [lane, setLane] = useState("innovation");
  const [jobType, setJobType] = useState<"coding_lane" | "autobuilder">("coding_lane");
  const [paths, setPaths] = useState("");
  const [constraints, setConstraints] = useState("");

  const parsedPaths = useMemo(
    () => paths.split("\n").map(s => s.trim()).filter(Boolean),
    [paths],
  );
  const parsedConstraints = useMemo(
    () => constraints.split("\n").map((s) => s.trim()).filter(Boolean),
    [constraints],
  );

  const [templateId, setTemplateId] = useState<string>("");
  const [selectedRunPlanTemplate, setSelectedRunPlanTemplate] = useState<RunPlanTemplate | null>(null);

  function applyTemplate(tid: string) {
    // Check regular templates
    const regularTemplate = BUILDER_RUN_TEMPLATES.find((x) => x.id === tid);
    if (regularTemplate) {
      setKind(regularTemplate.defaults.kind);
      setDescription(regularTemplate.defaults.description);
      setEnv(regularTemplate.defaults.env);
      setLane(regularTemplate.defaults.lane);
      setJobType(regularTemplate.defaults.jobType);
      setPaths(regularTemplate.defaults.paths.join("\n"));
      setConstraints(regularTemplate.defaults.constraints.join("\n"));
      setSelectedRunPlanTemplate(null);
      return;
    }

    // Check run plan templates
    const runPlanTemplate = RUN_PLAN_TEMPLATES.find((x) => x.id === tid);
    if (runPlanTemplate) {
      setKind(runPlanTemplate.defaults.kind);
      setDescription(runPlanTemplate.defaults.description);
      setEnv(runPlanTemplate.defaults.env);
      setLane(runPlanTemplate.defaults.lane);
      setJobType(runPlanTemplate.defaults.jobType);
      setPaths(runPlanTemplate.defaults.paths.join("\n"));
      setConstraints(runPlanTemplate.defaults.constraints.join("\n"));
      setSelectedRunPlanTemplate(runPlanTemplate);
      return;
    }

    // No template found
    setSelectedRunPlanTemplate(null);
  }

  async function onCreateAndTickOnce() {
    setBusy(true);
    setErr(null);
    try {
      const res = await startAutonomyRunAndTickOnce({
        task: {
          id: taskId,
          kind,
          description,
          repo_root: ".",
          paths: parsedPaths,
          constraints: parsedConstraints,
          tags: {
            environment: env,
            lane,
          },
          lane,
        },
        job_type: jobType,
      });

      router.push(`/forge/builder/${encodeURIComponent(res.run_id)}`);
    } catch (e: any) {
      setErr(e?.message || "failed to create+tick");
    } finally {
      setBusy(false);
    }
  }

  async function onCreate() {
    setBusy(true);
    setErr(null);
    try {
      const res = await startAutonomyRun({
        task: {
          id: taskId,
          kind,
          description,
          repo_root: ".",
          paths: parsedPaths,
          constraints: parsedConstraints,
          tags: {
            environment: env,
            lane,
          },
          lane,
        },
        job_type: jobType,
      });

      router.push(`/forge/builder/${encodeURIComponent(res.run_id)}`);
    } catch (e: any) {
      setErr(e?.message || "failed to create run");
    } finally {
      setBusy(false);
    }
  }

  async function onCreateRunPlan() {
    setBusy(true);
    setErr(null);
    try {
      // First, create the run with an initial tick
      const res = await startAutonomyRunAndTickOnce({
        task: {
          id: taskId,
          kind,
          description,
          repo_root: ".",
          paths: parsedPaths,
          constraints: parsedConstraints,
          tags: {
            environment: env,
            lane,
          },
          lane,
        },
        job_type: jobType,
      });

      const runId = res.run_id;
      
      // Store the run plan in localStorage
      if (selectedRunPlanTemplate) {
        const planData = {
          templateId: selectedRunPlanTemplate.id,
          steps: selectedRunPlanTemplate.steps,
          currentStepIndex: 0, // Start at first step after create_and_tick_once
        };
        localStorage.setItem(`run_plan_${runId}`, JSON.stringify(planData));
      }

      // Redirect with runPlan query param
      router.push(`/forge/builder/${encodeURIComponent(runId)}?runPlan=true`);
    } catch (e: any) {
      // Fallback: try start then tick separately if start_and_tick_once fails
      try {
        const startRes = await startAutonomyRun({
          task: {
            id: taskId,
            kind,
            description,
            repo_root: ".",
            paths: parsedPaths,
            constraints: parsedConstraints,
            tags: {
              environment: env,
              lane,
            },
            lane,
          },
          job_type: jobType,
        });
        
        const runId = startRes.run_id;
        
        // Store the run plan in localStorage
        if (selectedRunPlanTemplate) {
          const planData = {
            templateId: selectedRunPlanTemplate.id,
            steps: selectedRunPlanTemplate.steps,
            currentStepIndex: 0,
          };
          localStorage.setItem(`run_plan_${runId}`, JSON.stringify(planData));
        }
        
        // TODO: We should also call tick once here, but we don't have the tick endpoint in the same call.
        // For now, we'll redirect and let the operator manually tick.
        // According to the task: fallback to POST /start then POST /tick once
        // We'll need to make a second API call to tick, but we don't want to block the redirect.
        // We'll do it in the background and hope it succeeds.
        // Alternatively, we could chain the promises, but that might delay the redirect.
        // Let's do it and then redirect regardless.
        try {
          // We'll need to import tickAutonomyRun
          const { tickAutonomyRun } = await import("@/lib/api/autonomy");
          await tickAutonomyRun(runId, false);
        } catch (tickError) {
          // Log but continue
          console.error("Failed to tick after creation:", tickError);
        }
        
        router.push(`/forge/builder/${encodeURIComponent(runId)}?runPlan=true`);
      } catch (fallbackError: any) {
        setErr(fallbackError?.message || "failed to create run (even with fallback)");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        {err ? <div className="text-sm text-red-600">{err}</div> : null}

        <div>
          <div className="text-xs text-muted-foreground mb-1">Template</div>
          <select
            className="w-full rounded-md border px-3 py-2 text-sm"
            value={templateId}
            onChange={(e) => {
              const tid = e.target.value;
              setTemplateId(tid);
              if (tid) applyTemplate(tid);
            }}
          >
            <option value="">(none)</option>
            <optgroup label="Single Run Templates">
              {BUILDER_RUN_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Run Plan Templates">
              {RUN_PLAN_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </optgroup>
          </select>
          {templateId ? (
            <div className="text-xs text-muted-foreground mt-1">
              {BUILDER_RUN_TEMPLATES.find((t) => t.id === templateId)?.description ??
               RUN_PLAN_TEMPLATES.find((t) => t.id === templateId)?.description ??
               ""}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Task ID</div>
            <Input
              value={taskId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskId(e.target.value)}
            />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Kind</div>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as any)}
            >
              <option value="analysis">analysis</option>
              <option value="plan">plan</option>
              <option value="patch">patch</option>
              <option value="audit">audit</option>
            </select>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Environment</div>
            <Input
              value={env}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnv(e.target.value)}
            />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Lane</div>
            <Input
              value={lane}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLane(e.target.value)}
            />
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Job Type</div>
            <select
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={jobType}
              onChange={(e) => setJobType(e.target.value as any)}
            >
              <option value="coding_lane">coding_lane</option>
              <option value="autobuilder">autobuilder</option>
            </select>
          </div>
        </div>

        <div>
          <div className="text-xs text-muted-foreground mb-1">Description</div>
          <Textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Paths (one per line)</div>
            <Textarea
              value={paths}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPaths(e.target.value)}
              rows={6}
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Constraints (one per line)</div>
            <Textarea
              value={constraints}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setConstraints(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={onCreate} disabled={busy || !description.trim()}>
            Create Run
          </Button>
          <Button onClick={onCreateAndTickOnce} disabled={busy || !description.trim()}>
            Create + Tick once
          </Button>
          {selectedRunPlanTemplate && (
            <Button 
              onClick={onCreateRunPlan} 
              disabled={busy || !description.trim()}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              Create + Run Plan
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push("/forge/builder")} disabled={busy}>
            Cancel
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Creates a run (state/events persisted). Use Tick / Approve / Halt on the run page to advance.
        </div>
      </CardContent>
    </Card>
  );
}
