"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface PresenceStatus {
  state: "normal" | "warn" | "takeover";
  last_activity: {
    timestamp: string;
    activity_type: string;
  };
  hours_since_last: number;
  next_threshold: number;
}

interface CorridorConfig {
  max_parallel_tasks: number;
  token_budget: number;
  max_tool_calls: number;
  require_approval: boolean;
  taylor_mode_strict: boolean;
}

interface CorridorStatus {
  level: "normal" | "warn" | "takeover";
  config: CorridorConfig;
  metadata: Record<string, any>;
}

const STATE_COLORS = {
  normal: "bg-green-500",
  warn: "bg-yellow-500",
  takeover: "bg-red-500",
};

export default function CockpitStatePage() {
  const [presenceStatus, setPresenceStatus] = useState<PresenceStatus | null>(null);
  const [corridorStatus, setCorridorStatus] = useState<CorridorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchState = async () => {
    try {
      const [presenceRes, corridorRes] = await Promise.all([
        fetch("/api/orunmila/events/presence/status"),
        fetch("/api/orunmila/events/corridors/status"),
      ]);

      if (presenceRes.ok) {
        setPresenceStatus(await presenceRes.json());
      }

      if (corridorRes.ok) {
        setCorridorStatus(await corridorRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch state:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchState();

    // Refresh every 30 seconds
    const interval = setInterval(fetchState, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchState();
  };

  const handleLogActivity = async () => {
    try {
      await fetch("/api/orunmila/events/presence/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity_type: "manual" }),
      });
      fetchState();
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System State</h1>
          <p className="text-gray-500 mt-1">Presence & Corridor Status</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleLogActivity}>
            Log Activity
          </Button>
        </div>
      </div>

      {/* Presence Status */}
      {presenceStatus && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Presence Status</CardTitle>
              <Badge className={STATE_COLORS[presenceStatus.state]}>
                {presenceStatus.state.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Last Activity</p>
                <p className="font-medium">
                  {new Date(presenceStatus.last_activity.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Activity Type</p>
                <p className="font-medium">{presenceStatus.last_activity.activity_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Business Hours Elapsed</p>
                <p className="font-medium">{presenceStatus.hours_since_last.toFixed(1)} hours</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Threshold</p>
                <p className="font-medium">{presenceStatus.next_threshold.toFixed(1)} hours</p>
              </div>
            </div>

            {presenceStatus.state !== "normal" && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ System is in <strong>{presenceStatus.state.toUpperCase()}</strong> state.
                  {presenceStatus.state === "warn" && " Reduced parallelism and tighter corridors are active."}
                  {presenceStatus.state === "takeover" && " Minimal autonomy and maximum stress tightening are active."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Corridor Status */}
      {corridorStatus && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Corridor Configuration</CardTitle>
              <Badge className={STATE_COLORS[corridorStatus.level]}>
                {corridorStatus.level.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Max Parallel Tasks</p>
                <p className="font-medium">{corridorStatus.config.max_parallel_tasks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Token Budget</p>
                <p className="font-medium">{corridorStatus.config.token_budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Tool Calls</p>
                <p className="font-medium">{corridorStatus.config.max_tool_calls}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Requires Approval</p>
                <p className="font-medium">{corridorStatus.config.require_approval ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taylor Mode Strict</p>
                <p className="font-medium">{corridorStatus.config.taylor_mode_strict ? "Yes" : "No"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
