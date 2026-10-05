import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { COOKIE_NAME, getSecretKey, verifySessionToken, sanitizeNextUrl } from "./auth-core";

export { COOKIE_NAME, verifySessionToken, sanitizeNextUrl };

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function createSession(user) {
  const token = await new SignJWT({
    userId: user.id,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return token;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}