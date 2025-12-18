"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface TaylorSummary {
  observation: string;
  implication: string;
  constraints: string[];
  choice_set: string[];
  meta_clarifier: string;
}

interface EventEnvelope {
  event_id: string;
  timestamp: string;
  event_type: string;
  severity: "debug" | "info" | "warn" | "error" | "critical";
  taylor_summary: TaylorSummary;
  payload: Record<string, any>;
  metadata: Record<string, any>;
}

const SEVERITY_COLORS = {
  debug: "bg-gray-500",
  info: "bg-blue-500",
  warn: "bg-yellow-500",
  error: "bg-red-500",
  critical: "bg-purple-500",
};

export default function CockpitEventsPage() {
  const [events, setEvents] = useState<EventEnvelope[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  // Fetch initial events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/orunmila/events/recent?limit=50");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Connect to SSE stream
  useEffect(() => {
    const eventSource = new EventSource("/api/orunmila/events/stream");

    eventSource.onopen = () => {
      setConnected(true);
      console.log("SSE connection established");
    };

    eventSource.onmessage = (event) => {
      try {
        const newEvent = JSON.parse(event.data);
        setEvents((prev) => [newEvent, ...prev].slice(0, 100)); // Keep last 100
      } catch (error) {
        console.error("Failed to parse SSE event:", error);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      console.error("SSE connection error");
    };

    return () => {
      eventSource.close();
    };
  }, []);

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
          <h1 className="text-3xl font-bold">Orunmila Events</h1>
          <p className="text-gray-500 mt-1">Real-time event stream</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-sm text-gray-500">
            {connected ? "Live" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              No events yet. Events will appear here as they occur.
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.event_id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={SEVERITY_COLORS[event.severity]}>
                      {event.severity.toUpperCase()}
                    </Badge>
                    <CardTitle className="text-lg">{event.event_type}</CardTitle>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Observation */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Observation</h4>
                  <p className="text-sm">{event.taylor_summary.observation}</p>
                </div>

                {/* Implication */}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Implication</h4>
                  <p className="text-sm">{event.taylor_summary.implication}</p>
                </div>

                {/* Constraints */}
                {event.taylor_summary.constraints.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Constraints</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {event.taylor_summary.constraints.map((constraint, idx) => (
                        <li key={idx}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                {event.taylor_summary.choice_set.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Actions</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {event.taylor_summary.choice_set.map((choice, idx) => (
                        <li key={idx}>{choice}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Meta Clarifier */}
                {event.taylor_summary.meta_clarifier && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">Context</h4>
                    <p className="text-sm text-gray-600">{event.taylor_summary.meta_clarifier}</p>
                  </div>
                )}

                {/* Event ID */}
                <div className="text-xs text-gray-400 font-mono pt-2 border-t">
                  {event.event_id}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
