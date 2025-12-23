"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { API_BASE_URL } from "@/lib/api-config";
import { Loader2, Eye, Clock, AlertCircle } from "lucide-react";

interface ShadowQueueItem {
  id: string;
  queued_at: string;
  authority_mode: string;
  contract_type: string;
  blocked_reason: string;
  approvals_required: number;
  payload_preview: string;
  status: string;
}

export default function ShadowQueuePage() {
  const [selectedItem, setSelectedItem] = useState<ShadowQueueItem | null>(null);
  const [itemDetails, setItemDetails] = useState<any>(null);

  const { data: queue, isLoading } = useQuery<ShadowQueueItem[]>({
    queryKey: ["cockpit", "shadow-queue"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/cockpit/shadow-queue/tail?n=50`);
      if (!res.ok) throw new Error("Failed to fetch shadow queue");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const fetchItemDetails = async (itemId: string) => {
    const res = await fetch(`${API_BASE_URL}/cockpit/shadow-queue/item/${itemId}`);
    if (res.ok) {
      setItemDetails(await res.json());
    }
  };

  const handleViewItem = (item: ShadowQueueItem) => {
    setSelectedItem(item);
    fetchItemDetails(item.id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      case "approved": return <Badge variant="default">Approved</Badge>;
      case "rejected": return <Badge variant="destructive">Rejected</Badge>;
      case "expired": return <Badge variant="outline">Expired</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pendingCount = queue?.filter(q => q.status === "pending").length || 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shadow Queue</h1>
          <p className="text-sm text-muted-foreground">
            Blocked actions awaiting approval or revalidation.
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {pendingCount} Pending
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Queued</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{queue?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {queue?.filter(q => q.status === "approved").length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {queue?.filter(q => q.status === "rejected").length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Items</CardTitle>
          <CardDescription>
            Actions blocked by policy that require manual approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {queue && queue.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">Queued At</th>
                    <th className="text-left p-3 text-sm font-medium">Authority Mode</th>
                    <th className="text-left p-3 text-sm font-medium">Contract Type</th>
                    <th className="text-left p-3 text-sm font-medium">Blocked Reason</th>
                    <th className="text-left p-3 text-sm font-medium">Approvals</th>
                    <th className="text-left p-3 text-sm font-medium">Status</th>
                    <th className="text-left p-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/30">
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {new Date(item.queued_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className="capitalize">
                          {item.authority_mode}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge>{item.contract_type}</Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground max-w-[200px] truncate">
                        {item.blocked_reason}
                      </td>
                      <td className="p-3 text-sm">{item.approvals_required}</td>
                      <td className="p-3">{getStatusBadge(item.status)}</td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Shadow queue is empty. No blocked actions.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Item Detail Sheet */}
      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent className="w-[500px] overflow-y-auto">
          {selectedItem && (
            <>
              <SheetHeader>
                <SheetTitle>Queue Item Details</SheetTitle>
                <SheetDescription>ID: {selectedItem.id}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Status</h4>
                  {getStatusBadge(selectedItem.status)}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Blocked Reason</h4>
                  <p className="text-sm text-muted-foreground">{selectedItem.blocked_reason}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Payload Preview</h4>
                  <p className="text-sm font-mono bg-muted p-2 rounded">
                    {selectedItem.payload_preview}
                  </p>
                </div>

                {itemDetails && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Full Payload</h4>
                      <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-[200px]">
                        {JSON.stringify(itemDetails.payload, null, 2)}
                      </pre>
                    </div>

                    {itemDetails.trace && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Trace</h4>
                        <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                          {JSON.stringify(itemDetails.trace, null, 2)}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
