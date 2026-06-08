"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { navItems } from "@/lib/nav";

const LINK_STYLE_BASE = {
  display: "flex" as const,
  alignItems: "center" as const,
  padding: "0.5rem 0.85rem",
  borderRadius: "999px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.84rem",
  fontWeight: 500,
  textDecoration: "none",
  whiteSpace: "nowrap" as const,
  transition: "color 0.18s, background 0.18s",
  border: "none",
  cursor: "pointer",
  background: "transparent",
};

export default function Navbar() {
  const pathname       = usePathname();
  const [open, setOpen]        = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile]     = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setMobile(false); setOpen(null); }, [pathname]);
  useEffect(() => { document.body.style.overflow = mobile ? "hidden" : ""; }, [mobile]);

  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header style={{ position: "fixed", top: "1rem", left: 0, right: 0, zIndex: 50 }}>
        <div className="container">
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            height: 60, padding: "0 0.65rem 0 1.3rem",
            borderRadius: "999px",
            background: scrolled ? "rgba(13,9,28,0.95)" : "rgba(19,13,40,0.72)",
            border: `1px solid ${scrolled ? "rgba(216,175,114,0.26)" : "rgba(216,175,114,0.14)"}`,
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            boxShadow: scrolled ? "0 8px 32px -12px rgba(0,0,0,0.8)" : "none",
            transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
          }}>

            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0, textDecoration: "none" }}>
              <svg width="33" height="33" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="19" stroke="#d8af72" strokeOpacity="0.45"/>
                <polygon points="33,20 20,33 7,20 20,7" stroke="#d8af72" strokeWidth="1.4"/>
                <polygon points="29.2,29.2 10.8,29.2 10.8,10.8 29.2,10.8" stroke="#d8af72" strokeWidth="1.4"/>
                <circle cx="20" cy="20" r="3.4" fill="#d8af72"/>
              </svg>
              <div style={{ lineHeight: 1.15 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 600, color: "#fff", display: "block" }}>
                  Aston ISOC
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#d8af72", display: "block" }}>
                  Islamic Society
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: 0 }} className="hidden lg:flex">
              {navItems.map((item) => (
                <div key={item.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => item.children ? setOpen(item.label) : undefined}
                  onMouseLeave={() => item.children ? setOpen(null) : undefined}
                >
                  {item.children ? (
                    <>
                      {/* Trigger button */}
                      <button
                        style={{
                          ...LINK_STYLE_BASE,
                          gap: "0.4rem",
                          color: active(item.href) ? "#d8af72" : open === item.label ? "#fff" : "var(--muted)",
                          background: open === item.label ? "rgba(216,175,114,0.09)" : "transparent",
                        }}
                      >
                        {item.label}
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
                          style={{ transition: "transform 0.22s", transform: open === item.label ? "rotate(180deg)" : "none", flexShrink: 0 }}>
                          <path d="M2.5 4L6 7.5L9.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                        </svg>
                      </button>

                      {/* Invisible bridge — fills gap between trigger and panel so cursor doesn't leave the hover zone */}
                      {open === item.label && (
                        <div style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "100%",
                          minWidth: 220,
                          height: "0.75rem",
                          background: "transparent",
                          zIndex: 99,
                        }} />
                      )}

                      {/* Dropdown panel */}
                      {open === item.label && (
                        <div style={{
                          position: "absolute",
                          top: "calc(100% + 0.75rem)",
                          left: "50%",
                          transform: "translateX(-50%)",
                          minWidth: 210,
                          background: "rgba(11,8,26,0.99)",
                          border: "1px solid rgba(216,175,114,0.22)",
                          borderRadius: "18px",
                          padding: "0.5rem",
                          boxShadow: "0 24px 60px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(216,175,114,0.06)",
                          backdropFilter: "blur(24px)",
                          WebkitBackdropFilter: "blur(24px)",
                          zIndex: 100,
                        }}>
                          {item.children.map((child) => (
                            <Link key={child.href} href={child.href}
                              style={{
                                display: "block",
                                padding: "0.65rem 1rem",
                                borderRadius: "12px",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "0.86rem",
                                fontWeight: pathname === child.href ? 600 : 400,
                                color: pathname === child.href ? "#d8af72" : "var(--muted)",
                                textDecoration: "none",
                                transition: "background 0.15s, color 0.15s",
                                whiteSpace: "nowrap",
                              }}
                              onMouseEnter={e => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.background = "rgba(216,175,114,0.09)";
                                el.style.color = "#fff";
                              }}
                              onMouseLeave={e => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.background = "transparent";
                                el.style.color = pathname === child.href ? "#d8af72" : "var(--muted)";
                              }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={item.href}
                      style={{
                        ...LINK_STYLE_BASE,
                        color: active(item.href) ? "#d8af72" : "var(--muted)",
                        background: active(item.href) ? "rgba(216,175,114,0.09)" : "transparent",
                      }}
                      onMouseEnter={e => {
                        if (!active(item.href)) {
                          (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!active(item.href)) {
                          (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CTAs */}
            <div className="hidden lg:flex" style={{ alignItems: "center", gap: "0.45rem", flexShrink: 0 }}>
              <Link href="/donate"
                style={{
                  ...LINK_STYLE_BASE,
                  color: "var(--muted)",
                  border: "1px solid rgba(216,175,114,0.22)",
                  padding: "0.5rem 1.1rem",
                  fontSize: "0.82rem",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color="#d8af72"; el.style.borderColor="rgba(216,175,114,0.5)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color="var(--muted)"; el.style.borderColor="rgba(216,175,114,0.22)"; }}
              >
                Donate
              </Link>
              <Link href="/join" className="btn btn-gold"
                style={{ padding: "0.5rem 1.15rem", fontSize: "0.82rem", borderRadius: "999px" }}>
                Join ISOC
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobile(!mobile)}
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              className="lg:hidden"
              style={{
                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                width: 40, height: 40, gap: 5,
                borderRadius: "12px",
                border: "1px solid rgba(216,175,114,0.2)",
                background: mobile ? "rgba(216,175,114,0.1)" : "transparent",
                cursor: "pointer", transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              {[0,1,2].map(i => (
                <span key={i} style={{
                  display: "block", width: 20, height: 1.5, borderRadius: 2,
                  background: "#d8af72", transition: "transform 0.3s, opacity 0.3s",
                  transform: mobile
                    ? i===0 ? "rotate(45deg) translate(4.5px,4.5px)"
                      : i===2 ? "rotate(-45deg) translate(4.5px,-4.5px)" : "scaleX(0)"
                    : "none",
                  opacity: mobile && i===1 ? 0 : 1,
                }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div onClick={() => setMobile(false)} style={{
        position: "fixed", inset: 0, zIndex: 40,
        background: "rgba(9,6,20,0.8)", backdropFilter: "blur(8px)",
        opacity: mobile ? 1 : 0, pointerEvents: mobile ? "all" : "none",
        transition: "opacity 0.3s",
      }} />

      {/* Mobile drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0,
        height: "100dvh", width: "min(320px, 88vw)",
        zIndex: 50, background: "rgba(11,8,26,0.99)",
        borderLeft: "1px solid rgba(216,175,114,0.12)",
        display: "flex", flexDirection: "column",
        transform: mobile ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        overflowY: "auto",
      }}>
        {/* Drawer header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.25rem", height: 68,
          borderBottom: "1px solid rgba(216,175,114,0.1)", flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontStyle: "italic", color: "#d8af72" }}>
            Navigation
          </span>
          <button onClick={() => setMobile(false)} aria-label="Close"
            style={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", color: "var(--muted-2)", cursor: "pointer", background: "transparent", fontSize: "0.9rem" }}>
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {navItems.map(item => (
            <div key={item.label}>
              <Link href={item.href} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.75rem 0.85rem", borderRadius: "12px",
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.92rem",
                fontWeight: active(item.href) ? 600 : 400,
                color: active(item.href) ? "#d8af72" : "var(--text)",
                background: active(item.href) ? "rgba(216,175,114,0.08)" : "transparent",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}>
                {item.label}
                {active(item.href) && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d8af72" }} />}
              </Link>
              {item.children && (
                <div style={{ paddingLeft: "1rem", marginTop: "0.1rem", marginBottom: "0.3rem", display: "flex", flexDirection: "column", gap: "0.05rem" }}>
                  {item.children.map(child => (
                    <Link key={child.href} href={child.href} style={{
                      display: "block", padding: "0.45rem 0.85rem", borderRadius: "10px",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
                      color: pathname === child.href ? "#d8af72" : "var(--muted-2)",
                      textDecoration: "none",
                    }}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom CTAs */}
        <div style={{ padding: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "0.6rem", flexShrink: 0 }}>
          <Link href="/donate" style={{ display: "block", textAlign: "center", padding: "0.8rem", borderRadius: "999px", border: "1px solid rgba(216,175,114,0.22)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 500, color: "var(--muted)", textDecoration: "none" }}>
            Donate
          </Link>
          <Link href="/join" className="btn btn-gold" style={{ textAlign: "center", borderRadius: "999px", padding: "0.8rem", fontSize: "0.85rem" }}>
            Join ISOC — £5
          </Link>
        </div>
      </div>
    </>
  );
}
