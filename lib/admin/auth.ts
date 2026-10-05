import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * ADMIN AUTHENTICATION
 * ---------------------------------------------------------------
 * One committee password, set in Vercel as ADMIN_PASSWORD, plus a random
 * ADMIN_SESSION_SECRET used to sign the login cookie.
 *
 * The cookie holds only an expiry and a fingerprint of the current password,
 * signed with HMAC-SHA256. Changing ADMIN_PASSWORD therefore logs every
 * device out immediately — useful at committee handover.
 *
 * Every admin page AND every admin action calls requireAdmin() itself. There
 * is deliberately no middleware/proxy gate to rely on instead: a check that
 * lives in one layer can be bypassed by reaching the code another way.
 */

export const SESSION_COOKIE = "isoc_admin";
const SESSION_DAYS = 7;

function config(): { password: string; secret: string } | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || !secret || secret.length < 32) return null;
  return { password, secret };
}

export function adminConfigured(): boolean {
  return config() !== null;
}

const sha256 = (s: string) => createHash("sha256").update(s).digest();
const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64url");

function passwordFingerprint(cfg: { password: string; secret: string }): string {
  return createHmac("sha256", cfg.secret).update(`pw:${cfg.password}`).digest("base64url").slice(0, 16);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Constant-time comparison; hashing first makes the lengths equal. */
export function passwordMatches(input: string): boolean {
  const cfg = config();
  if (!cfg) return false;
  return timingSafeEqual(sha256(input), sha256(cfg.password));
}

export function createSessionToken(): { token: string; maxAge: number } {
  const cfg = config();
  if (!cfg) throw new Error("Admin is not configured");
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const payload = b64url(JSON.stringify({ exp: Date.now() + maxAge * 1000, v: passwordFingerprint(cfg) }));
  return { token: `${payload}.${sign(payload, cfg.secret)}`, maxAge };
}

function tokenIsValid(token: string | undefined): boolean {
  const cfg = config();
  if (!cfg || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = Buffer.from(sign(payload, cfg.secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;

  try {
    const { exp, v } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number; v: string };
    return typeof exp === "number" && exp > Date.now() && v === passwordFingerprint(cfg);
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  return tokenIsValid((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Call at the top of every admin page and admin server action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
