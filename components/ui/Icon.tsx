import type { SVGProps } from "react";

/**
 * ICON SET
 * ---------------------------------------------------------------
 * One stroke weight, one grid, one corner treatment — matching the line art
 * already used in the homepage "What we offer" section. Pages previously used
 * emoji here, which rendered differently on every platform and read as a
 * template. Everything draws in `currentColor` so it inherits gold, muted or
 * accent colours from whatever contains it.
 */

export type IconName =
  | "book"
  | "briefcase"
  | "calendar"
  | "card"
  | "chart"
  | "clock"
  | "coffee"
  | "compass"
  | "football"
  | "globe"
  | "hands"
  | "handshake"
  | "heart"
  | "instagram"
  | "mic"
  | "moon"
  | "mosque"
  | "phone"
  | "pin"
  | "repeat"
  | "seedling"
  | "sparkle"
  | "trophy"
  | "users";

const PATHS: Record<IconName, React.ReactNode> = {
  book: (
    <>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v16H5.5A1.5 1.5 0 0 0 4 20.5Z" />
      <path d="M4 20.5A1.5 1.5 0 0 1 5.5 19H19v2H5.5A1.5 1.5 0 0 1 4 20.5Z" />
      <path d="M9 7.5h6M9 11h4" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M2.5 12.5h19" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9.5h19M6 15h4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" />
      <path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17M7 2.5c0 1-1 1.5-1 2.5M11 2.5c0 1-1 1.5-1 2.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5.5-5.5 2 2-5.5Z" />
    </>
  ),
  football: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 7.5 3.8 2.8-1.5 4.5H9.7l-1.5-4.5Z" />
      <path d="M12 3v4.5M4.2 9.8l4 .5M6.9 19l2.8-4M17.1 19l-2.8-4M19.8 9.8l-4 .5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
    </>
  ),
  hands: (
    <>
      <path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4.8a1.5 1.5 0 0 1 3 0V11" />
      <path d="M14 11V6.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7 7 7 0 0 1-7-7v-2a1.5 1.5 0 0 1 3 0" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17-2.5 2.5a1.8 1.8 0 0 1-2.5-2.5" />
      <path d="M2.5 12 7 7.5a2 2 0 0 1 2.6-.2L12 9l2.4-1.7a2 2 0 0 1 2.6.2L21.5 12" />
      <path d="m9 14 2.5 2.5M12 11.5l4 4M6 17l-3.5-3.5M21.5 12l-3.5 3.5" />
    </>
  ),
  heart: (
    <>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" />
    </>
  ),
  moon: (
    <>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </>
  ),
  mosque: (
    <>
      <path d="M12 2.5c2.5 2 4 3.9 4 6.1 0 1.2-.6 2.2-1.5 2.9h-5C8.6 10.8 8 9.8 8 8.6c0-2.2 1.5-4.1 4-6.1Z" />
      <path d="M4.5 21v-7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7M2.5 21h19M9.5 21v-4a2.5 2.5 0 0 1 5 0v4" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.3 7-10.5a7 7 0 1 0-14 0C5 15.7 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.6" />
    </>
  ),
  repeat: (
    <>
      <path d="M17 2.5 20.5 6 17 9.5" />
      <path d="M20.5 6H7A3.5 3.5 0 0 0 3.5 9.5v1M7 21.5 3.5 18 7 14.5" />
      <path d="M3.5 18H17a3.5 3.5 0 0 0 3.5-3.5v-1" />
    </>
  ),
  seedling: (
    <>
      <path d="M12 21v-7" />
      <path d="M12 14c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6ZM12 14c0-2.8-2.2-5-5-5 0 2.8 2.2 5 5 5Z" />
      <path d="M8 21h8" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 2.2 5.3L19.5 10l-5.3 1.7L12 17l-2.2-5.3L4.5 10l5.3-1.7Z" />
      <path d="M18.5 16.5 19 18l1.5.5-1.5.5-.5 1.5-.5-1.5L16.5 18l1.5-.5Z" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path d="M7 5.5H4.5v1A3.5 3.5 0 0 0 8 10M17 5.5h2.5v1A3.5 3.5 0 0 1 16 10M12 14v3.5M8.5 20.5h7l-.7-3h-5.6Z" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number | string;
}

export default function Icon({ name, size = 24, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
