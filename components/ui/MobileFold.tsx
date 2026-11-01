"use client";

import { useEffect, useRef, type ReactNode } from "react";

const PHONE = "(max-width: 620px)";

/**
 * Open everywhere, folded behind a tap on phones, where long detail lists
 * turn a page into a dozen screens of scrolling. Server-renders open, so
 * desktop and no-JS readers always get the full content.
 */
export default function MobileFold({ summary, children }: { summary: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  // Uncontrolled: the browser owns open/closed after this one-time fold.
  useEffect(() => { if (ref.current && window.matchMedia(PHONE).matches) ref.current.open = false; }, []);
  return (
    <details ref={ref} className="mobile-fold" open>
      <summary>{summary}</summary>
      {children}
    </details>
  );
}
