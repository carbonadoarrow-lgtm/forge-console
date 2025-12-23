"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSphere } from "@/lib/contexts/sphere-context"
import { usePersona } from "@/lib/persona/use-persona"
import { forgeNav, orunmilaNav, memberNav, type NavItem } from "@/components/sidebar/nav-items"


export function Sidebar() {
  const pathname = usePathname()
  const { sphere } = useSphere()
  const { persona } = usePersona()
  
  // Get base navigation based on sphere
  let baseNavItems: NavItem[] = []
  if (sphere === "forge") {
    baseNavItems = forgeNav
  } else {
    baseNavItems = orunmilaNav
  }
  
  // If we're in member area, show member navigation
  if (pathname.startsWith("/member")) {
    baseNavItems = memberNav
  }
  
  // Filter navigation items based on persona
  const filterByPersona = (items: NavItem[]): NavItem[] => {
    return items
      .filter(item => !item.personas || item.personas.includes(persona))
      .map(item => ({
        ...item,
        children: item.children ? filterByPersona(item.children) : undefined
      }))
  }
  
  const navItems = filterByPersona(baseNavItems)

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
