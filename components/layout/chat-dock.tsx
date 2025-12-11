"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Send } from "lucide-react"
import { useSphere } from "@/lib/contexts/sphere-context"
import type { ChatMessage } from "@/lib/types"

interface ChatDockProps {
  isOpen: boolean
  onClose: () => void
  context?: {
    type: "run" | "report" | "state" | "skill" | "mission"
    id: string
    name: string
  }
}

export function ChatDock({ isOpen, onClose, context }: ChatDockProps) {
  const { sphere } = useSphere()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: "temp-session",
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
      meta: {},
    }

    setMessages([...messages, newMessage])
    setInput("")

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        session_id: "temp-session",
        role: "assistant",
        content: "This is a placeholder response. Real chat integration coming soon.",
        created_at: new Date().toISOString(),
        meta: {},
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-14 bottom-0 w-96 border-l bg-background shadow-lg z-50">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h3 className="font-semibold">
              {sphere === "forge" ? "Ask Forge" : "Ask Orunmila"}
            </h3>
            {context && (
              <p className="text-xs text-muted-foreground">
                {context.type}: {context.name}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              {context
                ? `Ask questions about this ${context.type}`
                : "Start a conversation"}
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "rounded-lg p-3 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-8"
                    : "bg-muted mr-8"
                )}
              >
                {message.content}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type your message..."
              className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
            <Button onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
