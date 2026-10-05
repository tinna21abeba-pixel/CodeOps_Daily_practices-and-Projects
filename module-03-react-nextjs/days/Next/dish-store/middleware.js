import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
  process.env.SESSION_SECRET || process.env.session || "dish_store_secret_session_key_32_bytes_min"
);

export async function middleware(request) {
  const token = request.cookies.get("session")?.value;

  let session = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      session = payload;
    } catch {
      session = null;
    }
  }

  if (!session?.user) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout", "/orders"],
};
