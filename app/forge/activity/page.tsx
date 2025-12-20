"use client";

import Link from "next/link";
import {
  useConsoleChatSessions,
  useConsoleMissionReports,
  useConsoleJobs,
} from "@/lib/hooks/use-console-activity";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ConsoleChatSession, ConsoleMissionReport, ConsoleJob } from "@/lib/types";
import { formatTimeAgo } from "@/lib/utils/time";
import { Loader2, AlertCircle } from "lucide-react";

const DEFAULT_MISSION_ID = "mission-1";

export default function ActivityPage() {
  const { data: chatSessions, isLoading: chatsLoading, isError: chatsError } = useConsoleChatSessions();
  const { data: missionReports, isLoading: reportsLoading, isError: reportsError } =
    useConsoleMissionReports(DEFAULT_MISSION_ID);
  const { data: jobs, isLoading: jobsLoading, isError: jobsError } = useConsoleJobs();

  const totalChats = chatSessions?.length ?? 0;
  const unreadTotal = chatSessions?.reduce((sum, s) => sum + (s.unread_count || 0), 0) ?? 0;
  const latestSession = chatSessions && chatSessions.length > 0
    ? chatSessions
        .slice()
        .sort((a: ConsoleChatSession, b: ConsoleChatSession) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0]
    : null;

  const totalReports = missionReports?.length ?? 0;
  const latestReport =
    missionReports && missionReports.length > 0
      ? missionReports
          .slice()
          .sort((a: ConsoleMissionReport, b: ConsoleMissionReport) => 
            new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
          )[0]
      : null;

  const totalJobs = jobs?.length ?? 0;
  const runningJobs = jobs?.filter((j: ConsoleJob) => j?.status === "running").length ?? 0;
  const failedJobs = jobs?.filter((j: ConsoleJob) => j?.status === "failed").length ?? 0;
  const pendingJobs = jobs?.filter((j: ConsoleJob) => j?.status === "pending").length ?? 0;
  const succeededJobs = jobs?.filter((j: ConsoleJob) => j?.status === "succeeded").length ?? 0;

  // Find latest health check job
  const healthCheckJobs = jobs?.filter((j: ConsoleJob) => j?.name?.startsWith("forge_repo_health_check")) || [];
  const latestHealthCheck = healthCheckJobs.length > 0
    ? healthCheckJobs.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]
    : null;

  // Show error banner if any query failed
  const hasError = chatsError || reportsError || jobsError;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground">
          Real-time monitoring dashboard for Forge OS chat, missions, and autonomous jobs.
        </p>
      </div>

      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load some activity data. Check that backend is running at https://7d2majjsda.us-east-1.awsapprunner.com/api
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Chat card */}
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => window.location.href = "/forge/chat"}>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>
              Operator guidance sessions. Chat does not trigger autonomous actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {chatsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading chat sessions…
              </div>
            ) : chatSessions && chatSessions.length > 0 ? (
              <>
                <p className="text-sm">
                  <span className="font-medium">{totalChats}</span> session
                  {totalChats === 1 ? "" : "s"} ·{" "}
                  <span className="font-medium">{unreadTotal}</span> unread
                </p>
                {latestSession && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium truncate">{latestSession.title}</p>
                    {latestSession.last_message_preview && (
                      <p className="text-xs text-muted-foreground truncate">
                        {latestSession.last_message_preview}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Updated: {formatTimeAgo(latestSession.updated_at)}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No chat sessions yet. Open Chat to start a conversation.</p>
            )}
            <Button asChild size="sm" className="w-full mt-2">
              <Link href="/forge/chat">Open Chat</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Mission Reports card */}
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => window.location.href = `/forge/missions/${DEFAULT_MISSION_ID}/reports`}>
          <CardHeader>
            <CardTitle>Mission Reports</CardTitle>
            <CardDescription>
              Summaries and stats for mission {DEFAULT_MISSION_ID}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reportsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading mission reports…
              </div>
            ) : missionReports && missionReports.length > 0 ? (
              <>
                <p className="text-sm">
                  <span className="font-medium">{totalReports}</span> report
                  {totalReports === 1 ? "" : "s"}
                </p>
                {latestReport && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Latest: {formatTimeAgo(latestReport.generated_at)}
                    </p>
                    <Badge
                      variant={
                        latestReport.status === "ok"
                          ? "default"
                          : latestReport.status === "warning"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {latestReport.status.toUpperCase()}
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No reports generated yet. Reports appear after missions run.</p>
            )}
            <Button asChild size="sm" className="w-full mt-2">
              <Link href={`/forge/missions/${DEFAULT_MISSION_ID}/reports`}>
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Jobs card */}
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => window.location.href = "/forge/jobs"}>
          <CardHeader>
            <CardTitle>Jobs</CardTitle>
            <CardDescription>
              Automated tasks running in the background. Monitor for failures.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobsLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading jobs…
              </div>
            ) : jobs && jobs.length > 0 ? (
              <>
                <p className="text-sm">
                  Jobs: <span className="font-medium">{runningJobs} running</span> ·{" "}
                  <span className="font-medium">{failedJobs} failed</span> ·{" "}
                  <span className="font-medium">{totalJobs} total</span>
                </p>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <Badge variant="secondary">Pending: {pendingJobs}</Badge>
                  <Badge variant="outline">Succeeded: {succeededJobs}</Badge>
                </div>
                {latestHealthCheck && (
                  <div className="mt-3 pt-3 border-t space-y-1">
                    <p className="text-xs font-medium">Last repo health check:</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          latestHealthCheck.status === "succeeded"
                            ? "outline"
                            : latestHealthCheck.status === "failed"
                            ? "destructive"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {latestHealthCheck.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(latestHealthCheck.updated_at)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No jobs found. Run health check or create a job to get started.</p>
            )}
            <Button asChild size="sm" className="w-full mt-2">
              <Link href="/forge/jobs">View Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
