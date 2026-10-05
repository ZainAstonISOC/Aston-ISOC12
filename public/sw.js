/*
 * Aston ISOC — Daily Ayah offline worker.
 *
 * Registered by /ayah with scope "/ayah", so it only ever controls that page.
 * - The page itself: network first, cached copy when offline.
 * - Same-origin files the page uses (/_next/static, fonts, icons): cached;
 *   hashed build files are immutable, so those are served cache-first.
 * - Cross-origin requests are never touched. Recitation audio is cached by
 *   the page itself (components/quran/audio.ts).
 */
const CACHE = "isoc-ayah-v1";
const MAX_ENTRIES = 150;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.add("/ayah")).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("isoc-ayah-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// The page lists what it loaded before this worker took control.
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "precache" || !Array.isArray(data.urls)) return;
  const urls = data.urls.filter((u) => {
    try {
      return new URL(u, self.location.origin).origin === self.location.origin;
    } catch {
      return false;
    }
  });
  event.waitUntil(
    caches.open(CACHE).then((c) => Promise.all(urls.map((u) => c.match(u).then((hit) => hit || c.add(u).catch(() => {}))))).then(trim),
  );
});

// Clone synchronously (callers do), store asynchronously.
function put(key, copy) {
  return caches.open(CACHE).then((c) => c.put(key, copy)).catch(() => {});
}

async function trim() {
  const c = await caches.open(CACHE);
  const keys = await c.keys();
  // Oldest first; keep the page itself.
  for (const req of keys.slice(0, Math.max(0, keys.length - MAX_ENTRIES))) {
    if (new URL(req.url).pathname !== "/ayah") await c.delete(req);
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) put("/ayah", res.clone());
          return res;
        })
        .catch(() => caches.match("/ayah").then((hit) => hit || Response.error())),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) put(req, res.clone()).then(trim);
            return res;
          }),
      ),
    );
    return;
  }

  // Anything else same-origin: network first, cache as the fallback.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && !url.searchParams.has("_rsc")) put(req, res.clone());
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || Response.error())),
  );
});
