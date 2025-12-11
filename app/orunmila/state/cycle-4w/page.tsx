"use client"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="4-Week Cycle State" />
      <Card><CardContent className="py-12 text-center">
        <p className="text-muted-foreground">Cycle state viewer coming soon</p>
      </CardContent></Card>
    </div>
  )
}
