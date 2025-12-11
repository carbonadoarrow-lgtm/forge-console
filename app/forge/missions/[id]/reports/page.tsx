"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMissionReports, useGenerateMissionReport } from "@/lib/hooks/use-forge-mission-reports";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Plus, Loader2, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { MissionReport } from "@/lib/types";

export default function MissionReportsPage() {
  const params = useParams();
  const missionId = params.id as string;
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const { data: reports, isLoading: reportsLoading } = useMissionReports(missionId);
  const generateReport = useGenerateMissionReport();

  const handleGenerateReport = async () => {
    const newReport = await generateReport.mutateAsync(missionId);
    setSelectedReportId(newReport.id);
  };

  const selectedReport = reports?.find((r) => r.id === selectedReportId);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "warning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Mission Reports
        </h1>
        <p className="text-muted-foreground mt-2">
          Mission: <span className="font-mono">{missionId}</span>
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Reports List */}
        <Card className="col-span-4 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Reports</CardTitle>
              <Button
                size="sm"
                onClick={handleGenerateReport}
                disabled={generateReport.isPending}
              >
                {generateReport.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardDescription>Click to view report details</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-4">
              {reportsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : reports && reports.length > 0 ? (
                <div className="space-y-2 pb-4">
                  {reports
                    .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())
                    .map((report) => (
                      <div
                        key={report.id}
                        className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                          selectedReportId === report.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:bg-muted border-transparent"
                        }`}
                        onClick={() => setSelectedReportId(report.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(report.status)}
                            <span className="font-medium text-sm">
                              {formatTimestamp(report.generated_at)}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {report.sphere}
                          </Badge>
                        </div>
                        <div className="text-xs opacity-70 mt-2">
                          {report.stats.total_runs || 0} total runs
                        </div>
                        <div className={`text-xs mt-1 px-2 py-1 rounded-md inline-block ${getStatusColor(report.status)}`}>
                          {report.status}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reports yet</p>
                  <p className="text-sm mt-2">Generate your first report</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Report Details */}
        <Card className="col-span-8 flex flex-col">
          {selectedReport ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Mission Report
                      {getStatusIcon(selectedReport.status)}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Generated {formatTimestamp(selectedReport.generated_at)} by {selectedReport.generated_by}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {/* Statistics */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Statistics
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">{selectedReport.stats.total_runs || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">Total Runs</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-green-500">{selectedReport.stats.succeeded || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">Succeeded</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-red-500">{selectedReport.stats.failed || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">Failed</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold text-blue-500">{selectedReport.stats.running || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">Running</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Highlights */}
                  {selectedReport.highlights && selectedReport.highlights.length > 0 && (
                    <>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                        <ul className="space-y-2">
                          {selectedReport.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator className="my-6" />
                    </>
                  )}

                  {/* Recommendations */}
                  {selectedReport.recommendations && selectedReport.recommendations.length > 0 && (
                    <>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                        <ul className="space-y-2">
                          {selectedReport.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator className="my-6" />
                    </>
                  )}

                  {/* Full Report (Markdown) */}
                  {selectedReport.raw_markdown && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Full Report</h3>
                      <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted rounded-lg">
                        <ReactMarkdown>{selectedReport.raw_markdown}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Select a report to view details</p>
                <p className="text-sm mt-2">
                  Or generate a new report to see aggregated mission statistics
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
