"use client";

import { usePersona } from "@/lib/persona/use-persona";

export function PersonaToggle() {
  const { persona, setPersona } = usePersona();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-1">
      <button
        className={`px-2 py-1 text-sm rounded-md ${
          persona === "leto" ? "bg-neutral-800" : "hover:bg-neutral-900"
        }`}
        onClick={() => setPersona("leto")}
        aria-pressed={persona === "leto"}
      >
        LETO
      </button>
      <button
        className={`px-2 py-1 text-sm rounded-md ${
          persona === "member" ? "bg-neutral-800" : "hover:bg-neutral-900"
        }`}
        onClick={() => setPersona("member")}
        aria-pressed={persona === "member"}
      >
        Circle Member
      </button>
    </div>
  );
}
