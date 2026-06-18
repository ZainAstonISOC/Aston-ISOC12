import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Data Collection Policy",
  description: "A detailed breakdown of what data Aston ISOC collects, why, and how it is handled across forms, events, and donations.",
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const FLOWS = [
  {
    title: "Contact Forms",
    what: "Name, email address, subject, and message content.",
    why: "To respond to your enquiry and provide the information or support you request.",
    storage: "Transmitted securely and handled by a committee member. Not stored in a database on this website.",
    retention: "Deleted once your enquiry has been resolved, unless ongoing correspondence is needed.",
  },
  {
    title: "Event Registrations",
    what: "Name, email, and any event-specific details (e.g. dietary requirements for community meals).",
    why: "To manage attendance, communicate event logistics, and ensure we cater appropriately.",
    storage: "Held securely by the organising committee for the duration of the event cycle.",
    retention: "Deleted after the event concludes and any follow-up is complete.",
  },
  {
    title: "Donations",
    what: "Payment details are entered directly into Stripe. We receive only confirmation of the transaction and the amount.",
    why: "To process your donation and, where you opt in, issue a receipt.",
    storage: "All card data is held and processed by Stripe (PCI-DSS Level 1 certified). Aston ISOC never sees or stores your card number.",
    retention: "Transaction records retained as required for financial accountability to Aston Students' Union.",
  },
  {
    title: "Website Analytics",
    what: "Anonymous, aggregated information such as which pages are visited and general device type.",
    why: "To understand how the website is used and improve the experience.",
    storage: "Aggregated and anonymised. No individual is identifiable.",
    retention: "Held in aggregate only.",
  },
];

export default function DataPolicyPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Data Collection Policy" }]} />
      <PageHeader label="Legal" title="Data Collection Policy"
        subtitle="Exactly what we collect, why we collect it, and how each type of data is handled." />

      <Reveal>
        <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", marginBottom: "2.5rem" }}>
          Last updated: June 2026 · Read alongside our{" "}
          <Link href="/privacy" style={{ color: "#d8af72" }}>Privacy Policy</Link>.
        </p>
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "76ch" }}>
        {FLOWS.map((f, i) => (
          <Reveal key={f.title} delay={i * 50}>
            <div className="card">
              <h2 style={{ fontFamily: PF, fontSize: "1.25rem", fontWeight: 500, color: "#fff", marginBottom: "1.1rem" }}>{f.title}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  { k: "What we collect", v: f.what },
                  { k: "Why", v: f.why },
                  { k: "Storage", v: f.storage },
                  { k: "Retention", v: f.retention },
                ].map(row => (
                  <div key={row.k}>
                    <p style={{ fontFamily: DM, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d8af72", marginBottom: "0.2rem" }}>{row.k}</p>
                    <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7 }}>{row.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        <Reveal delay={200}>
          <div className="card" style={{ background: "rgba(216,175,114,0.05)", border: "1px solid rgba(216,175,114,0.22)" }}>
            <h2 style={{ fontFamily: PF, fontSize: "1.2rem", fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>Your Rights</h2>
            <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75 }}>
              Under UK GDPR you can request access to, correction of, or deletion of any personal data we hold about you at any time. Full details and how to make a request are in our{" "}
              <Link href="/privacy" style={{ color: "#d8af72" }}>Privacy Policy</Link>.
            </p>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
