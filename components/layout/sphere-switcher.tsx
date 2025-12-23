"use client"

import { useSphere } from "@/lib/contexts/sphere-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SphereSwitcher() {
  const { sphere, setSphere } = useSphere()
  const router = useRouter()
  const [persona, setPersona] = useState<"leto" | "circle">("leto")

  const handleSphereChange = (newSphere: "forge" | "orunmila") => {
    setSphere(newSphere)
    router.push(`/${newSphere}`)
  }

  return (
    <div className="flex items-center gap-3">
      {/* Sphere + LETO group */}
      <div className="flex items-center gap-1 rounded-md border p-1 bg-muted/30">
        <Button
          variant={sphere === "forge" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handleSphereChange("forge")}
          className="text-xs h-8"
        >
          Forge OS
        </Button>
        <Button
          variant={sphere === "orunmila" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handleSphereChange("orunmila")}
          className="text-xs h-8"
        >
          Orunmila
        </Button>
        <Button
          variant={persona === "leto" ? "default" : "ghost"}
          size="sm"
          onClick={() => setPersona("leto")}
          className="text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
        >
          LETO
        </Button>
      </div>

      {/* Circle Member separate */}
      <div className="flex items-center rounded-md border p-1 bg-muted/30">
        <Button
          variant={persona === "circle" ? "default" : "ghost"}
          size="sm"
          onClick={() => setPersona("circle")}
          className="text-xs h-8"
        >
          Circle Member
        </Button>
      </div>
    </div>
  )
}
