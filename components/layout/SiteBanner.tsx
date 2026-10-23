"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteBanner as Banner } from "@/lib/content";

const KEY = "isoc_banner_dismissed";

/**
 * The committee's notice from /admin, pinned to the bottom of the screen.
 * Fixed rather than in the page flow, so showing or hiding it never shifts the
 * layout. Dismissing hides that message only: a new message shows again.
 */
export default function SiteBanner({ banner }: { banner: Banner }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let dismissed: string | null = null;
    try { dismissed = localStorage.getItem(KEY); } catch { /* no storage */ }
    // localStorage is unreadable during SSR, so this cannot be the initial state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(dismissed !== banner.text);
  }, [banner.text]);

  if (!open) return null;
  const internal = banner.linkUrl.startsWith("/");

  return (
    <aside className="site-banner" aria-label="Announcement">
      <p style={{ margin: 0 }}>
        {banner.text}
        {banner.linkUrl && (
          <>
            {" "}
            {internal
              ? <Link href={banner.linkUrl} className="site-banner__link">{banner.linkLabel || "Find out more"} →</Link>
              : <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="site-banner__link">{banner.linkLabel || "Find out more"} →</a>}
          </>
        )}
      </p>
      <button
        type="button"
        className="site-banner__close"
        aria-label="Dismiss announcement"
        onClick={() => { setOpen(false); try { localStorage.setItem(KEY, banner.text); } catch { /* ok */ } }}
      >
        ×
      </button>
    </aside>
  );
}
