"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface PresenceStatus {
  state: "normal" | "warn" | "takeover";
  last_activity: {
    timestamp: string;
    activity_type: string;
  };
  hours_since_last: number;
  next_threshold: number;
}

const STATE_COLORS = {
  normal: "bg-green-500",
  warn: "bg-yellow-500",
  takeover: "bg-red-500",
};

export default function CockpitPage() {
  const [presenceStatus, setPresenceStatus] = useState<PresenceStatus | null>(null);
  const [eventCount, setEventCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [presenceRes, countRes] = await Promise.all([
          fetch("/api/orunmila/events/presence/status"),
          fetch("/api/orunmila/events/count"),
        ]);

        if (presenceRes.ok) {
          setPresenceStatus(await presenceRes.json());
        }

        if (countRes.ok) {
          const data = await countRes.json();
          setEventCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch cockpit data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
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
      <div>
        <h1 className="text-3xl font-bold">Operator Cockpit</h1>
        <p className="text-gray-500 mt-1">Real-time system monitoring and event management</p>
      </div>

      {/* Status Overview */}
      {presenceStatus && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>System Status</CardTitle>
              <Badge className={STATE_COLORS[presenceStatus.state]}>
                {presenceStatus.state.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Last Activity</p>
                <p className="font-medium">
                  {presenceStatus.hours_since_last.toFixed(1)}h ago
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Threshold</p>
                <p className="font-medium">
                  {presenceStatus.next_threshold.toFixed(1)}h
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="font-medium">{eventCount.toLocaleString()}</p>
              </div>
            </div>

            {presenceStatus.state !== "normal" && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ System is in <strong>{presenceStatus.state.toUpperCase()}</strong> state.
                  {presenceStatus.state === "warn" && " Reduced parallelism active."}
                  {presenceStatus.state === "takeover" && " Minimal autonomy active."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Events */}
        <Link href="/forge/cockpit/events">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Live Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Real-time event stream with Taylor-compliant summaries
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Stream <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Inbox */}
        <Link href="/forge/cockpit/inbox">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Event Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Actionable events requiring attention
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Inbox <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* State */}
        <Link href="/forge/cockpit/state">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">System State</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Presence status and corridor configuration
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View State <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>About Operator Cockpit</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>
            The Operator Cockpit provides real-time visibility into the Orunmila Events System.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Live Events:</strong> SSE stream of all system events with Taylor summaries</li>
            <li><strong>Event Inbox:</strong> Filtered view of actionable warnings and errors</li>
            <li><strong>System State:</strong> Presence tracking and dynamic corridor status</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
