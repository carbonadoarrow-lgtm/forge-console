"use client";

import { useState } from "react";
import { useConsoleJobs } from "@/lib/hooks/use-console-activity";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ConsoleJob, ConsoleJobStatus } from "@/lib/types";
import { formatTimeAgo, isJobLongRunning } from "@/lib/utils/time";
import { Loader2, AlertCircle, AlertTriangle } from "lucide-react";

type FilterStatus = "all" | ConsoleJobStatus;
type FilterSphere = "all" | "forge" | "orunmila";

export default function JobsPage() {
  const { data: jobs, isLoading } = useConsoleJobs();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterSphere, setFilterSphere] = useState<FilterSphere>("all");
  const [selectedJob, setSelectedJob] = useState<ConsoleJob | null>(null);

  const runningJobs = jobs?.filter((j: ConsoleJob) => j.status === "running") ?? [];
  const failedJobs = jobs?.filter((j: ConsoleJob) => j.status === "failed") ?? [];
  const succeededJobs = jobs?.filter((j: ConsoleJob) => j.status === "succeeded") ?? [];
  const pendingJobs = jobs?.filter((j: ConsoleJob) => j.status === "pending") ?? [];

  // Count by sphere
  const forgeJobs = jobs?.filter((j: ConsoleJob) => j.sphere === "forge") ?? [];
  const orunmilaJobs = jobs?.filter((j: ConsoleJob) => j.sphere === "orunmila") ?? [];

  // Detect long-running jobs (> 30 minutes)
  const longRunningJobs = runningJobs.filter((j) => isJobLongRunning(j.created_at, 30));

  // Apply filters
  const filteredJobs = jobs
    ?.filter((j) => filterStatus === "all" || j.status === filterStatus)
    .filter((j) => filterSphere === "all" || j.sphere === filterSphere) ?? [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
        <p className="text-sm text-muted-foreground">
          Real-time view of all background jobs. Monitor status and troubleshoot failures.
        </p>
      </div>

      {/* Problem Banners */}
      {failedJobs.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {failedJobs.length} failed job{failedJobs.length === 1 ? "" : "s"} – inspect logs for details.
          </AlertDescription>
        </Alert>
      )}

      {longRunningJobs.length > 0 && (
        <Alert className="border-amber-500 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {longRunningJobs.length} long-running job{longRunningJobs.length === 1 ? "" : "s"} (&gt;30 min) – may be stuck.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
            <CardDescription>All jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{jobs?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Running</CardTitle>
            <CardDescription>Active jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{runningJobs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
            <CardDescription>Queued jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingJobs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Succeeded</CardTitle>
            <CardDescription>Jobs that succeeded</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{succeededJobs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Failed</CardTitle>
            <CardDescription>Jobs that failed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{failedJobs.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Forge Jobs</CardTitle>
            <CardDescription>Autonomous Forge operations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{forgeJobs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orunmila Jobs</CardTitle>
            <CardDescription>Bridge & external tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orunmilaJobs.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Filter by Status</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={filterStatus === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Badge>
            <Badge
              variant={filterStatus === "pending" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </Badge>
            <Badge
              variant={filterStatus === "running" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus("running")}
            >
              Running
            </Badge>
            <Badge
              variant={filterStatus === "succeeded" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus("succeeded")}
            >
              Succeeded
            </Badge>
            <Badge
              variant={filterStatus === "failed" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus("failed")}
            >
              Failed
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Filter by Sphere</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={filterSphere === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterSphere("all")}
            >
              All
            </Badge>
            <Badge
              variant={filterSphere === "forge" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterSphere("forge")}
            >
              Forge
            </Badge>
            <Badge
              variant={filterSphere === "orunmila" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterSphere("orunmila")}
            >
              Orunmila
            </Badge>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading jobs…
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Job History ({filteredJobs.length})
          </h2>
          {filteredJobs && filteredJobs.length > 0 ? (
            <div className="space-y-2">
              {filteredJobs.slice(0, 50).map((job) => (
                <Card
                  key={job.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedJob(job)}
                >
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">{job.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {job.sphere}
                        </Badge>
                      </div>
                      <Badge
                        variant={
                          job.status === "pending"
                            ? "secondary"
                            : job.status === "running"
                            ? "default"
                            : job.status === "succeeded"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {job.id} • Created {formatTimeAgo(job.created_at)}
                      {job.error_message && (
                        <div className="mt-1 text-red-500 truncate">
                          Error: {job.error_message.substring(0, 100)}
                          {job.error_message.length > 100 && "..."}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No jobs found matching filters.</p>
          )}
        </div>
      )}

      {/* Job Detail Sheet */}
      <Sheet open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <SheetContent className="overflow-y-auto">
          {selectedJob && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedJob.name}</SheetTitle>
                <SheetDescription>Job Details</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Job ID</h4>
                  <p className="text-sm text-muted-foreground font-mono">{selectedJob.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <Badge
                    variant={
                      selectedJob.status === "pending"
                        ? "secondary"
                        : selectedJob.status === "running"
                        ? "default"
                        : selectedJob.status === "succeeded"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {selectedJob.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Sphere</h4>
                  <Badge variant="secondary">{selectedJob.sphere}</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Created At</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedJob.created_at).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(selectedJob.created_at)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Updated At</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedJob.updated_at).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(selectedJob.updated_at)}
                  </p>
                </div>
                {selectedJob.error_message && (
                  <div>
                    <h4 className="text-sm font-medium mb-1 text-red-600 dark:text-red-400">Error Message</h4>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                      <p className="text-sm text-destructive whitespace-pre-wrap break-words">
                        {selectedJob.error_message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
