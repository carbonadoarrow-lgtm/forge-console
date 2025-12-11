"use client"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Oracle Dashboard" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">DXY</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">105.23</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">US10Y</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">4.32%</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">VIX</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">16.8</p></CardContent></Card>
      </div>
    </div>
  )
}
