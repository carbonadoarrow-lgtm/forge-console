"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api-config";
import { Loader2, Shield, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

interface AuthorityBlock {
  id: string;
  timestamp: string;
  contract_type: string;
  reason: string;
  approvals_required: number;
  artifact_link?: string;
  approved: boolean;
}

interface AuthorityStatus {
  presence_state: string;
  authority_mode: string;
  corridor_level: string;
  recent_blocks: AuthorityBlock[];
}

export default function AuthorityPage() {
  const { data, isLoading, error } = useQuery<AuthorityStatus>({
    queryKey: ["cockpit", "authority"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/cockpit/authority/status`);
      if (!res.ok) throw new Error("Failed to fetch authority status");
      return res.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load authority status</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCorridorColor = (level: string) => {
    switch (level) {
      case "green": return "bg-green-500";
      case "yellow": return "bg-yellow-500";
      case "red": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "NORMAL": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "WARN": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "TAKEOVER": return <Shield className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Authority</h1>
        <p className="text-sm text-muted-foreground">
          Current authority state, corridor level, and recent authorization blocks.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {getStateIcon(data?.presence_state || "")}
              Presence State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={data?.presence_state === "NORMAL" ? "default" : "destructive"}>
              {data?.presence_state}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Authority Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="capitalize">
              {data?.authority_mode}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Corridor Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${getCorridorColor(data?.corridor_level || "")}`} />
              <span className="capitalize font-medium">{data?.corridor_level}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Blocks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Authorization Blocks</CardTitle>
          <CardDescription>
            Actions that required additional approval or were blocked by policy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.recent_blocks && data.recent_blocks.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">Timestamp</th>
                    <th className="text-left p-3 text-sm font-medium">Contract Type</th>
                    <th className="text-left p-3 text-sm font-medium">Reason</th>
                    <th className="text-left p-3 text-sm font-medium">Approvals</th>
                    <th className="text-left p-3 text-sm font-medium">Status</th>
                    <th className="text-left p-3 text-sm font-medium">Artifact</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_blocks.map((block) => (
                    <tr key={block.id} className="border-b">
                      <td className="p-3 text-sm">
                        {new Date(block.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{block.contract_type}</Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {block.reason}
                      </td>
                      <td className="p-3 text-sm">{block.approvals_required}</td>
                      <td className="p-3">
                        <Badge variant={block.approved ? "default" : "secondary"}>
                          {block.approved ? "Approved" : "Pending"}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {block.artifact_link && (
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent blocks.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
