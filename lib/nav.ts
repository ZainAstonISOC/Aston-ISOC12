import { SOCIAL, WHATSAPP, MEMBERSHIP } from "./social";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about", children: [
    { label: "About ISOC", href: "/about" },
    { label: "Committee Team", href: "/committee" },
    { label: "Sponsorships & Partners", href: "/sponsors" },
  ]},
  { label: "Community", href: "/freshers", children: [
    { label: "Start Here", href: "/start-here" },
    { label: "Freshers Hub", href: "/freshers" },
    { label: "Sisters' Section", href: "/sisters" },
    { label: "Brothers' Section", href: "/brothers" },
    { label: "Volunteer", href: "/volunteer" },
  ]},
  { label: "Prayer Times", href: "/prayer-times" },
  { label: "Events", href: "/events" },
  { label: "Learn", href: "/resources", children: [
    { label: "Resources", href: "/resources" },
    { label: "Lectures & Podcasts", href: "/lectures" },
    { label: "Blog & Articles", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ]},
  { label: "Give", href: "/charity", children: [
    { label: "Charity Initiatives", href: "/charity" },
    { label: "Donate", href: "/donate" },
  ]},
  { label: "Join ISOC", href: "/join" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks = {
  Community: [
    { label: "About ISOC", href: "/about" },
    { label: "Committee Team", href: "/committee" },
    { label: "Start Here", href: "/start-here" },
    { label: "Freshers Hub", href: "/freshers" },
    { label: "Sisters' Section", href: "/sisters" },
    { label: "Brothers' Section", href: "/brothers" },
    { label: "Volunteer", href: "/volunteer" },
  ],
  "Faith & Learn": [
    { label: "Prayer Times", href: "/prayer-times" },
    { label: "Lectures & Podcasts", href: "/lectures" },
    { label: "Resources", href: "/resources" },
    { label: "Blog & Articles", href: "/blog" },
  ],
  "Get Involved": [
    { label: "Events", href: "/events" },
    { label: "Join ISOC", href: "/join" },
    { label: "Charity Initiatives", href: "/charity" },
    { label: "Donate", href: "/donate" },
    { label: "Careers & Networking", href: "/careers" },
  ],
  Connect: [
    { label: "Contact Us", href: "/contact" },
    { label: "Sponsorships", href: "/sponsors" },
    { label: "Instagram", href: SOCIAL.instagram, external: true },
    { label: "YouTube", href: SOCIAL.youtube, external: true },
    { label: "Linktree", href: SOCIAL.linktree, external: true },
  ],
};

export { SOCIAL, WHATSAPP, MEMBERSHIP };
export const WHATSAPP_LINK = WHATSAPP.community;
export const INSTAGRAM_URL = SOCIAL.instagram;
export const EMAIL = "";
export const DONATION_URL = "https://linktr.ee/astonisoc";
