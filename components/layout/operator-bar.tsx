"use client";

import { useConsoleJobs } from "@/lib/hooks/use-console-activity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

export function OperatorBar() {
  const { data: jobs, isLoading, isError, refetch } = useConsoleJobs();

  // Compute job counts
  const totalJobs = jobs?.length ?? 0;
  const runningJobs = jobs?.filter((j) => j.status === "running").length ?? 0;
  const failedJobs = jobs?.filter((j) => j.status === "failed").length ?? 0;

  // Backend status based on query state
  const backendOnline = !isError && !isLoading;

  // Environment from env var (default to "local")
  const env = process.env.NEXT_PUBLIC_FORGE_ENV || "local";

  return (
    <div className="border-b bg-muted/30 px-6 py-2">
      <div className="flex items-center justify-between text-sm">
        {/* Left: Backend Status */}
        <div className="flex items-center gap-4">
          {backendOnline ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">Backend: Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Backend: Offline</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          )}

          {/* Jobs Summary */}
          {backendOnline && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Jobs:</span>
              <span>
                {runningJobs} running · {failedJobs} failed · {totalJobs} total
              </span>
            </div>
          )}
        </div>

        {/* Right: Environment */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">env:</span>
          <Badge
            variant={env === "prod" ? "destructive" : env === "dev" ? "default" : "secondary"}
            className="text-xs"
          >
            {env}
          </Badge>
        </div>
      </div>
    </div>
  );
}
