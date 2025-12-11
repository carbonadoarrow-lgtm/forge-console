"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Zap,
  Target,
  Play,
  FileText,
  Package,
  Settings,
  Activity,
  TrendingUp,
  Calendar,
  Database,
  MessageSquare,
  Briefcase,
} from "lucide-react"
import { useSphere } from "@/lib/contexts/sphere-context"
import type { NavItem } from "@/lib/types"

const forgeNav: NavItem[] = [
  {
    title: "Activity",
    children: [
      { title: "Overview", href: "/forge/activity", icon: Activity },
      { title: "Chat", href: "/forge/chat", icon: MessageSquare },
      { title: "Reports", href: "/forge/missions/mission-1/reports", icon: FileText },
      { title: "Jobs", href: "/forge/jobs", icon: Briefcase },
    ],
  },
  { title: "Overview", href: "/forge", icon: Home },
  {
    title: "Execution",
    children: [
      { title: "Skills", href: "/forge/skills", icon: Zap },
      { title: "Missions", href: "/forge/missions", icon: Target },
      { title: "Runs", href: "/forge/runs", icon: Play },
    ],
  },
  {
    title: "Knowledge & Reports",
    children: [
      { title: "Reports", href: "/forge/reports", icon: FileText },
      { title: "Artifacts", href: "/forge/artifacts", icon: Package },
    ],
  },
  {
    title: "System",
    children: [
      { title: "Status", href: "/forge/system", icon: Activity },
      { title: "Settings", href: "/forge/settings", icon: Settings },
    ],
  },
]

const orunmilaNav: NavItem[] = [
  { title: "Oracle Overview", href: "/orunmila", icon: Home },
  {
    title: "Execution",
    children: [
      { title: "XAU Skills", href: "/orunmila/skills", icon: Zap },
      { title: "Missions", href: "/orunmila/missions", icon: Target },
    ],
  },
  {
    title: "State",
    children: [
      { title: "Daily State", href: "/orunmila/state/daily", icon: Calendar },
      { title: "4-Week Cycle State", href: "/orunmila/state/cycle-4w", icon: TrendingUp },
      { title: "Structural State", href: "/orunmila/state/structural", icon: Database },
    ],
  },
  {
    title: "Knowledge & Reports",
    children: [
      { title: "Reports", href: "/orunmila/reports", icon: FileText },
    ],
  },
  {
    title: "System",
    children: [
      { title: "Oracle Dashboard", href: "/orunmila/oracle", icon: Activity },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sphere } = useSphere()
  const navItems = sphere === "forge" ? forgeNav : orunmilaNav

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    {item.title}
                  </div>
                  {item.children?.map((child, childIndex) => (
                    <Link
                      key={childIndex}
                      href={child.href!}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 pl-6 text-sm transition-colors",
                        pathname === child.href
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {child.icon && <child.icon className="h-4 w-4" />}
                      {child.title}
                    </Link>
                  ))}
                </>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
