// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/maintenance",
];

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;

  // 1️⃣ Ignore internals & static
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 3️⃣ SYSTEM CHECK (DB health)
  try {
    const res = await fetch(`${origin}/api/db-status`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.rewrite(new URL("/maintenance", req.url));
    }

    const { status } = await res.json();
    if (status !== "ok") {
      return NextResponse.rewrite(new URL("/maintenance", req.url));
    }
  } catch {
    return NextResponse.rewrite(new URL("/maintenance", req.url));
  }

  // 4️⃣ AUTH CHECK
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // not logged in → redirect to sign-in
  if (!token) {
    const loginUrl = new URL("/sign-in", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5️⃣ Logged-in user trying to access auth pages
  if (
    token &&
    (pathname === "/" ||
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
