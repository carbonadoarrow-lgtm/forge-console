"use client"

import { useSphere } from "@/lib/contexts/sphere-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function SphereSwitcher() {
  const { sphere, setSphere } = useSphere()
  const router = useRouter()

  const handleSphereChange = (newSphere: "forge" | "orunmila") => {
    setSphere(newSphere)
    router.push(`/${newSphere}`)
  }

  return (
    <div className="flex items-center gap-1 rounded-md border p-1">
      <Button
        variant={sphere === "forge" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleSphereChange("forge")}
        className="text-xs"
      >
        Forge OS
      </Button>
      <Button
        variant={sphere === "orunmila" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleSphereChange("orunmila")}
        className="text-xs"
      >
        Orunmila
      </Button>
    </div>
  )
}
