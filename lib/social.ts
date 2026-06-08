/**
 * ASTON ISOC - CENTRAL SOCIAL & CONTACT CONFIGURATION
 * Single source of truth for all external URLs.
 * All pages, components and CTAs MUST reference these - no hardcoded URLs.
 * Links sourced from: https://linktr.ee/astonisoc
 */

export const SOCIAL = {
  linktree:   "https://linktr.ee/astonisoc",
  instagram:  "https://www.instagram.com/astonisoc/",
  // YouTube removed - not actively used
} as const;

export const WHATSAPP = {
  brothersFreshers: "https://chat.whatsapp.com/IpvSQMLlCFk9jZ40fP3Dww",
  sistersFreshers:  "https://chat.whatsapp.com/G8Y7Xu2VpTk1DMdv1eZnY7",
  community:        "https://linktr.ee/astonisoc",
} as const;

export const MEMBERSHIP = {
  join:         "https://www.astonsu.com/society/isoc/",
  discountCard: "https://www.notion.so/Aston-ISoc-Discount-Card-25-26-26a5bc9019fd8036b676d31825b1cdb6",
} as const;

export const PRAYER_LINKS = {
  liveWidget: "https://masjidbox.com/prayer-times/aston-university-prayer-room",
  aladhanApi: "https://api.aladhan.com/v1/timingsByCity?city=Birmingham&country=UK&method=15",
} as const;

export const DONATIONS = {
  ramadanFundraiser: "https://www.gofundme.com/f/aston-isoc-iftaar-campaign",
  general:           "https://linktr.ee/astonisoc",
  // Stripe keys go in .env.local - never hardcode here
  // NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
  // STRIPE_SECRET_KEY=sk_live_...
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
