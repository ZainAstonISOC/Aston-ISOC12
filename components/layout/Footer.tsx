import Link from "next/link";
import { footerLinks, SOCIAL, WHATSAPP } from "@/lib/nav";

export default function Footer() {
  return (
    <footer style={{ background: "#08091A", borderTop: "1px solid rgba(201,162,39,0.1)" }}>
      {/* Quote band */}
      <div className="text-center py-12" style={{ borderBottom: "1px solid rgba(201,162,39,0.07)" }}>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.05rem", fontStyle: "italic", color: "#C9A227", opacity: 0.55 }}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p className="mt-2 text-xs tracking-widest uppercase" style={{ color: "#6B6B80", fontFamily: "'DM Sans', sans-serif" }}>
          In the name of Allah, the Most Gracious, the Most Merciful
        </p>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <path d="M14 3C8.477 3 4 7.477 4 13s4.477 10 10 10c1.43 0 2.795-.3 4.03-.84C15.72 23.42 13.19 24 10.5 24 5.253 24 1 19.747 1 14.5S5.253 5 10.5 5c.92 0 1.81.12 2.66.35A9.95 9.95 0 0014 3z"
                  fill="#C9A227" opacity="0.8"/>
              </svg>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.15rem", fontWeight: 600, color: "#fff" }}>
                Aston <em style={{ color: "#C9A227", fontWeight: 400 }}>ISOC</em>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B6B80", fontFamily: "'DM Sans', sans-serif" }}>
              Aston University Islamic Society.<br />Faith. Community. Excellence.
            </p>
            {/* Social icons — Instagram + WhatsApp + Linktree only */}
            <div className="flex gap-2">
              {/* Instagram */}
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href={WHATSAPP.community} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="footer-social-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* Linktree */}
              <a href={SOCIAL.linktree} target="_blank" rel="noopener noreferrer" aria-label="Linktree" className="footer-social-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.511 5.853l4.005-4.117 2.2 2.136-4.192 4.007h5.989v3.104h-6.016l4.226 4.008-2.2 2.165-5.528-5.38-5.498 5.38-2.199-2.165 4.226-4.008H2.487V7.879h5.988L4.283 3.872l2.2-2.136 4.005 4.117V0h3.023v5.853zm-3.023 9.285h3.023V24h-3.023v-8.862z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="mb-5 text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#C9A227", fontFamily: "'DM Sans', sans-serif" }}>
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer"
                        className="text-xs tracking-wide transition-colors hover:text-white"
                        style={{ color: "#6B6B80", fontFamily: "'DM Sans', sans-serif" }}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}
                        className="text-xs tracking-wide transition-colors hover:text-white"
                        style={{ color: "#6B6B80", fontFamily: "'DM Sans', sans-serif" }}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Quranic verse */}
      <div className="text-center py-6" style={{ borderTop: "1px solid rgba(201,162,39,0.07)", borderBottom: "1px solid rgba(201,162,39,0.07)" }}>
        <p className="italic text-sm" style={{ color: "#6B6B80", fontFamily: "'Playfair Display', Georgia, serif" }}>
          &ldquo;And hold firmly to the rope of Allah all together and do not become divided.&rdquo;
        </p>
        <p className="mt-1 text-xs tracking-widest uppercase" style={{ color: "#4B4B60", fontFamily: "'DM Sans', sans-serif" }}>
          Surah Al-Imran · 3:103
        </p>
      </div>

      <div className="container py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs" style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif" }}>
          © {new Date().getFullYear()} Aston University Islamic Society. All rights reserved.
        </p>
        <div className="flex gap-5">
          {[{ label: "Start Here", href: "/start-here" }, { label: "Contact", href: "/contact" }, { label: "Join", href: "/join" }].map((l) => (
            <Link key={l.href} href={l.href}
              className="text-xs transition-colors hover:text-white"
              style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .footer-social-icon {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; color: #6B6B80;
          border: 1px solid rgba(201,162,39,0.14); border-radius: 0.5rem;
          transition: color 0.2s, border-color 0.2s, transform 0.2s;
        }
        .footer-social-icon:hover {
          color: #C9A227; border-color: rgba(201,162,39,0.45); transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
}
