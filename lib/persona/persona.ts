export type Persona = "leto" | "member";

export const PERSONA_COOKIE = "forge_persona";

export function normalizePersona(v: unknown): Persona {
  return v === "member" ? "member" : "leto";
}
