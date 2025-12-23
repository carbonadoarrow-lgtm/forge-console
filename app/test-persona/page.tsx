"use client";

import { PersonaToggle } from "@/components/header/persona-toggle";
import { usePersona } from "@/lib/persona/use-persona";
import Link from "next/link";

export default function TestPersonaPage() {
  const { persona } = usePersona();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Persona Toggle Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Current Persona</h2>
        <div className="inline-block px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">
          {persona.toUpperCase()}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Persona Toggle Component</h2>
        <PersonaToggle />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Test Navigation</h2>
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/member" 
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Go to Member Area
          </Link>
          <Link 
            href="/admin/approvals" 
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Go to Admin Approvals
          </Link>
          <Link 
            href="/admin/publish-queue" 
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Go to Admin Publish Queue
          </Link>
          <Link 
            href="/forge" 
            className="px-4 py-2 rounded-md border hover:bg-muted"
          >
            Go to Forge (Default)
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Middleware Behavior</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Current persona:</strong> {persona}</p>
          <p><strong>Access to /member:</strong> {persona === "member" ? "✅ Allowed" : "❌ Redirected to /"}</p>
          <p><strong>Access to /admin/*:</strong> {persona === "leto" ? "✅ Allowed" : "❌ Redirected to /member"}</p>
          <p className="text-muted-foreground">
            Note: The middleware will redirect based on persona cookie. Try switching personas and navigating.
          </p>
        </div>
      </div>
    </div>
  );
}
