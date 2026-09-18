import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

const SESSION_VALUE = "granted";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthed = req.cookies.get(ADMIN_COOKIE_NAME)?.value === SESSION_VALUE;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  const isAuthRoute = pathname === "/api/admin/login" || pathname === "/api/admin/logout";
  if (pathname.startsWith("/api/admin") && !isAuthRoute && !isAuthed) {
    return NextResponse.json({ error: "לא מחוברת" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
