"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/lib/api-config";
import { Loader2, Activity, Clock, Zap, Radio } from "lucide-react";

interface PresenceStatus {
  current_state: string;
  last_activity: string;
  active_sessions: number;
  heartbeat_ok: boolean;
}

interface TimelineEvent {
  timestamp: string;
  event_type: string;
  description: string;
  metadata?: Record<string, any>;
}

export default function PresencePage() {
  const { data: presence, isLoading: presenceLoading } = useQuery<PresenceStatus>({
    queryKey: ["cockpit", "presence", "status"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/cockpit/presence/status`);
      if (!res.ok) throw new Error("Failed to fetch presence status");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const { data: timeline, isLoading: timelineLoading } = useQuery<TimelineEvent[]>({
    queryKey: ["cockpit", "presence", "timeline"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/cockpit/presence/timeline?n=20`);
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return res.json();
    },
    refetchInterval: 10000,
  });

  if (presenceLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getStateBadge = (state: string) => {
    switch (state) {
      case "active": return <Badge className="bg-green-600">Active</Badge>;
      case "idle": return <Badge variant="secondary">Idle</Badge>;
      case "away": return <Badge variant="outline">Away</Badge>;
      case "offline": return <Badge variant="destructive">Offline</Badge>;
      default: return <Badge>{state}</Badge>;
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "heartbeat": return <Radio className="h-4 w-4 text-green-500" />;
      case "activity": return <Activity className="h-4 w-4 text-blue-500" />;
      case "state_change": return <Zap className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Presence</h1>
        <p className="text-sm text-muted-foreground">
          Real-time system presence and activity monitoring.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current State</CardTitle>
          </CardHeader>
          <CardContent>
            {presence ? getStateBadge(presence.current_state) : <Badge variant="outline">Unknown</Badge>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {presence?.last_activity ? new Date(presence.last_activity).toLocaleString() : "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{presence?.active_sessions || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Heartbeat</CardTitle>
          </CardHeader>
          <CardContent>
            {presence?.heartbeat_ok ? (
              <Badge className="bg-green-600">OK</Badge>
            ) : (
              <Badge variant="destructive">Failed</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            Recent presence events and state changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {timelineLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : timeline && timeline.length > 0 ? (
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0">
                  <div className="mt-1">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {event.event_type.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{event.description}</p>
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity events.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
