import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PERSONA_COOKIE = "forge_persona";

function personaFromCookie(req: NextRequest): "leto" | "member" {
  const v = req.cookies.get(PERSONA_COOKIE)?.value;
  return v === "member" ? "member" : "leto";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const persona = personaFromCookie(req);

  // Admin area => LETO only
  if (pathname.startsWith("/admin") && persona !== "leto") {
    const url = req.nextUrl.clone();
    url.pathname = "/member";
    return NextResponse.redirect(url);
  }

  // Member area => Member only (optional; lets you keep it clean)
  if (pathname.startsWith("/member") && persona !== "member") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};
