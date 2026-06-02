/**
 * ASTON ISOC — CENTRAL SOCIAL & CONTACT CONFIGURATION
 * ─────────────────────────────────────────────────────
 * Single source of truth for all external URLs.
 * All pages, components and CTAs MUST reference these — no hardcoded URLs.
 *
 * To update links: edit ONLY this file.
 * Links sourced from: https://linktr.ee/astonisoc (verified May 2026)
 */

export const SOCIAL = {
  linktree:   "https://linktr.ee/astonisoc",
  instagram:  "https://www.instagram.com/astonisoc/",
  youtube:    "https://www.youtube.com/@astonisoc",
  // X / Twitter present on Linktree but no handle confirmed — update when available
  x:          "https://x.com/astonisoc",
  facebook:   "https://www.facebook.com/astonisoc",
} as const;

export const WHATSAPP = {
  /** Brothers freshers group — from Linktree */
  brothersFreshers: "https://chat.whatsapp.com/IpvSQMLlCFk9jZ40fP3Dww",
  /** Sisters freshers group — from Linktree */
  sistersFreshers:  "https://chat.whatsapp.com/G8Y7Xu2VpTk1DMdv1eZnY7",
  /** General community — update when main community link is added to Linktree */
  community:        "https://linktr.ee/astonisoc",
} as const;

export const MEMBERSHIP = {
  /** Aston SU membership page — from Linktree */
  join: "https://www.astonsu.com/society/isoc/",
  /** Membership discount card — from Linktree */
  discountCard: "https://www.notion.so/Aston-ISoc-Discount-Card-25-26-26a5bc9019fd8036b676d31825b1cdb6",
} as const;

export const PRAYER_LINKS = {
  /** Live prayer times widget — from Linktree */
  liveWidget: "https://masjidbox.com/prayer-times/aston-university-prayer-room",
  /** Aladhan API — used server-side to fetch live times */
  aladhanApi: "https://api.aladhan.com/v1/timingsByCity?city=Birmingham&country=UK&method=15",
} as const;

export const DONATIONS = {
  /** Ramadan / Iftaar GoFundMe — active campaign from Linktree */
  ramadanFundraiser: "https://www.gofundme.com/f/aston-isoc-iftaar-campaign",
  /** General donations fallback — Linktree hub */
  general: "https://linktr.ee/astonisoc",
} as const;

export const CONTACT = {
  /** Primary contact = Instagram DM */
  primary:   SOCIAL.instagram,
  /** Secondary contact = WhatsApp community */
  secondary: WHATSAPP.community,
  /** Linktree hub — use when in doubt */
  hub:       SOCIAL.linktree,
  /** Physical address */
  address:   "Aston University, Aston Triangle, Birmingham, B4 7ET",
} as const;

/** Helper: build a WhatsApp message link */
export function waLink(phone: string, message?: string) {
  const base = `https://wa.me/${phone.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Helper: build an Instagram DM link */
export function igDmLink(handle = "astonisoc") {
  return `https://ig.me/m/${handle}`;
}
