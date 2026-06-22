import { NextResponse, type NextRequest } from "next/server";
import { unsealData } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname.startsWith("/admin/login");

  if (!isAdminPath) {
    return NextResponse.next();
  }

  // Get the session cookie
  const sessionCookie = request.cookies.get(sessionOptions.cookieName)?.value;
  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      const session = await unsealData<SessionData>(sessionCookie, {
        password: sessionOptions.password,
      });
      isAuthenticated = session.isAdmin === true;
    } catch (error) {
      console.error("Session unseal error:", error);
    }
  }

  // Protect /admin routes (except /admin/login)
  if (!isLoginPath && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Redirect logged-in admin away from login page
  if (isLoginPath && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
