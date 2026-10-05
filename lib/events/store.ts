import { promises as fs } from "node:fs";
import { join } from "node:path";
import type { Event } from "@/types";

/**
 * EVENT STORAGE
 * ---------------------------------------------------------------
 * Committee-added events live in Upstash Redis (free tier, added from Vercel →
 * Storage). Each event is one field in a hash, so two committee members saving
 * at once cannot overwrite each other's events.
 *
 * Production without Redis connected: reads return nothing extra and writes
 * fail loudly. Writing to the serverless filesystem would appear to work and
 * then vanish on the next deploy, which is worse than an error.
 *
 * Development without Redis: a JSON file in .data/ (gitignored), so the admin
 * panel can be exercised locally with no credentials.
 */

/**
 * Keys are namespaced by Vercel environment. One Upstash database is normally
 * connected to Production AND Preview; without this, an event added while
 * testing a preview deployment would appear on the live site.
 * Production keeps the plain "isoc:" prefix.
 */
const NAMESPACE =
  process.env.VERCEL_ENV === "production" ? "isoc" : `isoc:${process.env.VERCEL_ENV ?? "local"}`;

export const storageNamespace = NAMESPACE;

const HASH_KEY = `${NAMESPACE}:events`;

function redisConfig(): { url: string; token: string } | null {
  // The Vercel Marketplace integration names these KV_*; a direct Upstash
  // connection names them UPSTASH_*. Accept either.
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

const isProduction = process.env.NODE_ENV === "production";

export type StorageMode = "redis" | "local-file" | "unavailable";

export function storageMode(): StorageMode {
  if (redisConfig()) return "redis";
  return isProduction ? "unavailable" : "local-file";
}

export class StorageUnavailableError extends Error {
  constructor() {
    super(
      "Event storage is not connected. In Vercel, open Storage → create an Upstash Redis database → connect it to this project, then redeploy."
    );
    this.name = "StorageUnavailableError";
  }
}

/* ── Redis over REST ──────────────────────────────────────────────────── */

async function redis<T = unknown>(command: (string | number)[]): Promise<T> {
  const cfg = redisConfig();
  if (!cfg) throw new StorageUnavailableError();
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    // Caching is done one level up with unstable_cache and an "events" tag.
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  const json = (await res.json().catch(() => ({}))) as { result?: T; error?: string };
  if (!res.ok || json.error) {
    throw new Error(`Redis ${String(command[0])} failed: ${json.error ?? res.status}`);
  }
  return json.result as T;
}

async function redisPipeline(commands: (string | number)[][]): Promise<unknown[]> {
  const cfg = redisConfig();
  if (!cfg) throw new StorageUnavailableError();
  const res = await fetch(`${cfg.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  const json = (await res.json().catch(() => [])) as { result?: unknown; error?: string }[];
  if (!res.ok || !Array.isArray(json)) throw new Error(`Redis pipeline failed: ${res.status}`);
  const failed = json.find(r => r.error);
  if (failed) throw new Error(`Redis pipeline failed: ${failed.error}`);
  return json.map(r => r.result);
}

/* ── Local file (development only) ────────────────────────────────────── */

const LOCAL_FILE = join(process.cwd(), ".data", "events.json");

async function readLocal(): Promise<Record<string, Event>> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")) as Record<string, Event>;
  } catch {
    return {};
  }
}

async function writeLocal(all: Record<string, Event>): Promise<void> {
  await fs.mkdir(join(process.cwd(), ".data"), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(all, null, 2));
}

/* ── Public API ───────────────────────────────────────────────────────── */

function parseEvent(raw: string): Event | null {
  try {
    const e = JSON.parse(raw) as Event;
    return e && typeof e.id === "string" && typeof e.date === "string" ? e : null;
  } catch {
    return null;
  }
}

/** Every committee-added event, past and future. */
export async function listStoredEvents(): Promise<Event[]> {
  const mode = storageMode();
  if (mode === "unavailable") return [];
  if (mode === "local-file") return Object.values(await readLocal());

  const flat = await redis<string[]>(["HGETALL", HASH_KEY]);
  const out: Event[] = [];
  for (let i = 1; i < (flat?.length ?? 0); i += 2) {
    const e = parseEvent(flat[i]);
    if (e) out.push(e);
  }
  return out;
}

export async function getStoredEvent(id: string): Promise<Event | null> {
  const mode = storageMode();
  if (mode === "unavailable") return null;
  if (mode === "local-file") return (await readLocal())[id] ?? null;
  const raw = await redis<string | null>(["HGET", HASH_KEY, id]);
  return raw ? parseEvent(raw) : null;
}

export async function saveStoredEvent(event: Event): Promise<void> {
  const mode = storageMode();
  if (mode === "unavailable") throw new StorageUnavailableError();
  if (mode === "local-file") {
    const all = await readLocal();
    all[event.id] = event;
    await writeLocal(all);
    return;
  }
  await redis(["HSET", HASH_KEY, event.id, JSON.stringify(event)]);
}

export async function deleteStoredEvent(id: string): Promise<void> {
  const mode = storageMode();
  if (mode === "unavailable") throw new StorageUnavailableError();
  if (mode === "local-file") {
    const all = await readLocal();
    delete all[id];
    await writeLocal(all);
    return;
  }
  await redis(["HDEL", HASH_KEY, id]);
}

/* ── Counters (login rate limiting) ───────────────────────────────────── */

const memoryCounters = new Map<string, { n: number; until: number }>();

/**
 * Increments a counter that resets `ttlSeconds` after its first hit, and
 * returns the new value. Redis-backed in production so the limit holds across
 * serverless instances; in-memory locally.
 */
export async function hitCounter(name: string, ttlSeconds: number): Promise<number> {
  const key = `${NAMESPACE}:${name}`;
  if (storageMode() === "redis") {
    const [, count] = await redisPipeline([
      ["SET", key, "0", "EX", ttlSeconds, "NX"],
      ["INCR", key],
    ]);
    return Number(count);
  }
  const now = Date.now();
  const cur = memoryCounters.get(key);
  if (!cur || cur.until < now) {
    memoryCounters.set(key, { n: 1, until: now + ttlSeconds * 1000 });
    return 1;
  }
  cur.n += 1;
  return cur.n;
}

export async function clearCounter(name: string): Promise<void> {
  const key = `${NAMESPACE}:${name}`;
  if (storageMode() === "redis") {
    await redis(["DEL", key]);
    return;
  }
  memoryCounters.delete(key);
}
