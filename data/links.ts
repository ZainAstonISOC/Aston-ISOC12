import { SOCIAL, WHATSAPP, MEMBERSHIP, PRAYER_LINKS } from "@/lib/social";

/**
 * /links — the one page the Instagram bio can point at.
 * `npm run links:check` opens every link here and only moves the "checked"
 * date (data/links-checked.json) when they all work.
 */
export interface LinkItem {
  label: string;
  desc: string;
  href: string;
}

export interface LinkGroup {
  id: string;
  title: string;
  blurb: string;
  items: LinkItem[];
}

export const linkGroups: LinkGroup[] = [
  {
    id: "involved",
    title: "Get involved",
    blurb: "Join, turn up, help out.",
    items: [
      { label: "Become a member", desc: "Through Aston SU. Membership keeps every event running.", href: MEMBERSHIP.join },
      { label: "What's on", desc: "Upcoming events, with a calendar you can subscribe to.", href: "/events" },
      { label: "Volunteer", desc: "Ramadan, Discover Islam Week and Charity Week all need hands.", href: "/volunteer" },
    ],
  },
  {
    id: "updated",
    title: "Stay updated",
    blurb: "Where we post, and how to hear it first.",
    items: [
      { label: "Instagram", desc: "@astonisoc. Everything lands here first.", href: SOCIAL.instagram },
      { label: "Brothers' WhatsApp group", desc: "Updates and community chat.", href: WHATSAPP.brothersFreshers },
      { label: "LinkedIn", desc: "Society news, alumni and careers.", href: SOCIAL.linkedin },
    ],
  },
  {
    id: "faith",
    title: "Prayer and Qur'an",
    blurb: "The everyday things.",
    items: [
      { label: "Prayer times", desc: "Today's start times, the prayer rooms and Jumu'ah.", href: "/prayer-times" },
      { label: "Prayer room jamaat times", desc: "Set by the Aston University prayer room.", href: PRAYER_LINKS.liveWidget },
      { label: "Read the Qur'an", desc: "Translation, recitation and tafsir, ayah by ayah.", href: "/quran" },
      { label: "Daily Ayah", desc: "One ayah a day, with recitation. Works offline.", href: "/ayah" },
      { label: "Lectures and podcasts", desc: "Talks worth your time.", href: "/lectures" },
    ],
  },
  {
    id: "help",
    title: "Help and support",
    blurb: "The practical things, and who to ask.",
    items: [
      { label: "Start here", desc: "New to Aston, new to Islam, or just curious.", href: "/start-here" },
      { label: "Careers and opportunities", desc: "Internships and graduate roles, filtered for students.", href: "/careers" },
      { label: "Zakat calculator", desc: "Work out what you owe, step by step.", href: "/zakat" },
      { label: "Share feedback", desc: "Anonymous, straight to the committee.", href: "/feedback" },
      { label: "Contact the committee", desc: "Every way to reach us.", href: "/contact" },
    ],
  },
  {
    id: "give",
    title: "Give",
    blurb: "Sadaqah, through the society.",
    items: [
      { label: "Donate", desc: "Support the society's charity work.", href: "/donate" },
      { label: "Charity initiatives", desc: "What we raise for, and who with.", href: "/charity" },
    ],
  },
];
