import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { linkGroups } from "@/data/links";
import checked from "@/data/links-checked.json";
import { formatEventDate } from "@/lib/events/time";
import { igDmLink } from "@/lib/social";

export const metadata: Metadata = {
  title: "All our links",
  description: "Membership, WhatsApp, prayer times, the Qur'an reader and everything else from Aston ISOC, in one place.",
  alternates: { canonical: "/links" },
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function LinksPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Links" }]} />
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <p className="eyebrow">Links</p>
        <h1 style={{ fontFamily: PF, fontWeight: 600 }}>All our links</h1>
        <div className="gold-rule" />
        <p className="lede" style={{ color: "var(--muted)", fontFamily: DM }}>
          Membership, group chats, prayer times and the rest. Bookmark this instead of hunting through story highlights.
        </p>
        <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", marginTop: "0.9rem" }}>
          Every link opened and checked on{" "}
          <span style={{ color: "var(--gold)" }}>{formatEventDate(checked.checked, { day: "numeric", month: "long", year: "numeric" })}</span>.
        </p>

        <nav aria-label="Sections" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "1.75rem 0 0.5rem" }}>
          {linkGroups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="pill">{g.title}</a>
          ))}
        </nav>

        {linkGroups.map((g) => (
          <section key={g.id} id={g.id} style={{ marginTop: "2.5rem", scrollMarginTop: 110 }} aria-labelledby={`${g.id}-h`}>
            <h2 id={`${g.id}-h`} style={{ fontFamily: PF, fontSize: "clamp(1.35rem,3vw,1.7rem)" }}>{g.title}</h2>
            <p style={{ fontFamily: DM, fontSize: "0.88rem", color: "var(--muted-2)", marginBottom: "1rem" }}>{g.blurb}</p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {g.items.map((item) => {
                const external = !item.href.startsWith("/");
                const inner = (
                  <>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontWeight: 600, color: "var(--text)" }}>{item.label}</span>
                      <span style={{ display: "block", fontSize: "0.84rem", color: "var(--muted-2)" }}>{item.desc}</span>
                    </span>
                    <span aria-hidden="true" style={{ color: "var(--gold)", flexShrink: 0 }}>{external ? "↗" : "→"}</span>
                  </>
                );
                const style = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1rem 1.2rem", minHeight: 64, fontFamily: DM, textDecoration: "none" } as const;
                return (
                  <li key={item.label}>
                    {external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="surah-card" style={style}>{inner}</a>
                    ) : (
                      <Link href={item.href} className="surah-card" style={style}>{inner}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <div className="card" style={{ marginTop: "3rem", fontFamily: DM }}>
          <h2 style={{ fontFamily: PF, fontSize: "1.3rem" }}>Something missing, or a link gone dead?</h2>
          <p style={{ color: "var(--muted)", marginTop: "0.4rem", lineHeight: 1.7 }}>
            Tell us and it gets fixed. This page is meant to be the one you can trust.
          </p>
          <a href={igDmLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold" style={{ marginTop: "1rem" }}>
            Message us on Instagram
          </a>
        </div>
      </div>
    </PageShell>
  );
}
