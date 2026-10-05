import { NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionToken, sanitizeNextUrl } from "./app/lib/auth-core";

export async function middleware(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session?.userId) {
    const loginUrl = new URL("/sign-in", request.url);
    const destination = request.nextUrl.pathname + request.nextUrl.search;
    loginUrl.searchParams.set("next", sanitizeNextUrl(destination));
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout", "/orders", "/orders/:path*", "/staff", "/staff/:path*"],
};
