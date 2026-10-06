/**
 * ASTON ISOC - CENTRAL SOCIAL & CONTACT CONFIGURATION
 * Single source of truth for all external URLs.
 */

export const SOCIAL = {
  linktree:   "https://linktr.ee/astonisoc",
  instagram:  "https://www.instagram.com/astonisoc/",
  linkedin:   "https://www.linkedin.com/company/aston-isoc",
} as const;

export const WHATSAPP = {
  brothersFreshers: "https://chat.whatsapp.com/H59AtdMxGSyDRZHjeks0a3",
  sistersFreshers:  "https://chat.whatsapp.com/C635Kajirb0Kla4jQVp3v9",
  community:        "https://linktr.ee/astonisoc",
} as const;

/**
 * TellSafe — anonymous community feedback platform.
 * `url` is the society's own TellSafe page ("Aston Isoc"), used for the
 * embedded form and every link to it. Keep it free of tracking parameters
 * (utm_*, fbclid) even when the link is copied from Instagram.
 */
export const TELLSAFE = {
  url:    "https://www.tellsafe.app/aston-isoc",
  origin: "https://www.tellsafe.app",
} as const;

export const MEMBERSHIP = {
  join:         "https://www.astonsu.com/society/isoc/",
  // The discount card itself is not linked from the site: members receive it
  // with their membership, so every discount CTA points at `join`.
} as const;

export const PRAYER_LINKS = {
  liveWidget: "https://masjidbox.com/prayer-times/aston-university-prayer-room",
  aladhanApi: "https://api.aladhan.com/v1/timingsByCity?city=Birmingham&country=UK&method=15",
} as const;

export const DONATIONS = {
  ramadanFundraiser: "https://www.gofundme.com/f/aston-isoc-iftaar-campaign",
  general:           "https://linktr.ee/astonisoc",
} as const;

export const CONTACT = {
  primary:   SOCIAL.instagram,
  secondary: WHATSAPP.community,
  hub:       SOCIAL.linktree,
  address:   "Aston University, Aston Triangle, Birmingham, B4 7ET",
} as const;

export function igDmLink(handle = "astonisoc") {
  return `https://ig.me/m/${handle}`;
}
