"use client"

import { SphereSwitcher } from "./sphere-switcher"
import { Button } from "@/components/ui/button"
import { MessageSquare, User, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface TopBarProps {
  onChatOpen?: () => void
}

export function TopBar({ onChatOpen }: TopBarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Midas Cercle</h1>
      </div>

      <div className="flex items-center gap-4">
        <SphereSwitcher />
        {onChatOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={onChatOpen}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Ask
          </Button>
        )}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
