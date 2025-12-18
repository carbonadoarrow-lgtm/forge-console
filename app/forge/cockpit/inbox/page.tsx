"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface EventEnvelope {
  event_id: string;
  timestamp: string;
  event_type: string;
  severity: "debug" | "info" | "warn" | "error" | "critical";
  taylor_summary: {
    observation: string;
    implication: string;
    constraints: string[];
    choice_set: string[];
    meta_clarifier: string;
  };
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

export default function CockpitInboxPage() {
  const [events, setEvents] = useState<EventEnvelope[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "warn" | "error" | "critical">("all");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/orunmila/events/recent?limit=100");
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

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return event.severity !== "debug" && event.severity !== "info";
    return event.severity === filter;
  });

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
          <h1 className="text-3xl font-bold">Event Inbox</h1>
          <p className="text-gray-500 mt-1">Actionable events requiring attention</p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant={filter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilter("all")}
          >
            All ({filteredEvents.length})
          </Badge>
          <Badge
            variant={filter === "warn" ? "default" : "outline"}
            className="cursor-pointer bg-yellow-500"
            onClick={() => setFilter("warn")}
          >
            Warnings ({events.filter(e => e.severity === "warn").length})
          </Badge>
          <Badge
            variant={filter === "error" ? "default" : "outline"}
            className="cursor-pointer bg-red-500"
            onClick={() => setFilter("error")}
          >
            Errors ({events.filter(e => e.severity === "error").length})
          </Badge>
          <Badge
            variant={filter === "critical" ? "default" : "outline"}
            className="cursor-pointer bg-purple-500"
            onClick={() => setFilter("critical")}
          >
            Critical ({events.filter(e => e.severity === "critical").length})
          </Badge>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              No actionable events in inbox.
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.event_id} className="hover:shadow-md transition-shadow">
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
              <CardContent className="space-y-3">
                {/* Observation */}
                <div>
                  <p className="font-medium text-sm">{event.taylor_summary.observation}</p>
                </div>

                {/* Implication */}
                <div className="pl-4 border-l-2 border-gray-300">
                  <p className="text-sm text-gray-700">{event.taylor_summary.implication}</p>
                </div>

                {/* Actions */}
                {event.taylor_summary.choice_set.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Available Actions:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {event.taylor_summary.choice_set.map((choice, idx) => (
                        <li key={idx} className="text-gray-700">{choice}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
