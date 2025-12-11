"use client"

import { use } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useForgeSkill, useRunForgeSkill } from "@/lib/hooks/use-forge-api"
import { Play, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: skill, isLoading } = useForgeSkill(id)
  const runSkill = useRunForgeSkill()

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading skill...</p>
        </div>
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Skill not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/forge/skills">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <PageHeader
        title={skill.name}
        description={skill.description}
        actions={
          <Button
            onClick={() => runSkill.mutate(id)}
            disabled={skill.can_run === false || runSkill.isPending}
          >
            <Play className="h-4 w-4 mr-2" />
            Run Skill
          </Button>
        }
      />

      <div className="flex gap-2">
        <Badge>{skill.type}</Badge>
        {skill.tags?.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="runs">Recent Runs</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Skill ID</p>
                  <p className="font-mono text-sm">{skill.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-sm">{skill.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sphere</p>
                  <p className="text-sm capitalize">{skill.sphere}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Can Run</p>
                  <p className="text-sm">{skill.can_run !== false ? "Yes" : "No"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="runs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Recent runs for this skill will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {skill.config ? (
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                  {JSON.stringify(skill.config, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">No configuration available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
