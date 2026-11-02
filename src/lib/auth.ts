import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins } from "@/db/schema";

const COOKIE_NAME = "ra_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "roemah-aura-local-session-secret";
const MAX_AGE_SECONDS = 60 * 60 * 8;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(digest, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
}

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

function createToken(adminId: number) {
  const payload = `${adminId}.${Date.now() + MAX_AGE_SECONDS * 1000}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

function readToken(token: string | undefined) {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }
  if (sign(payload) !== signature) return null;
  const [id, expiry] = payload.split(".");
  const adminId = Number(id);
  const expiresAt = Number(expiry);
  if (!Number.isFinite(adminId) || !Number.isFinite(expiresAt)) return null;
  if (Date.now() > expiresAt) return null;
  return { adminId };
}

export async function signIn(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, normalized))
    .limit(1);

  if (!admin || !verifyPassword(password, admin.passwordHash)) return null;

  const store = await cookies();
  store.set(COOKIE_NAME, createToken(admin.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
}

export async function signOut() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getCurrentAdmin() {
  const store = await cookies();
  const session = readToken(store.get(COOKIE_NAME)?.value);
  if (!session) return null;
  const [admin] = await db
    .select({
      id: admins.id,
      name: admins.name,
      email: admins.email,
      role: admins.role,
    })
    .from(admins)
    .where(eq(admins.id, session.adminId))
    .limit(1);
  return admin ?? null;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");
  return admin;
}
