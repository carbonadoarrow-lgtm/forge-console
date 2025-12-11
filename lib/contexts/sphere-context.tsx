"use client"

import React, { createContext, useContext, useState } from "react"
import type { Sphere } from "@/lib/types"

interface SphereContextType {
  sphere: Sphere
  setSphere: (sphere: Sphere) => void
}

const SphereContext = createContext<SphereContextType | undefined>(undefined)

export function SphereProvider({ children }: { children: React.ReactNode }) {
  const [sphere, setSphere] = useState<Sphere>("forge")

  return (
    <SphereContext.Provider value={{ sphere, setSphere }}>
      {children}
    </SphereContext.Provider>
  )
}

export function useSphere() {
  const context = useContext(SphereContext)
  if (context === undefined) {
    throw new Error("useSphere must be used within a SphereProvider")
  }
  return context
}
