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
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className="fixed left-0 right-0 z-50"
        style={{ top: "1rem", transition: "top 0.3s" }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.7rem 0.7rem 0.7rem 1.3rem",
              borderRadius: "999px",
              background: scrolled ? "rgba(15,10,33,0.92)" : "rgba(19,13,40,0.65)",
              border: scrolled ? "1px solid rgba(216,175,114,0.22)" : "1px solid rgba(216,175,114,0.12)",
              backdropFilter: "blur(18px) saturate(140%)",
              WebkitBackdropFilter: "blur(18px) saturate(140%)",
              boxShadow: scrolled ? "0 10px 30px -16px rgba(0,0,0,0.6)" : "none",
              transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5" aria-label="Aston ISOC home">
              {/* Geometric brand mark from reference */}
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="19" stroke="#d8af72" strokeOpacity="0.4"/>
                <polygon points="33,20 20,33 7,20 20,7" stroke="#d8af72" strokeWidth="1.4"/>
                <polygon points="29.2,29.2 10.8,29.2 10.8,10.8 29.2,10.8" stroke="#d8af72" strokeWidth="1.4"/>
                <circle cx="20" cy="20" r="3.4" fill="#d8af72"/>
              </svg>
              <div style={{ lineHeight: 1.1 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600, color: "#fff", display: "block" }}>Aston ISOC</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#d8af72" }}>Islamic Society</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.children ? (
                    <div onMouseEnter={() => setOpenDropdown(item.label)} onMouseLeave={() => setOpenDropdown(null)}>
                      <button
                        className="nav-link flex items-center gap-1.5"
                        style={{ color: isActive(item.href) ? "#d8af72" : undefined }}
                      >
                        {item.label}
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none"
                          style={{ transition: "transform 0.2s", transform: openDropdown === item.label ? "rotate(180deg)" : "none" }}>
                          <path d="M2 3l3 3.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                        </svg>
                      </button>
                      {openDropdown === item.label && (
                        <div
                          className="absolute left-0 py-2"
                          style={{
                            top: "calc(100% + 0.6rem)",
                            minWidth: 200,
                            background: "rgba(15,10,33,0.97)",
                            border: "1px solid rgba(216,175,114,0.18)",
                            borderRadius: "18px",
                            backdropFilter: "blur(18px)",
                            boxShadow: "0 24px 60px -24px rgba(0,0,0,0.7)",
                          }}
                        >
                          {item.children.map((child) => (
                            <Link key={child.href} href={child.href}
                              className="block px-4 py-2.5 transition-colors hover:text-yellow-300"
                              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: pathname === child.href ? "#d8af72" : "#b7b0c9" }}>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.href}
                      className="nav-link"
                      style={{ color: isActive(item.href) ? "#d8af72" : undefined }}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/donate" className="btn btn-ghost" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}>Donate</Link>
              <Link href="/join" className="btn btn-gold" style={{ padding: "0.6rem 1.35rem", fontSize: "0.85rem" }}>Join ISOC</Link>
            </div>

            {/* Mobile burger */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ borderRadius: "12px", border: "1px solid rgba(216,175,114,0.2)" }}
            >
              {[0,1,2].map((i) => (
                <span key={i} className="block w-5 h-px transition-all duration-300"
                  style={{
                    background: "#d8af72",
                    transform: mobileOpen
                      ? i===0 ? "rotate(45deg) translate(4.5px,4.5px)"
                        : i===2 ? "rotate(-45deg) translate(4.5px,-4.5px)" : "scaleX(0)"
                      : "none",
                    opacity: mobileOpen && i===1 ? 0 : 1,
                  }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(19,13,40,0.7)", backdropFilter: "blur(8px)" }} />
        </div>
      )}
      <div
        className="fixed top-0 right-0 h-full z-50 lg:hidden flex flex-col"
        style={{
          width: "min(320px, 85vw)",
          background: "rgba(15,10,33,0.99)",
          borderLeft: "1px solid rgba(216,175,114,0.15)",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="flex items-center justify-between px-6" style={{ height: 72, borderBottom: "1px solid rgba(216,175,114,0.1)", flexShrink: 0 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontStyle: "italic", color: "#d8af72" }}>Menu</span>
          <button onClick={() => setMobileOpen(false)}
            style={{ color: "#8d86a3", width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", display: "grid", placeItems: "center" }}>
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-8 space-y-0.5">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link href={item.href}
                className="flex items-center justify-between py-3 px-3 rounded-xl text-sm font-medium transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: isActive(item.href) ? "#d8af72" : "#b7b0c9",
                  background: isActive(item.href) ? "rgba(216,175,114,0.08)" : "transparent",
                }}>
                {item.label}
                {isActive(item.href) && <span style={{ color: "#d8af72", fontSize: "0.5rem" }}>●</span>}
              </Link>
              {item.children && (
                <div className="ml-4 mt-0.5 mb-1 space-y-0.5">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href}
                      className="block py-2 px-3 text-xs rounded-lg transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B6B80" }}>
                      → {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="px-5 pb-8 space-y-2.5" style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.25rem" }}>
          <Link href="/donate" className="btn btn-ghost w-full justify-center" style={{ fontSize: "0.85rem" }}>Donate</Link>
          <Link href="/join" className="btn btn-gold w-full justify-center" style={{ fontSize: "0.85rem" }}>Join ISOC — £5</Link>
        </div>
      </div>
    </>
  );
}
