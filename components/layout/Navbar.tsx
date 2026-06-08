"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { navItems } from "@/lib/nav";

export default function Navbar() {
  const pathname = usePathname();

  // Desktop state
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [scrolled,  setScrolled]  = useState(false);

  // Mobile state — fully independent
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll listener
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = mobileOpen ? "hidden" : "";
    }
    return () => { if (typeof document !== "undefined") document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = useCallback((href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href),
  [pathname]);

  return (
    <>
      {/* ════════════════════════════════════════════════════
          HEADER (shared pill container)
          ════════════════════════════════════════════════════ */}
      <header style={{ position: "fixed", top: "1rem", left: 0, right: 0, zIndex: 50 }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 62,
            padding: "0 0.7rem 0 1.3rem",
            borderRadius: "999px",
            background: scrolled ? "rgba(13,9,28,0.95)" : "rgba(19,13,40,0.72)",
            border: `1px solid ${scrolled ? "rgba(216,175,114,0.26)" : "rgba(216,175,114,0.14)"}`,
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            boxShadow: scrolled ? "0 8px 32px -12px rgba(0,0,0,0.8)" : "none",
            transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
          }}>

            {/* ── Logo ── */}
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

            {/* ════════════════════════════════════════════
                DESKTOP NAV — hidden on mobile (lg:flex)
                ════════════════════════════════════════════ */}
            <nav
              className="hidden lg:flex"
              style={{ alignItems: "center", gap: 0 }}
            >
              {navItems.map(item => (
                <div
                  key={item.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => item.children && setDropdown(item.label)}
                  onMouseLeave={() => item.children && setDropdown(null)}
                >
                  {item.children ? (
                    <>
                      {/* Trigger */}
                      <button style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.5rem 0.85rem", borderRadius: "999px",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "0.84rem", fontWeight: 500,
                        color: isActive(item.href) ? "#d8af72" : dropdown === item.label ? "#fff" : "var(--muted)",
                        background: dropdown === item.label ? "rgba(216,175,114,0.09)" : "transparent",
                        border: "none", cursor: "pointer", whiteSpace: "nowrap",
                        transition: "color 0.18s, background 0.18s",
                      }}>
                        {item.label}
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none"
                          style={{ transition: "transform 0.22s", transform: dropdown === item.label ? "rotate(180deg)" : "none", flexShrink: 0, opacity: 0.65 }}>
                          <path d="M2.5 4L6 7.5L9.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
                        </svg>
                      </button>

                      {/* Hover bridge — invisible, fills gap between trigger and panel */}
                      {dropdown === item.label && (
                        <div style={{
                          position: "absolute", top: "100%", left: "50%",
                          transform: "translateX(-50%)",
                          width: "120%", height: "0.8rem",
                          background: "transparent", zIndex: 98,
                        }} />
                      )}

                      {/* Dropdown panel */}
                      {dropdown === item.label && (
                        <div
                          onMouseEnter={() => setDropdown(item.label)}
                          onMouseLeave={() => setDropdown(null)}
                          style={{
                            position: "absolute",
                            top: "calc(100% + 0.8rem)",
                            left: "50%",
                            transform: "translateX(-50%)",
                            minWidth: 210,
                            background: "rgba(11,8,26,0.99)",
                            border: "1px solid rgba(216,175,114,0.22)",
                            borderRadius: "18px",
                            padding: "0.5rem",
                            boxShadow: "0 24px 60px -12px rgba(0,0,0,0.9)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                            zIndex: 100,
                          }}
                        >
                          {item.children.map(child => (
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
                                whiteSpace: "nowrap",
                                transition: "background 0.15s, color 0.15s",
                              }}
                              onMouseEnter={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.background = "rgba(216,175,114,0.09)";
                                el.style.color = "#fff";
                              }}
                              onMouseLeave={e => {
                                const el = e.currentTarget as HTMLElement;
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
                        display: "block",
                        padding: "0.5rem 0.85rem",
                        borderRadius: "999px",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.84rem",
                        fontWeight: 500,
                        color: isActive(item.href) ? "#d8af72" : "var(--muted)",
                        background: isActive(item.href) ? "rgba(216,175,114,0.09)" : "transparent",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        transition: "color 0.18s, background 0.18s",
                      }}
                      onMouseEnter={e => {
                        if (!isActive(item.href)) {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = "#fff";
                          el.style.background = "rgba(255,255,255,0.05)";
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive(item.href)) {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = "var(--muted)";
                          el.style.background = "transparent";
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* ── Desktop CTAs ── */}
            <div className="hidden lg:flex" style={{ alignItems: "center", gap: "0.45rem", flexShrink: 0 }}>
              <Link href="/donate"
                style={{
                  display: "flex", alignItems: "center",
                  padding: "0.5rem 1.1rem", borderRadius: "999px",
                  border: "1px solid rgba(216,175,114,0.22)",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 500,
                  color: "var(--muted)", textDecoration: "none",
                  transition: "color 0.18s, border-color 0.18s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color="#d8af72"; el.style.borderColor="rgba(216,175,114,0.5)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color="var(--muted)"; el.style.borderColor="rgba(216,175,114,0.22)"; }}
              >
                Donate
              </Link>
              <Link href="/join" className="btn btn-gold"
                style={{ padding: "0.5rem 1.15rem", fontSize: "0.82rem", borderRadius: "999px" }}>
                Join ISOC
              </Link>
            </div>

            {/* ════════════════════════════════════════════
                MOBILE BURGER — hidden on desktop (lg:hidden)
                ════════════════════════════════════════════ */}
            <button
              type="button"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              className="lg:hidden"
              style={{
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center",
                width: 42, height: 42, gap: 5,
                borderRadius: "12px",
                border: "1px solid rgba(216,175,114,0.22)",
                background: mobileOpen ? "rgba(216,175,114,0.1)" : "transparent",
                cursor: "pointer", transition: "background 0.2s",
                flexShrink: 0, padding: 0,
              }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block", width: 20, height: 1.5, borderRadius: 2,
                  background: "#d8af72",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                  transform: mobileOpen
                    ? i === 0 ? "rotate(45deg) translate(4.5px,4.5px)"
                      : i === 2 ? "rotate(-45deg) translate(4.5px,-4.5px)"
                      : "scaleX(0)"
                    : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>

          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════
          MOBILE NAVIGATION — completely independent from desktop
          ════════════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(9,6,20,0.82)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "all" : "none",
          transition: "opacity 0.28s ease",
        }}
      />

      {/* Drawer */}
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: "fixed",
          top: 0, right: 0,
          height: "100dvh",
          width: "min(300px, 86vw)",
          zIndex: 50,
          background: "rgba(11,8,26,0.99)",
          borderLeft: "1px solid rgba(216,175,114,0.12)",
          display: "flex",
          flexDirection: "column",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.25rem",
          height: 68, flexShrink: 0,
          borderBottom: "1px solid rgba(216,175,114,0.1)",
        }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontStyle: "italic", color: "#d8af72" }}>
            Menu
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{
              width: 36, height: 36, display: "grid", placeItems: "center",
              borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--muted)", cursor: "pointer", background: "transparent",
              fontSize: "1rem", lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          {navItems.map(item => (
            <div key={item.label}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.8rem 0.9rem",
                  borderRadius: "12px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: isActive(item.href) ? 600 : 400,
                  color: isActive(item.href) ? "#d8af72" : "#e8e3f0",
                  background: isActive(item.href) ? "rgba(216,175,114,0.1)" : "transparent",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {item.label}
                {isActive(item.href) && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d8af72", flexShrink: 0 }} />
                )}
              </Link>
              {/* Sub-links */}
              {item.children && (
                <div style={{ paddingLeft: "0.9rem", paddingTop: "0.15rem", paddingBottom: "0.35rem", display: "flex", flexDirection: "column", gap: "0.05rem" }}>
                  {item.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "block",
                        padding: "0.5rem 0.9rem",
                        borderRadius: "10px",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.85rem",
                        color: pathname === child.href ? "#d8af72" : "var(--muted)",
                        textDecoration: "none",
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA buttons */}
        <div style={{
          padding: "1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column", gap: "0.65rem",
          flexShrink: 0,
        }}>
          <Link href="/donate" onClick={() => setMobileOpen(false)} style={{
            display: "block", textAlign: "center",
            padding: "0.85rem",
            borderRadius: "999px",
            border: "1px solid rgba(216,175,114,0.25)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.88rem", fontWeight: 500,
            color: "var(--muted)", textDecoration: "none",
          }}>
            Donate
          </Link>
          <Link href="/join" onClick={() => setMobileOpen(false)} className="btn btn-gold"
            style={{ textAlign: "center", borderRadius: "999px", padding: "0.85rem", fontSize: "0.88rem" }}>
            Join ISOC — £5
          </Link>
        </div>
      </div>
    </>
  );
}
