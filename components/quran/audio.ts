/**
 * Recitation audio, browser side.
 *
 * Files come from quran.com's CDN (verses.quran.com, CORS-enabled). Each one
 * is fetched once, kept in Cache Storage, and played from a blob URL — so a
 * recitation heard once plays again with no connection, and Safari's range
 * requests never meet the cache. If anything here fails the URL is streamed
 * directly instead.
 */
const AUDIO_CACHE = "isoc-quran-audio-v1";

export async function loadAudio(url: string): Promise<string> {
  try {
    if (typeof caches !== "undefined") {
      const cache = await caches.open(AUDIO_CACHE);
      let res = await cache.match(url);
      if (!res) {
        const net = await fetch(url, { mode: "cors" });
        if (!net.ok) throw new Error(String(net.status));
        await cache.put(url, net.clone());
        res = net;
      }
      return URL.createObjectURL(await res.blob());
    }
  } catch {
    // Offline with nothing cached, or storage unavailable: stream instead.
  }
  return url;
}

export function releaseAudio(src: string) {
  if (src.startsWith("blob:")) URL.revokeObjectURL(src);
}
