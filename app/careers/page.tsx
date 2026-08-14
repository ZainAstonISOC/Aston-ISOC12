import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import OpportunityBoard from "@/components/careers/OpportunityBoard";
import { getOpportunityBoard, CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/careers";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Careers & Opportunities",
  description:
    "Internships, placement years, graduate roles, spring weeks, apprenticeships, Islamic finance and volunteering — searchable and filtered, for Aston ISOC members.",
};

// Providers cache for an hour; the page follows the same rhythm.
export const revalidate = 3600;

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default async function CareersPage() {
  const { opportunities, sources } = await getOpportunityBoard();

  const liveSources = sources.filter(s => s.enabled && !s.error);
  const categoriesCovered = new Set(opportunities.map(o => o.category));
  const featuredCount = opportunities.filter(o => o.featured).length;

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Careers & Opportunities" }]} />

      {/* ── Hero: headline left, live counters right ───────────────────────── */}
      <Reveal>
        <div className="careers-hero">
          <div>
            <p className="eyebrow">Opportunities</p>
            <h1 style={{ fontFamily: PF, fontWeight: 600, color: "#fff", maxWidth: "13ch" }}>
              Careers, without the <em style={{ color: "var(--gold)", fontStyle: "italic" }}>guesswork</em>.
            </h1>
            <div className="gold-rule" />
            <p className="lede" style={{ fontFamily: DM }}>
              Spring weeks, placements, graduate schemes, apprenticeships and Islamic finance
              routes — gathered in one place, searchable, and checked by the committee rather
              than scraped and forgotten.
            </p>
          </div>

          <div className="careers-hero__stats">
            {[
              { n: String(opportunities.length), l: "Opportunities listed" },
              { n: String(categoriesCovered.size), l: "Categories covered" },
              { n: String(featuredCount), l: "Committee picks" },
            ].map(s => (
              <div key={s.l}>
                <b style={{ fontFamily: PF, fontSize: "clamp(1.9rem, 3vw, 2.5rem)", color: "#fff", display: "block", lineHeight: 1 }}>
                  {s.n}
                </b>
                <span
                  style={{
                    fontFamily: DM,
                    fontSize: "0.74rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted-2)",
                  }}
                >
                  {s.l}
                </span>
              </div>
            ))}
            <p
              style={{
                fontFamily: DM,
                fontSize: "0.76rem",
                color: "var(--muted-2)",
                borderTop: "1px solid var(--line-soft)",
                paddingTop: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              {/* Counts are shown deliberately: a provider that returns nothing
                  used to look identical to one that was working. */}
              Sources: {liveSources.map(s => `${s.label} (${s.count})`).join(", ")}. Updated hourly.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── The board ────────────────────────────────────────────────────────
          Deliberately NOT wrapped in <Reveal>. This block is ~12,000px tall and
          grows with every listing; making the primary content of the page
          depend on a scroll observer firing is a single point of failure, and
          it already failed once in production. It renders immediately. */}
      <div style={{ marginTop: "clamp(2.5rem, 6vw, 4rem)" }}>
        <OpportunityBoard opportunities={opportunities} />
      </div>

      {/* ── What we track — asymmetric editorial band ───────────────────────── */}
      <Reveal delay={80}>
        <section style={{ marginTop: "clamp(3.5rem, 8vw, 6rem)" }}>
          <div className="careers-cover">
            <div>
              <p className="eyebrow">What we track</p>
              <h2 style={{ fontFamily: PF, color: "#fff", maxWidth: "15ch", marginBottom: "1rem" }}>
                Ten routes into work, not one
              </h2>
              <p style={{ fontFamily: DM, fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, maxWidth: "48ch" }}>
                Most students only hear about graduate schemes, and hear about them too late.
                First-year spring weeks, insight days and degree apprenticeships close months
                before finalists start looking — so the board covers the whole ladder.
              </p>
            </div>
            <ul className="careers-cover__list">
              {CATEGORY_ORDER.map(c => (
                <li key={c} className={categoriesCovered.has(c) ? "is-live" : ""}>
                  <span>{CATEGORY_LABELS[c]}</span>
                  {categoriesCovered.has(c) && (
                    <span className="careers-cover__count">
                      {opportunities.filter(o => o.category === c).length}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      {/* ── Advice — staggered, deliberately not a 3-up card row ────────────── */}
      <Reveal delay={100}>
        <section style={{ marginTop: "clamp(3.5rem, 8vw, 5.5rem)" }}>
          <p className="eyebrow">Getting ahead</p>
          <h2 style={{ fontFamily: PF, color: "#fff", maxWidth: "18ch", marginBottom: "2.5rem" }}>
            Three things that change the outcome
          </h2>
          <div className="careers-advice">
            {[
              {
                n: "01",
                t: "Apply a year earlier than feels right",
                d: "Spring weeks are for first years. Summer internships are for penultimate years. If you wait until you feel ready, the window has usually closed.",
              },
              {
                n: "02",
                t: "Use the schemes built for you",
                d: "SEO London and upReach exist specifically to get students from under-represented backgrounds into competitive industries. They are free, and they work.",
              },
              {
                n: "03",
                t: "Ask the person two years ahead of you",
                d: "The ISOC mentoring programme pairs you with someone who has already done the application you are about to start. It costs nothing but a message.",
              },
            ].map((tip, i) => (
              <article key={tip.n} style={{ marginTop: `${i * 1.6}rem` }}>
                <p style={{ fontFamily: PF, fontSize: "2.6rem", lineHeight: 1, color: "rgba(216,175,114,0.22)", marginBottom: "0.7rem" }}>
                  {tip.n}
                </p>
                <h3 style={{ fontFamily: PF, fontSize: "1.12rem", color: "#fff", marginBottom: "0.5rem", lineHeight: 1.35 }}>
                  {tip.t}
                </h3>
                <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75 }}>{tip.d}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Honesty note ───────────────────────────────────────────────────── */}
      <Reveal delay={110}>
        <p
          style={{
            fontFamily: DM,
            fontSize: "0.8rem",
            color: "var(--muted-2)",
            lineHeight: 1.7,
            marginTop: "clamp(2.5rem, 6vw, 3.5rem)",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--line-soft)",
            maxWidth: "70ch",
          }}
        >
          Aston ISOC is not the employer for any role listed here and does not handle applications.
          Always check closing dates and eligibility on the employer&apos;s own page — schemes change
          their dates year to year. Spotted something out of date?{" "}
          <Link href="/feedback" style={{ color: "var(--gold)" }}>
            Tell us
          </Link>
          .
        </p>
      </Reveal>

      <Reveal>
        <div style={{ marginTop: "clamp(3rem, 7vw, 4.5rem)" }}>
          <CtaBanner
            title="Know an opportunity we're missing?"
            description="If your employer runs a placement, spring week or graduate scheme, send it over and we will add it to the board for the next student who looks."
            primaryLabel="Suggest an opportunity"
            primaryHref="/feedback"
            secondaryLabel="Message us on Instagram"
            secondaryHref={SOCIAL.instagram}
          />
        </div>
      </Reveal>

      <style>{`
        .careers-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
          gap: clamp(2rem, 6vw, 4.5rem);
          align-items: start;
        }
        .careers-hero__stats {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          border-left: 1px solid var(--line);
          padding-left: clamp(1.25rem, 3vw, 2rem);
          margin-top: 0.5rem;
        }

        .careers-cover {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
          padding: clamp(1.9rem, 4vw, 3rem);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: linear-gradient(150deg, rgba(216,175,114,0.06), rgba(19,13,40,0.45));
        }
        .careers-cover__list { list-style: none; padding: 0; margin: 0; }
        .careers-cover__list li {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 0.62rem 0;
          border-bottom: 1px solid var(--line-soft);
          font-family: ${DM}; font-size: 0.9rem; color: var(--muted-2);
        }
        .careers-cover__list li:last-child { border-bottom: none; }
        .careers-cover__list li.is-live { color: var(--text); }
        .careers-cover__count {
          font-family: ${PF}; font-size: 0.95rem; color: var(--gold);
        }

        .careers-advice {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1.75rem, 4vw, 3rem);
          align-items: start;
        }

        @media (max-width: 900px) {
          .careers-hero { grid-template-columns: minmax(0, 1fr); }
          .careers-hero__stats {
            border-left: none;
            border-top: 1px solid var(--line);
            padding-left: 0;
            padding-top: 1.75rem;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 2rem;
          }
          .careers-hero__stats p { flex-basis: 100%; }
          .careers-cover { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 760px) {
          .careers-advice { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
          .careers-advice > * { margin-top: 0 !important; }
        }
      `}</style>
    </PageShell>
  );
}
