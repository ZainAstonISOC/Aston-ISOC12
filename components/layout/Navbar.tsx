"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { navItems } from "@/lib/nav";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(13,16,37,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(22px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(201,162,39,0.1)" : "none",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between" style={{ height: 72 }}>

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none"
                style={{ transition: "opacity 0.2s" }}
                className="opacity-75 group-hover:opacity-100">
                <path d="M14 3C8.477 3 4 7.477 4 13s4.477 10 10 10c1.43 0 2.795-.3 4.03-.84C15.72 23.42 13.19 24 10.5 24 5.253 24 1 19.747 1 14.5S5.253 5 10.5 5c.92 0 1.81.12 2.66.35A9.95 9.95 0 0014 3z"
                  fill="#C9A227" opacity="0.9"/>
                <circle cx="18" cy="7.5" r="1.3" fill="#C9A227" opacity="0.55"/>
              </svg>
              <div className="flex items-baseline gap-1.5">
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "#fff", letterSpacing: "0.01em" }}>
                  Aston
                </span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 400, fontStyle: "italic", color: "#C9A227", letterSpacing: "0.04em" }}>
                  ISOC
                </span>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.children ? (
                    <div
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className="nav-link flex items-center gap-1.5 px-3 py-2.5"
                        style={{ color: isActive(item.href) ? "#C9A227" : undefined }}
                      >
                        {item.label}
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none"
                          style={{ transition: "transform 0.2s", transform: openDropdown === item.label ? "rotate(180deg)" : "none" }}>
                          <path d="M2 3l3 3.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                        </svg>
                      </button>

                      {openDropdown === item.label && (
                        <div
                          className="absolute top-full left-0 py-2"
                          style={{
                            marginTop: "0.5rem",
                            minWidth: 200,
                            background: "rgba(13,16,37,0.98)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(201,162,39,0.14)",
                            borderRadius: "0.875rem",
                            boxShadow: "0 28px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,162,39,0.06)",
                          }}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 text-xs font-medium tracking-wider uppercase transition-colors"
                              style={{
                                fontFamily: "DM Sans, sans-serif",
                                color: pathname === child.href ? "#C9A227" : "#A8A8B3",
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = pathname === child.href ? "#C9A227" : "#A8A8B3"; }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.href} className={`nav-link px-3 py-2.5 ${isActive(item.href) ? "active" : ""}`}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* ── CTA ── */}
            <div className="hidden lg:flex items-center gap-2.5">
              <Link href="/donate" className="btn-ghost" style={{ padding: "0.55rem 1.2rem", fontSize: "0.68rem" }}>Donate</Link>
              <Link href="/join" className="btn-gold" style={{ padding: "0.55rem 1.35rem", fontSize: "0.68rem" }}>Join ISOC</Link>
            </div>

            {/* ── Mobile burger ── */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="block w-[22px] h-[1.5px] transition-all duration-300"
                  style={{
                    background: "#C9A227",
                    transform: mobileOpen
                      ? i === 0 ? "rotate(45deg) translate(4.5px, 4.5px)"
                      : i === 2 ? "rotate(-45deg) translate(4.5px, -4.5px)"
                      : "scaleX(0)"
                      : "none",
                    opacity: mobileOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        className="fixed inset-0 z-40 lg:hidden"
        style={{ pointerEvents: mobileOpen ? "all" : "none", opacity: mobileOpen ? 1 : 0, transition: "opacity 0.3s" }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(13,16,37,0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className="absolute top-0 right-0 h-full flex flex-col"
          style={{
            width: "min(320px, 85vw)",
            background: "rgba(13,16,37,0.99)",
            borderLeft: "1px solid rgba(201,162,39,0.12)",
            transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-6"
            style={{ height: 72, borderBottom: "1px solid rgba(201,162,39,0.08)", flexShrink: 0 }}>
            <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", fontStyle: "italic", color: "#C9A227" }}>
              Navigation
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-8 h-8 transition-colors"
              style={{ color: "#6B6B80", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.5rem" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#6B6B80"; }}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between py-3 text-sm font-medium tracking-wider uppercase transition-colors"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      color: isActive(item.href) ? "#C9A227" : "#A8A8B3",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    {item.label}
                    {isActive(item.href) && <span style={{ color: "#C9A227", fontSize: "0.6rem" }}>●</span>}
                  </Link>
                  {item.children && (
                    <div className="pl-4 mt-1 mb-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-1.5 text-xs tracking-widest uppercase transition-colors"
                          style={{ fontFamily: "DM Sans, sans-serif", color: "#6B6B80" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#C9A227"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#6B6B80"; }}
                        >
                          → {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* CTA buttons */}
          <div className="px-6 pb-8 space-y-3" style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem", marginTop: "0.5rem" }}>
            <Link href="/donate" className="btn-ghost w-full justify-center" style={{ fontSize: "0.7rem" }}>Donate</Link>
            <Link href="/join" className="btn-gold w-full justify-center" style={{ fontSize: "0.7rem" }}>Join ISOC — £5</Link>
          </div>
        </div>
      </div>
    </>
  );
}
