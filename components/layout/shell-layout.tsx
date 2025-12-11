"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { TopBar } from "./top-bar"
import { Sidebar } from "./sidebar"
import { LogConsole } from "./log-console"
import { ChatDock } from "./chat-dock"
import { OperatorBar } from "./operator-bar"

interface ShellLayoutProps {
  children: React.ReactNode
}

export function ShellLayout({ children }: ShellLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState<{
    type: "run" | "report" | "state" | "skill" | "mission"
    id: string
    name: string
  }>()

  const pathname = usePathname()
  const isForgeRoute = pathname?.startsWith("/forge") || false

  const handleChatOpen = (context?: typeof chatContext) => {
    setChatContext(context)
    setIsChatOpen(true)
  }

  return (
    <div className="h-screen flex flex-col">
      <TopBar onChatOpen={() => handleChatOpen()} />
      {isForgeRoute && <OperatorBar />}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        <ChatDock
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          context={chatContext}
        />
      </div>

      <LogConsole />
    </div>
  )
}
