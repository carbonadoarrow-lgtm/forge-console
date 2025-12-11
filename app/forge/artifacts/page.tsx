"use client"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Artifacts" />
      <Card><CardContent className="py-12 text-center">
        <p className="text-muted-foreground">Artifacts browser coming soon</p>
      </CardContent></Card>
    </div>
  )
}
