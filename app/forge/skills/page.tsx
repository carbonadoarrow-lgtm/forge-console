"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/ui/status-badge"
import { useForgeSkills, useRunForgeSkill } from "@/lib/hooks/use-forge-api"
import { Play, Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function ForgeSkillsPage() {
  const { data: skills, isLoading } = useForgeSkills()
  const runSkill = useRunForgeSkill()

  const handleRun = (skillId: string) => {
    runSkill.mutate(skillId)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Skills"
        description="Infrastructure and automation skills"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!skills || skills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No skills found
                </TableCell>
              </TableRow>
            ) : (
              skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell className="max-w-md truncate">{skill.description}</TableCell>
                  <TableCell>{skill.type}</TableCell>
                  <TableCell>
                    {skill.lastRunTime
                      ? format(new Date(skill.lastRunTime), "MMM d, h:mm a")
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    {skill.lastRunStatus && <StatusBadge status={skill.lastRunStatus} />}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/forge/skills/${skill.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRun(skill.id)}
                        disabled={skill.can_run === false || runSkill.isPending}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Run
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
