"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LogConsoleProps {
  logs?: string[]
  runId?: string
}

export function LogConsole({ logs = [], runId }: LogConsoleProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "border-t bg-background transition-all",
        isCollapsed ? "h-10" : "h-64"
      )}
    >
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-6 w-6 p-0"
          >
            {isCollapsed ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <span className="text-sm font-medium">Console</span>
          {runId && (
            <span className="text-xs text-muted-foreground">Run: {runId}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!isCollapsed && (
        <Tabs defaultValue="logs" className="h-full">
          <TabsList className="mx-4 mt-2">
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          <TabsContent value="logs" className="h-[calc(100%-5rem)] overflow-y-auto px-4 py-2">
            <div className="space-y-1 font-mono text-xs">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="text-muted-foreground">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No logs available</div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="system" className="h-[calc(100%-5rem)] overflow-y-auto px-4 py-2">
            <div className="text-xs text-muted-foreground">System messages will appear here</div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

// Helper for className merging
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
