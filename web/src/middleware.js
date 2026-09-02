import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("smart_admin_token")?.value;

  // Protect Admin Dashboard and all subpages
  if (pathname.startsWith("/admin/dashboard")) {
    if (!token || token.trim() === "") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and visiting login page, redirect to dashboard
  if (pathname === "/admin/login") {
    if (token && token.trim() !== "") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/dashboard",
    "/admin/login",
  ],
};
