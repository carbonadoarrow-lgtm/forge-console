"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDailyState, useCycleState, useOrunmilaReports } from "@/lib/hooks/use-orunmila-api"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function OrunmilaPage() {
  const { data: dailyState } = useDailyState()
  const { data: cycleState } = useCycleState()
  const { data: reports } = useOrunmilaReports()

  const recentReports = reports?.slice(0, 5) || []

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Oracle Overview"
        description="XAU trading intelligence and state management"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latest Daily State</CardTitle>
          </CardHeader>
          <CardContent>
            {dailyState ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Regime</p>
                  <Badge className="mt-1">{dailyState.regime}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stance</p>
                  <p className="text-lg font-semibold">{dailyState.stance}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-lg font-semibold">{(dailyState.confidence * 100).toFixed(0)}%</p>
                </div>
                <Link href="/orunmila/state/daily">
                  <div className="text-sm text-primary hover:underline">View full state →</div>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No daily state available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4-Week Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            {cycleState ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Cycle Stance</p>
                  <p className="text-lg font-semibold">{cycleState.stance}</p>
                </div>
                {cycleState.performance && (
                  <div>
                    <p className="text-sm text-muted-foreground">Performance</p>
                    <p className="text-sm">
                      {cycleState.performance.wins}W / {cycleState.performance.losses}L
                    </p>
                  </div>
                )}
                <Link href="/orunmila/state/cycle-4w">
                  <div className="text-sm text-primary hover:underline">View cycle state →</div>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No cycle state available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Briefs & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent reports</p>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/orunmila/reports/${report.id}`}
                  className="block rounded-md border p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{report.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{report.type}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
