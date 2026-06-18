import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { SOCIAL, CONTACT } from "@/lib/social";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Aston ISOC collects, uses, stores, and protects your personal data in line with UK GDPR.",
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const SECTIONS = [
  {
    h: "1. Who We Are",
    p: [
      "Aston University Islamic Society (Aston ISOC) is a student society affiliated with Aston Students' Union, Aston Triangle, Birmingham, B4 7ET.",
      "This Privacy Policy explains how we collect, use, store, and protect your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.",
    ],
  },
  {
    h: "2. Information We Collect",
    p: ["We may collect the following information:"],
    list: [
      "Contact details you provide via our contact form (name, email address, message content).",
      "Event registration details when you sign up for an ISOC event.",
      "Donation information processed securely through our payment provider (Stripe). We never see or store your full card details.",
      "Basic analytics data such as pages visited, collected anonymously to improve the website.",
    ],
  },
  {
    h: "3. How We Use Your Data",
    p: ["We use your personal data only for the purposes for which it was provided:"],
    list: [
      "To respond to enquiries submitted through our contact form.",
      "To manage event registrations and communicate event details.",
      "To process and acknowledge donations.",
      "To improve our website and understand how it is used.",
    ],
  },
  {
    h: "4. Legal Basis for Processing",
    p: [
      "We process your data on the basis of your consent (which you may withdraw at any time), our legitimate interest in running the society, and where necessary to fulfil a request you have made (such as registering for an event).",
    ],
  },
  {
    h: "5. Data Storage & Security",
    p: [
      "Contact form submissions are transmitted securely and are not stored on this website's servers. Donation payments are handled entirely by Stripe, a PCI-DSS compliant payment processor.",
      "We retain personal data only for as long as necessary to fulfil the purpose for which it was collected, after which it is securely deleted.",
    ],
  },
  {
    h: "6. Sharing Your Data",
    p: [
      "We do not sell or rent your personal data. We only share data with trusted service providers (such as Stripe for payments) strictly as necessary, and with Aston Students' Union where required for membership administration.",
    ],
  },
  {
    h: "7. Your Rights Under UK GDPR",
    p: ["You have the right to:"],
    list: [
      "Access the personal data we hold about you.",
      "Request correction of inaccurate data.",
      "Request erasure of your data ('right to be forgotten').",
      "Object to or restrict processing of your data.",
      "Request a copy of your data in a portable format.",
      "Withdraw consent at any time.",
    ],
  },
  {
    h: "8. Third-Party Links",
    p: [
      "Our website links to external sites (YouTube, Instagram, LinkedIn, WhatsApp, Stripe, and partner organisations). We are not responsible for the privacy practices of these sites and encourage you to review their own privacy policies.",
    ],
  },
  {
    h: "9. Cookies",
    p: [
      "This website uses minimal browser storage only to remember whether you have seen the intro animation during your current session. We do not use tracking or advertising cookies.",
    ],
  },
  {
    h: "10. Contact Us",
    p: [
      "To exercise any of your rights or ask questions about this policy, contact us via Instagram @astonisoc or through the contact page. We aim to respond within 30 days.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Privacy Policy" }]} />
      <PageHeader label="Legal" title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal data in line with UK GDPR." />

      <Reveal>
        <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", marginBottom: "2.5rem" }}>
          Last updated: June 2026
        </p>
      </Reveal>

      <div style={{ maxWidth: "72ch" }}>
        {SECTIONS.map((s, i) => (
          <Reveal key={s.h} delay={i * 30}>
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontFamily: PF, fontSize: "1.3rem", fontWeight: 500, color: "#fff", marginBottom: "0.85rem" }}>{s.h}</h2>
              {s.p.map((para, j) => (
                <p key={j} style={{ fontFamily: DM, fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: "0.85rem" }}>{para}</p>
              ))}
              {s.list && (
                <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {s.list.map(item => (
                    <li key={item} style={{ display: "flex", gap: "0.7rem", fontFamily: DM, fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.7 }}>
                      <span style={{ color: "#d8af72", flexShrink: 0 }}>✦</span>{item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </Reveal>
        ))}

        <Reveal>
          <div className="card" style={{ marginTop: "1rem" }}>
            <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7 }}>
              See also our <Link href="/data-policy" style={{ color: "#d8af72" }}>Data Collection Policy</Link> for more detail on specific data flows.
            </p>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
