"use client"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="System Status" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Runtime Tests</CardTitle></CardHeader>
        <CardContent><StatusBadge status="ok" /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Queue Status</CardTitle></CardHeader>
        <CardContent><StatusBadge status="ok" /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Worker Status</CardTitle></CardHeader>
        <CardContent><StatusBadge status="ok" /></CardContent></Card>
      </div>
    </div>
  )
}
