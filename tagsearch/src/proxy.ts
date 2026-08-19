import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Routes that require authentication
const protectedRoutes = ["/authenticated", "/add"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only check protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      // Redirect if missing token
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("message", "You must log in first.");
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify JWT
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next(); // allow the request
    } catch (error) {
      // Invalid or expired token
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("message", "Session expired. Please log in.");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Tell Next.js which routes to apply this middleware on
export const config = {
  matcher: ["/authenticated/:path*", "/add/:path*"],
};
