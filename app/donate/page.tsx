import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import DonationWidget from "@/components/ui/DonationWidget";
import { getActiveCampaigns } from "@/data/donations";
import { SOCIAL, DONATIONS } from "@/lib/social";

export const metadata: Metadata = { title: "Donate", description: "Support Aston ISOC one-time, weekly Jumu'ah giving, or monthly supporter programme." };

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const OTHER_WAYS = [
  { title: "Zakat & Sadaqah",  desc: "We work with NZF to ensure correct Zakat distribution." },
  { title: "Gift Aid",         desc: "UK taxpayers can increase their donation by 25% at no extra cost." },
  { title: "Sponsor an Event", desc: "Partner with ISOC by sponsoring a specific event or initiative." },
  { title: "Legacy Giving",    desc: "Consider including Aston ISOC in charitable giving plans." },
];

export default function DonatePage() {
  const active = getActiveCampaigns();
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Donate" }]} />
      <PageHeader label="Support Aston ISOC" title="Give with Intention" subtitle="Every contribution however small helps sustain a thriving Muslim community at Aston University." />

      <Reveal><DonationWidget /></Reveal>

      <div className="section-divider" />

      {active.length > 0 && (
        <>
          <Reveal>
            <p className="eyebrow mb-4">Active Campaigns</p>
            <h2 style={{ fontFamily: PF, fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>Current Fundraisers</h2>
            <span className="gold-rule" />
          </Reveal>
          <Reveal delay={80}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
              {active.map(c => (
                <div key={c.id} className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {c.isFeatured && <span className="badge badge-gold" style={{ marginBottom: "0.75rem", display: "inline-block" }}>Featured</span>}
                    <h3 style={{ fontFamily: PF, fontSize: "1.2rem", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>{c.name}</h3>
                    <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7 }}>{c.description}</p>
                    {c.organisation && <p style={{ fontFamily: DM, fontSize: "0.72rem", color: "var(--muted-2)", marginTop: "0.5rem" }}>Via {c.organisation}</p>}
                  </div>
                  <a href={c.donationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ flexShrink: 0 }}>Donate →</a>
                </div>
              ))}
            </div>
          </Reveal>
          <div className="section-divider" />
        </>
      )}

      <Reveal>
        <p className="eyebrow mb-4">Other Ways to Give</p>
        <h2 style={{ fontFamily: PF, fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>More Ways to Support</h2>
        <span className="gold-rule" />
      </Reveal>
      <Reveal delay={80}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
          {OTHER_WAYS.map(item => (
            <div key={item.title} className="card">
              <p style={{ fontFamily: DM, fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>{item.title}</p>
              <p style={{ fontFamily: DM, fontSize: "0.83rem", color: "var(--muted)", lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "var(--muted-2)", textAlign: "center" }}>
          Questions? <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#d8af72" }}>Message @astonisoc on Instagram</a>
        </p>
      </Reveal>
    </PageShell>
  );
}
