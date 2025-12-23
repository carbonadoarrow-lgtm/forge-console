"use client";

import { useEffect, useMemo, useState } from "react";
import { PERSONA_COOKIE, Persona, normalizePersona } from "./persona";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

export function usePersona() {
  const [persona, setPersonaState] = useState<Persona>("leto");

  useEffect(() => {
    const c = getCookie(PERSONA_COOKIE);
    if (c) setPersonaState(normalizePersona(c));
  }, []);

  const setPersona = (p: Persona) => {
    setPersonaState(p);
    setCookie(PERSONA_COOKIE, p);
  };

  return useMemo(() => ({ persona, setPersona }), [persona]);
}
