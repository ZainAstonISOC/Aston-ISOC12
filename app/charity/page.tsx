import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader, CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { donationCampaigns } from "@/data/donations";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = { title: "Charity Initiatives" };
const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function CharityPage() {
  const active = donationCampaigns.filter(c => c.status === "active");
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Charity Initiatives" }]} />
      <PageHeader label="Sadaqah" title="Charity Initiatives" subtitle="Sadaqah is at the heart of who we are. Every year, Aston ISOC raises thousands for local and international causes." />

      <Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { value: "£200k+", label: "Raised 2024/25" },
            { value: `${active.length}`, label: "Active Campaigns" },
            { value: "6+", label: "Partner Orgs" },
            { value: "100%", label: "Transparent" },
          ].map(s => (
            <div key={s.label} className="card text-center p-6">
              <p style={{ fontFamily: PF, fontSize: "2.5rem", fontWeight: 300, color: "#d8af72", lineHeight: 1 }}>{s.value}</p>
              <p className="mt-2 text-xs tracking-widest uppercase" style={{ color: "var(--muted-2)", fontFamily: DM }}>{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <p className="eyebrow mb-6">Active Campaigns</p>
        <div className="space-y-4 mb-14">
          {active.map(c => (
            <div key={c.id} className="p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
              style={{ background: "linear-gradient(135deg, rgba(216,175,114,0.05) 0%, rgba(13,30,48,0.9) 100%)", border: "1px solid rgba(216,175,114,0.2)", borderRadius: "1rem" }}>
              <div className="flex-1">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="badge badge-green">Active</span>
                  {c.isFeatured && <span className="badge badge-gold">Featured</span>}
                </div>
                <h3 style={{ fontFamily: PF, fontSize: "1.4rem", fontWeight: 400, color: "#fff", marginBottom: "0.5rem" }}>{c.name}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)", fontFamily: DM }}>{c.description}</p>
                {c.organisation && <p className="text-xs mt-2" style={{ color: "var(--muted-2)", fontFamily: DM }}>Via {c.organisation}</p>}
              </div>
              <a href={c.donationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold shrink-0">Donate →</a>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <p className="eyebrow mb-6">Charity Partners</p>
        <div className="grid sm:grid-cols-3 gap-3 mb-14">
          {[
            { name: "National Zakat Foundation", desc: "UK Zakat collection & distribution", url: "https://nzf.org.uk" },
            { name: "Human Appeal",              desc: "Emergency relief and development",    url: "https://humanappeal.org.uk" },
            { name: "One Ummah",                 desc: "Global Muslim community support",     url: "https://oneummah.org.uk" },
            { name: "Global Rahma Foundation",   desc: "Humanitarian aid and development",    url: "https://grfuk.org" },
            { name: "Birmingham Food Bank",      desc: "Local emergency food parcels",        url: "https://birmingham.foodbank.org.uk" },
            { name: "GoFundMe",                  desc: "Direct community fundraising",         url: "https://www.gofundme.com" },
          ].map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="card link block p-4">
              <p className="text-sm font-medium" style={{ color: "#fff", fontFamily: DM }}>{p.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-2)", fontFamily: DM }}>{p.desc}</p>
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <CtaBanner title="Make a Donation Today" description="Every pound goes directly to verified campaigns. 100% transparent." primaryLabel="Donate Now" primaryHref="/donate" secondaryLabel="Contact Charity Officer" secondaryHref="/contact" />
      </Reveal>
    </PageShell>
  );
}
