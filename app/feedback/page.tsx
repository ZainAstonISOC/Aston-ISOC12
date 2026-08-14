import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import TellSafeEmbed from "@/components/ui/TellSafeEmbed";
import { TELLSAFE, SOCIAL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Share Feedback",
  description:
    "Tell Aston ISOC what is working and what is not — identified, anonymous, or anonymous with a reply. Every message reaches the committee.",
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const MODES = [
  {
    key: "identified",
    name: "Identified",
    line: "Your name and email reach the committee so they can follow up with you directly.",
    best: "Best for ideas you want to help deliver",
  },
  {
    key: "anonymous",
    name: "Anonymous",
    line: "Nothing identifying is attached. The committee reads it but cannot reply.",
    best: "Best for saying the difficult thing",
  },
  {
    key: "relay",
    name: "Anonymous relay",
    line: "You stay hidden, but the committee can still reply to you through TellSafe.",
    best: "Best when you want a conversation, not a name",
  },
];

const AFTER = [
  {
    n: "01",
    t: "It reaches the committee",
    d: "Submissions land with the committee inbox, not an individual. Nothing is filtered on the way in.",
  },
  {
    n: "02",
    t: "It gets read at the weekly meeting",
    d: "Feedback is a standing item. Recurring themes get an owner and a date rather than a nod.",
  },
  {
    n: "03",
    t: "You see what changed",
    d: "Changes made because someone spoke up are announced on Instagram and at the next general event.",
  },
];

export default function FeedbackPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Share Feedback" }]} />

      {/* ── Hero: deliberately off-balance, text weighted left ─────────────── */}
      <Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 0.85fr)",
            gap: "clamp(2rem, 6vw, 4.5rem)",
            alignItems: "start",
            marginBottom: "clamp(3.5rem, 8vw, 6rem)",
          }}
          className="feedback-hero"
        >
          <div>
            <p className="eyebrow">Your voice</p>
            <h1 style={{ fontFamily: PF, fontWeight: 600, color: "#fff", maxWidth: "14ch" }}>
              Tell us what we could do <em style={{ color: "var(--gold)", fontStyle: "italic" }}>better</em>.
            </h1>
            <div className="gold-rule" />
            <p className="lede" style={{ fontFamily: DM }}>
              A society only works when the quiet objections get heard as clearly as the loud
              praise. Say what you think — sign it or don&apos;t, the message counts either way.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                flexWrap: "wrap",
                marginTop: "1.75rem",
              }}
            >
              <a href={TELLSAFE.url} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                Share feedback
              </a>
              <a href="#form" className="btn btn-ghost">
                Use the form below
              </a>
            </div>
          </div>

          {/* Modes — a stacked ledger, not a row of matching cards */}
          <div
            style={{
              borderLeft: "1px solid var(--line)",
              paddingLeft: "clamp(1.25rem, 3vw, 2rem)",
              marginTop: "0.5rem",
            }}
            className="feedback-modes"
          >
            <h2
              style={{
                fontFamily: DM,
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted-2)",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              Three ways to send it
            </h2>
            {MODES.map((m, i) => (
              <div
                key={m.key}
                style={{
                  paddingBottom: i === MODES.length - 1 ? 0 : "1.35rem",
                  marginBottom: i === MODES.length - 1 ? 0 : "1.35rem",
                  borderBottom: i === MODES.length - 1 ? "none" : "1px solid var(--line-soft)",
                }}
              >
                <h3
                  style={{
                    fontFamily: PF,
                    fontSize: "1.08rem",
                    color: "#fff",
                    marginBottom: "0.3rem",
                  }}
                >
                  {m.name}
                </h3>
                <p style={{ fontFamily: DM, fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.7 }}>
                  {m.line}
                </p>
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: "0.74rem",
                    color: "var(--gold)",
                    opacity: 0.85,
                    marginTop: "0.45rem",
                  }}
                >
                  {m.best}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── The form itself ────────────────────────────────────────────────── */}
      <div id="form" className="scroll-mt-28">
        <Reveal>
          <TellSafeEmbed />
        </Reveal>
      </div>

      {/* ── What happens next — staggered, not a symmetric 3-up ────────────── */}
      <Reveal delay={60}>
        <div style={{ marginTop: "clamp(3.5rem, 8vw, 6rem)" }}>
          <p className="eyebrow">After you hit send</p>
          <h2 style={{ fontFamily: PF, color: "#fff", maxWidth: "16ch", marginBottom: "2.5rem" }}>
            What happens to what you write
          </h2>
          <div className="feedback-steps">
            {AFTER.map((s, i) => (
              <div
                key={s.n}
                style={{
                  // each step sits slightly lower than the last — reads as a descent, not a row
                  marginTop: `${i * 1.75}rem`,
                }}
              >
                <p
                  style={{
                    fontFamily: PF,
                    fontSize: "2.75rem",
                    lineHeight: 1,
                    color: "rgba(216,175,114,0.22)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {s.n}
                </p>
                <h3 style={{ fontFamily: PF, fontSize: "1.15rem", color: "#fff", marginBottom: "0.5rem" }}>
                  {s.t}
                </h3>
                <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75 }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Safeguarding note ──────────────────────────────────────────────── */}
      <Reveal delay={80}>
        <div
          className="card"
          style={{
            marginTop: "clamp(3rem, 7vw, 4.5rem)",
            borderColor: "var(--line)",
            background: "linear-gradient(150deg, rgba(216,175,114,0.06), rgba(19,13,40,0.45))",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "clamp(1.5rem, 4vw, 3rem)",
            }}
            className="feedback-note"
          >
            <div>
              <p className="eyebrow">If it&apos;s urgent</p>
              <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.2rem", marginBottom: "0.6rem" }}>
                This form is not monitored in real time
              </h3>
              <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75 }}>
                For anything involving immediate safety, contact the emergency services, Aston
                University security, or a trusted person directly. For anything time-sensitive but
                not an emergency, message the committee on Instagram.
              </p>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-gold"
                style={{ marginTop: "1.25rem" }}
              >
                Message us on Instagram
              </a>
            </div>
            <div>
              <p className="eyebrow">Your data</p>
              <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.2rem", marginBottom: "0.6rem" }}>
                Handled by TellSafe, not stored by us
              </h3>
              <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75 }}>
                Submissions go to TellSafe, an independent platform, and are subject to their
                privacy terms. Anonymous submissions carry no name or email. This website itself
                records nothing from the form.
              </p>
              <Link href="/privacy" className="btn btn-ghost" style={{ marginTop: "1.25rem" }}>
                Read our privacy policy
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      <style>{`
        .feedback-steps {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1.75rem, 4vw, 3rem);
          align-items: start;
        }
        @media (max-width: 900px) {
          .feedback-hero { grid-template-columns: minmax(0, 1fr) !important; }
          .feedback-modes {
            border-left: none !important;
            border-top: 1px solid var(--line);
            padding-left: 0 !important;
            padding-top: 2rem;
          }
        }
        @media (max-width: 760px) {
          .feedback-steps { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
          .feedback-steps > * { margin-top: 0 !important; }
          .feedback-note { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </PageShell>
  );
}
