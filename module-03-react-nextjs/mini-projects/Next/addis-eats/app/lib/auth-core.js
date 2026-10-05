import { jwtVerify } from "jose";

export const COOKIE_NAME = "ae_session";

export function getSecretKey() {
  const secret = process.env.SESSION_SECRET || "addis_eats_secure_session_key_32_characters_minimum";
  return new TextEncoder().encode(secret);
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

export function sanitizeNextUrl(nextUrl) {
  if (!nextUrl || typeof nextUrl !== "string") {
    return "/orders/mine";
  }
  if (!nextUrl.startsWith("/") || nextUrl.startsWith("//") || nextUrl.startsWith("/\\")) {
    return "/orders/mine";
  }
  try {
    const dummy = new URL(nextUrl, "https://example.com");
    if (dummy.origin !== "https://example.com") {
      return "/orders/mine";
    }
    return `${dummy.pathname}${dummy.search}`;
  } catch {
    return "/orders/mine";
  }
}
