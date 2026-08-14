/**
 * INSTAGRAM FEED
 * ---------------------------------------------------------------
 * Pulls the society's latest posts from the Instagram Graph API.
 *
 * Setup (once, by a committee member with admin on the account):
 *   1. Convert @astonisoc to a Business or Creator account.
 *   2. Create an app at developers.facebook.com and add "Instagram".
 *   3. Generate a long-lived access token (60 days) for the account.
 *   4. Set INSTAGRAM_ACCESS_TOKEN in Vercel → Settings → Environment Variables.
 *
 * Until that token exists the site renders the fallback panel instead — the
 * feed never blocks a page render and never throws.
 */

const GRAPH_VERSION = "v21.0";
const FIELDS = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";

export interface InstagramPost {
  id: string;
  caption: string;
  /** Display image. For videos/reels this is the thumbnail. */
  image: string;
  permalink: string;
  timestamp: string;
  isVideo: boolean;
  isAlbum: boolean;
}

export type InstagramFeed =
  | { status: "live"; posts: InstagramPost[] }
  | { status: "unconfigured"; posts: [] }
  | { status: "error"; posts: []; reason: string };

interface GraphMediaItem {
  id: string;
  caption?: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

function normalise(item: GraphMediaItem): InstagramPost | null {
  const image = item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url;
  if (!image) return null;
  return {
    id: item.id,
    caption: item.caption?.trim() ?? "",
    image,
    permalink: item.permalink,
    timestamp: item.timestamp,
    isVideo: item.media_type === "VIDEO",
    isAlbum: item.media_type === "CAROUSEL_ALBUM",
  };
}

/**
 * Fetches the latest posts. Cached for an hour so a page render never waits on
 * Instagram, and a token outage degrades to the fallback rather than an error.
 */
export async function getInstagramPosts(limit = 6): Promise<InstagramFeed> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return { status: "unconfigured", posts: [] };

  const userId = process.env.INSTAGRAM_USER_ID?.trim() || "me";
  const url =
    `https://graph.instagram.com/${GRAPH_VERSION}/${userId}/media` +
    `?fields=${FIELDS}&limit=${limit}&access_token=${encodeURIComponent(token)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600, tags: ["instagram"] },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      return { status: "error", posts: [], reason: `Instagram API responded ${res.status}` };
    }

    const json: unknown = await res.json();
    const data = (json as { data?: GraphMediaItem[] }).data;
    if (!Array.isArray(data)) {
      return { status: "error", posts: [], reason: "Unexpected Instagram API response shape" };
    }

    const posts = data.map(normalise).filter((p): p is InstagramPost => p !== null);
    if (posts.length === 0) {
      return { status: "error", posts: [], reason: "Instagram returned no renderable media" };
    }

    return { status: "live", posts };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Unknown Instagram fetch failure";
    return { status: "error", posts: [], reason };
  }
}

/** Trims a caption to a readable card length without cutting mid-word. */
export function shortCaption(caption: string, max = 120): string {
  const firstLine = caption.split("\n").find(l => l.trim().length > 0)?.trim() ?? "";
  if (firstLine.length <= max) return firstLine;
  const cut = firstLine.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
