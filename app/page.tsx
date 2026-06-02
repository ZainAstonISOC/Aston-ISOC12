import Link from "next/link";
import type { Metadata } from "next";
import { getFeaturedEvents } from "@/data/events";
import { getRecentPosts } from "@/data/blog";
import { fetchLivePrayerTimes } from "@/data/prayer";
import { getActiveCampaigns } from "@/data/donations";
import { getBySection } from "@/data/committee";
import { volunteerCampaigns } from "@/data/volunteers";
import { EventCard, BlogCard, MemberCard, CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { SOCIAL, WHATSAPP, MEMBERSHIP } from "@/lib/social";

export const metadata: Metadata = {
  title: "Aston ISOC — Faith. Community. Purpose.",
  description: "Aston University Islamic Society. Serving Muslim students at Aston University, Birmingham.",
};
export const revalidate = 3600;

const PF = "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif";
const DM = "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif";

export default async function HomePage() {
  const [prayers, featuredEvents, recentPosts, campaigns] = await Promise.all([
    fetchLivePrayerTimes(),
    Promise.resolve(getFeaturedEvents()),
    Promise.resolve(getRecentPosts(3)),
    Promise.resolve(getActiveCampaigns()),
  ]);
  const core = getBySection("executive").slice(0, 3);
  const volunteerCamps = volunteerCampaigns.filter((c) => c.status !== "archived").slice(0, 3);

  return (
    <div style={{ background: "#0D1025" }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "100svh", background: "linear-gradient(160deg, #0D1025 0%, #151937 50%, #0D1025 100%)" }}>
        <div className="absolute inset-0 geo-pattern opacity-35" />
        <div className="glow-orb glow-gold" style={{ width: 700, height: 700, top: "5%", left: "50%", transform: "translateX(-50%)" }} />
        <div className="glow-orb glow-purple" style={{ width: 500, height: 500, bottom: "10%", right: "5%" }} />

        {/* Mosque silhouette */}
        <svg className="mosque-bg" viewBox="0 0 1000 300" fill="none" aria-hidden="true">
          <rect x="380" y="80" width="240" height="220" fill="white"/>
          <ellipse cx="500" cy="80" rx="120" ry="90" fill="white"/>
          <rect x="260" y="120" width="80" height="180" fill="white"/>
          <ellipse cx="300" cy="120" rx="40" ry="36" fill="white"/>
          <rect x="285" y="60" width="30" height="65" fill="white"/>
          <polygon points="300,52 285,68 315,68" fill="white"/>
          <rect x="660" y="120" width="80" height="180" fill="white"/>
          <ellipse cx="700" cy="120" rx="40" ry="36" fill="white"/>
          <rect x="685" y="60" width="30" height="65" fill="white"/>
          <polygon points="700,52 685,68 715,68" fill="white"/>
          <rect x="488" y="0" width="24" height="90" fill="white"/>
          <polygon points="500,0 486,18 514,18" fill="white"/>
          <rect x="0" y="280" width="1000" height="20" fill="white"/>
        </svg>

        <div className="relative z-10 text-center px-4" style={{ maxWidth: 800 }}>
          <p className="label mb-6" style={{ color: "rgba(201,162,39,0.65)" }}>Aston University · Birmingham</p>
          <h1 style={{ fontFamily: PF, fontSize: "clamp(3.2rem,9vw,6.5rem)", fontWeight: 500, color: "#fff", lineHeight: 1.02, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            Aston University<br />
            <em style={{ color: "#C9A227", fontStyle: "italic", fontWeight: 400 }}>Islamic Society</em>
          </h1>
          <div style={{ width: 72, height: 1, background: "linear-gradient(to right, transparent, #C9A227, transparent)", margin: "0 auto 2rem" }} />
          <p className="mb-12 tracking-[0.35em] uppercase" style={{ fontFamily: DM, fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.35)" }}>
            Faith &nbsp;·&nbsp; Community &nbsp;·&nbsp; Purpose
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={MEMBERSHIP.join} target="_blank" rel="noopener noreferrer" className="btn-gold">Join ISOC — £5</a>
            <Link href="/events" className="btn-outline-gold">Explore Events</Link>
            <Link href="/donate" className="btn-ghost">Donate</Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "rgba(201,162,39,0.35)" }}>
          <span className="text-xs tracking-widest uppercase" style={{ fontFamily: DM, fontSize: "0.58rem" }}>Scroll</span>
          <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, rgba(201,162,39,0.5), transparent)", animation: "scrollPulse 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ══ PRAYER TIMES ══════════════════════════════════════════════════ */}
      <section className="section-wrap-lg" style={{ background: "#151937", borderTop: "1px solid rgba(201,162,39,0.08)" }}>
        <div className="container">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="label mb-3">Daily Salah</p>
                <h2 style={{ fontFamily: PF, fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 500, color: "#fff" }}>
                  Prayer Times · Birmingham
                </h2>
                <span className="gold-rule" />
              </div>
              <Link href="/prayer-times" className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#C9A227", fontFamily: DM }}>
                Full timetable →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {prayers.map((p, i) => (
                <div key={p.name} className="prayer-card" style={{ borderRadius: "1rem" }}>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: i === 2 ? "#C9A227" : "#4B4B60", fontFamily: DM }}>
                    {p.name}
                  </p>
                  <p style={{ fontFamily: PF, fontSize: "1.85rem", fontWeight: 400, color: i === 2 ? "#C9A227" : "#fff", lineHeight: 1 }}>
                    {p.time}
                  </p>
                  {p.iqamaTime && p.name !== "Sunrise" && (
                    <p className="mt-1.5 text-xs" style={{ color: "#4B4B60", fontFamily: DM }}>Iqama {p.iqamaTime}</p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-5 flex items-center justify-between px-6 py-4 flex-wrap gap-3"
              style={{ background: "rgba(201,162,39,0.04)", border: "1px solid rgba(201,162,39,0.12)", borderRadius: "0.875rem" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "#EAEAEA", fontFamily: DM }}>Jumu&apos;ah · Every Friday during term</p>
                <p className="text-xs mt-0.5" style={{ color: "#6B6B80", fontFamily: DM }}>Khutbah 13:30 · Main Lecture Theatre, Aston University</p>
              </div>
              <Link href="/prayer-times" className="btn-outline-gold shrink-0" style={{ padding: "0.5rem 1.1rem", fontSize: "0.66rem" }}>Prayer Rooms →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══ FRESHERS + START HERE ══════════════════════════════════════════ */}
      <section className="section-wrap-lg" style={{ background: "#0D1025" }}>
        <div className="container">
          <Reveal>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="p-9 relative overflow-hidden hover-l3"
                style={{
                  background: "linear-gradient(135deg, rgba(201,162,39,0.09) 0%, rgba(21,25,55,0.9) 100%)",
                  border: "1px solid rgba(201,162,39,0.22)",
                  borderRadius: "1.5rem",
                }}>
                <div className="absolute inset-0 geo-pattern opacity-20" />
                <div className="relative z-10">
                  <p className="label mb-3">New to Aston?</p>
                  <h2 style={{ fontFamily: PF, fontSize: "2.1rem", fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>Freshers Hub 2026</h2>
                  <p className="text-sm leading-relaxed mb-7" style={{ color: "#A8A8B3", fontFamily: DM }}>Prayer rooms, halal food guide, welcome events, and your community — all in one place.</p>
                  <Link href="/freshers" className="btn-gold" style={{ fontSize: "0.72rem" }}>Explore Hub</Link>
                </div>
              </div>
              <div className="p-9 relative overflow-hidden hover-l2"
                style={{
                  background: "linear-gradient(135deg, rgba(27,31,74,0.9) 0%, rgba(13,16,37,0.8) 100%)",
                  border: "1px solid rgba(201,162,39,0.13)",
                  borderRadius: "1.5rem",
                }}>
                <div className="relative z-10">
                  <p className="label mb-3">First time here?</p>
                  <h2 style={{ fontFamily: PF, fontSize: "2.1rem", fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>Start Here</h2>
                  <p className="text-sm leading-relaxed mb-7" style={{ color: "#A8A8B3", fontFamily: DM }}>New Muslim, returning to faith, or curious about Islam? This is your starting point.</p>
                  <Link href="/start-here" className="btn-outline-gold" style={{ fontSize: "0.72rem" }}>Get Started</Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══ EVENTS ════════════════════════════════════════════════════════ */}
      <section className="section-wrap-lg" style={{ background: "#151937" }}>
        <div className="container">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
              <div>
                <p className="label mb-3">What&apos;s On</p>
                <h2 style={{ fontFamily: PF, fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 500, color: "#fff" }}>Upcoming Events</h2>
                <span className="gold-rule" />
              </div>
              <Link href="/events" className="btn-ghost mb-2" style={{ padding: "0.6rem 1.2rem", fontSize: "0.68rem" }}>View All</Link>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredEvents.slice(0, 3).map((e, i) => (
              <Reveal key={e.id} delay={i * 70}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={180}>
            <div className="mt-5 flex items-center justify-between px-5 py-4"
              style={{ border: "1px solid rgba(201,162,39,0.1)", borderRadius: "0.875rem" }}>
              <p className="text-sm" style={{ color: "#6B6B80", fontFamily: DM }}>Latest announcements on Instagram</p>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227", fontFamily: DM }}>
                @astonisoc →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══ SISTERS & BROTHERS ════════════════════════════════════════════ */}
      <section className="section-wrap-lg" style={{ background: "#0D1025" }}>
        <div className="container">
          <Reveal>
            <p className="label mb-3">Community</p>
            <h2 style={{ fontFamily: PF, fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>
              Sisters &amp; Brothers
            </h2>
            <span className="gold-rule" />
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-0 overflow-hidden"
            style={{ border: "1px solid rgba(201,162,39,0.12)", borderRadius: "1.5rem" }}>
            <Reveal>
              <div className="p-10 relative overflow-hidden hover-sisters h-full"
                style={{ borderRight: "1px solid rgba(201,162,39,0.1)", transition: "all 0.28s" }}>
                <div className="glow-orb absolute" style={{ width: 280, height: 280, top: -70, right: -70, background: "radial-gradient(circle, rgba(244,114,182,0.07) 0%, transparent 70%)" }} />
                <div className="relative z-10">
                  <p className="label mb-4" style={{ color: "rgba(249,168,212,0.7)" }}>For Sisters</p>
                  <h3 style={{ fontFamily: PF, fontSize: "2.3rem", fontWeight: 500, color: "#fff", marginBottom: "1rem", lineHeight: 1.08 }}>
                    Sisters&apos;<br /><em style={{ color: "#f9a8d4", fontWeight: 400 }}>Section</em>
                  </h3>
                  <p className="text-sm leading-relaxed mb-7" style={{ color: "#A8A8B3", fontFamily: DM, maxWidth: 320 }}>
                    Weekly halaqa, dedicated events, mentorship, and a strong sisterhood led by Aminah &amp; Yusra.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Link href="/sisters" className="btn-outline-gold" style={{ borderColor: "rgba(249,168,212,0.35)", color: "#f9a8d4", fontSize: "0.7rem" }}>Sisters&apos; Section</Link>
                    <a href={WHATSAPP.sistersFreshers} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: "0.7rem" }}>WhatsApp</a>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="p-10 relative overflow-hidden hover-brothers h-full" style={{ transition: "all 0.28s" }}>
                <div className="glow-orb absolute" style={{ width: 280, height: 280, top: -70, left: -70, background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />
                <div className="relative z-10">
                  <p className="label mb-4" style={{ color: "rgba(165,180,252,0.7)" }}>For Brothers</p>
                  <h3 style={{ fontFamily: PF, fontSize: "2.3rem", fontWeight: 500, color: "#fff", marginBottom: "1rem", lineHeight: 1.08 }}>
                    Brothers&apos;<br /><em style={{ color: "#a5b4fc", fontWeight: 400 }}>Section</em>
                  </h3>
                  <p className="text-sm leading-relaxed mb-7" style={{ color: "#A8A8B3", fontFamily: DM, maxWidth: 320 }}>
                    Brotherhood events, sports, circles, and networking led by Abdikarim &amp; Shaz.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Link href="/brothers" className="btn-outline-gold" style={{ borderColor: "rgba(165,180,252,0.35)", color: "#a5b4fc", fontSize: "0.7rem" }}>Brothers&apos; Section</Link>
                    <a href={WHATSAPP.brothersFreshers} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: "0.7rem" }}>WhatsApp</a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══ VOLUNTEER ═════════════════════════════════════════════════════ */}
      <section className="section-wrap-lg" style={{ background: "#151937" }}>
        <div className="container">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
              <div>
                <p className="label mb-3">Get Involved</p>
                <h2 style={{ fontFamily: PF, fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 500, color: "#fff" }}>We Need You</h2>
                <span className="gold-rule" />
                <p className="max-w-lg text-sm leading-relaxed" style={{ color: "#A8A8B3", fontFamily: DM }}>
                  Aston ISOC runs on the dedication of its volunteers. Join a campaign and make a real difference to your community.
                </p>
              </div>
              <Link href="/volunteer" className="btn-gold mb-2" style={{ fontSize: "0.7rem" }}>All Opportunities</Link>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {volunteerCamps.map((c, i) => (
              <Reveal key={c.id} delay={i * 70}>
                <Link href="/volunteer" className="block h-full">
                  <div className="h-full p-7 flex flex-col volunteer-card"
                    style={{ background: c.colour, border: "1px solid rgba(201,162,39,0.15)", borderRadius: "1.375rem" }}>
                    <span className="text-3xl mb-4 block">{c.icon}</span>
                    <h3 style={{ fontFamily: PF, fontSize: "1.4rem", fontWeight: 500, color: "#fff", marginBottom: "0.3rem" }}>{c.name}</h3>
                    <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#C9A227", fontFamily: DM }}>{c.tagline}</p>
                    <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "#A8A8B3", fontFamily: DM }}>
                      {c.description.slice(0, 120)}…
                    </p>
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227", fontFamily: DM }}>
                      {c.status === "active" ? "Recruiting Now →" : "Register Interest →"}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══ CHARITY ═══════════════════════════════════════════════════════ */}
      {campaigns.length > 0 && (
        <section className="section-wrap-lg" style={{ background: "#0D1025" }}>
          <div className="container">
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
                <div>
                  <p className="label mb-3">Giving Back</p>
                  <h2 style={{ fontFamily: PF, fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 500, color: "#fff" }}>Active Campaigns</h2>
                  <span className="gold-rule" />
                </div>
                <Link href="/charity" className="btn-ghost mb-2" style={{ padding: "0.6rem 1.2rem", fontSize: "0.68rem" }}>All Campaigns</Link>
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-5">
              {campaigns.slice(0, 2).map((c, i) => (
                <Reveal key={c.id} delay={i * 70}>
                  <div className="p-8 flex flex-col h-full hover-l3"
                    style={{
                      background: "linear-gradient(135deg, rgba(201,162,39,0.06) 0%, rgba(19,22,41,0.9) 100%)",
                      border: "1px solid rgba(201,162,39,0.16)",
                      borderRadius: "1.125rem",
                    }}>
                    {c.isFeatured && <span className="badge badge-gold self-start mb-4">Featured Campaign</span>}
                    <h3 style={{ fontFamily: PF, fontSize: "1.4rem", fontWeight: 500, color: "#fff", marginBottom: "0.75rem" }}>{c.name}</h3>
                    <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "#A8A8B3", fontFamily: DM }}>
                      {c.description.slice(0, 140)}…
                    </p>
                    {c.organisation && <p className="text-xs mb-5" style={{ color: "#4B4B60", fontFamily: DM }}>Via {c.organisation}</p>}
                    <a href={c.donationUrl} target="_blank" rel="noopener noreferrer" className="btn-gold self-start" style={{ fontSize: "0.72rem" }}>Donate Now</a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="section-divider" />

      {/* ══ COMMITTEE SPOTLIGHT ════════════════════════════════════════════ */}
      <section className="section-wrap-lg" style={{ background: "#151937" }}>
        <div className="container">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
              <div>
                <p className="label mb-3">Leadership</p>
                <h2 style={{ fontFamily: PF, fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 500, color: "#fff" }}>Committee 2026/27</h2>
                <span className="gold-rule" />
              </div>
              <Link href="/committee" className="btn-ghost mb-2" style={{ padding: "0.6rem 1.2rem", fontSize: "0.68rem" }}>Full Committee</Link>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {core.map((m, i) => (
              <Reveal key={m.id} delay={i * 70}>
                <MemberCard member={m} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══ ARTICLES (Advocacy owned) ══════════════════════════════════════ */}
      <section className="section-wrap-lg" style={{ background: "#0D1025" }}>
        <div className="container">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
              <div>
                <p className="label mb-3">Advocacy Team · Latest Articles</p>
                <h2 style={{ fontFamily: PF, fontSize: "clamp(1.9rem,3vw,2.6rem)", fontWeight: 500, color: "#fff" }}>Knowledge &amp; Insight</h2>
                <span className="gold-rule" />
              </div>
              <Link href="/blog" className="btn-ghost mb-2" style={{ padding: "0.6rem 1.2rem", fontSize: "0.68rem" }}>View All</Link>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentPosts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <BlogCard post={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══ LINKTREE (refined as ecosystem gateway) ═══════════════════════ */}
      <section className="section-wrap" style={{ background: "#151937" }}>
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <p className="label mb-3">Our Ecosystem</p>
              <h2 style={{ fontFamily: PF, fontSize: "clamp(1.9rem,3vw,2.5rem)", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>
                Everything Aston ISOC
              </h2>
              <span className="gold-rule" style={{ margin: "0 auto 1.5rem" }} />
              <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: "#A8A8B3", fontFamily: DM }}>
                One hub for every platform, link, and resource from Aston ISOC. Follow us, join us, support us.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: "📸", label: "Instagram", sub: "@astonisoc · Primary channel", href: SOCIAL.instagram, accent: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.18)" },
                { icon: "▶", label: "YouTube", sub: "Lectures & events archive", href: SOCIAL.youtube, accent: "rgba(239,68,68,0.07)", border: "rgba(239,68,68,0.18)" },
                { icon: "💬", label: "WhatsApp", sub: "Community announcements", href: WHATSAPP.community, accent: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.18)" },
                { icon: "🔗", label: "Linktree", sub: "All official links", href: SOCIAL.linktree, accent: "rgba(99,91,255,0.08)", border: "rgba(99,91,255,0.2)" },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * 50}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-7 text-center hover-l2"
                    style={{ background: s.accent, border: `1px solid ${s.border}`, borderRadius: "1.125rem", textDecoration: "none" }}>
                    <span className="text-2xl mb-3">{s.icon}</span>
                    <p className="font-semibold text-sm mb-1" style={{ color: "#EAEAEA", fontFamily: DM }}>{s.label}</p>
                    <p className="text-xs" style={{ color: "#6B6B80", fontFamily: DM }}>{s.sub}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ══ JOIN CTA ══════════════════════════════════════════════════════ */}
      <section className="section-wrap-lg" style={{ background: "#0D1025" }}>
        <div className="container">
          <Reveal>
            <CtaBanner
              title="Join the Aston ISOC Family"
              description="£5 for the full academic year. Access all events, both WhatsApp communities, the discount card, and a lifelong network of Muslim students and alumni."
              primaryLabel="Join ISOC — £5"
              primaryHref={MEMBERSHIP.join}
              secondaryLabel="Start Here"
              secondaryHref="/start-here"
            />
          </Reveal>
        </div>
      </section>

    </div>
  );
}
