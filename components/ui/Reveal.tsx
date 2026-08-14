"use client";
import { useEffect, useRef } from "react";

export default function Reveal({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("visible");
      return;
    }

    // No IntersectionObserver (very old browsers, some in-app webviews) must
    // never mean invisible content.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      {
        // threshold MUST stay at 0. A fractional threshold is a fraction of the
        // ELEMENT's area, not the viewport's, so anything taller than ~10
        // viewports can never satisfy 0.1 and stays hidden forever. That is
        // exactly what happened to the careers board once it grew past about
        // 30 rows. rootMargin gives back the small delay a threshold implied.
        threshold: 0,
        rootMargin: "0px 0px -40px 0px",
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
