'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { useForgeRuns, useForgeReports, useForgeSystemStatus } from '@/lib/hooks/useForgeData';
import { StatusBadge } from '@/components/shared/status-badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, FileText, Zap, AlertCircle } from 'lucide-react';

export default function ForgeHomePage() {
  const { data: runs, isLoading: runsLoading } = useForgeRuns();
  const { data: reports, isLoading: reportsLoading } = useForgeReports();
  const { data: systemStatus, isLoading: statusLoading } = useForgeSystemStatus();

  const recentRuns = runs?.slice(0, 5) || [];
  const recentReports = reports?.slice(0, 5) || [];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <PageHeader
        title="Forge OS"
        subtitle="Infrastructure and runtime management"
        breadcrumbs={[{ label: 'Home' }]}
      />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Across runtime, infra, and ingest
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runs Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +3 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Generated reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusLoading ? '...' : <StatusBadge status={(systemStatus as any)?.overall || 'ok'} />}
            </div>
            <p className="text-xs text-muted-foreground">
              All subsystems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Runs</CardTitle>
          <CardDescription>Latest execution runs across all skills and missions</CardDescription>
        </CardHeader>
        <CardContent>
          {runsLoading ? (
            <p className="text-sm text-muted-foreground">Loading runs...</p>
          ) : recentRuns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent runs</p>
          ) : (
            <div className="space-y-4">
              {recentRuns.map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <Link
                      href={`/forge/runs/${run.id}`}
                      className="font-medium hover:underline"
                    >
                      {run.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {new Date(run.startTime).toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={run.status} />
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link href="/forge/runs">
              <Button variant="outline" size="sm">
                View All Runs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Latest generated reports and diagnostics</CardDescription>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <p className="text-sm text-muted-foreground">Loading reports...</p>
          ) : recentReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent reports</p>
          ) : (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <Link
                      href={`/forge/reports/${report.id}`}
                      className="font-medium hover:underline"
                    >
                      {report.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Link href="/forge/reports">
              <Button variant="outline" size="sm">
                View All Reports
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
