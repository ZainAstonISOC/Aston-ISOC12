import Link from "next/link";
import type { Metadata } from "next";
import { getFeaturedEvents } from "@/data/events";
import { fetchLivePrayerTimes } from "@/data/prayer";
import { getActiveCampaigns } from "@/data/donations";
import { getBySection } from "@/data/committee";
import { volunteerCampaigns } from "@/data/volunteers";
import { EventCard, MemberCard, CtaBanner } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import PrayerTimesDisplay from "@/components/ui/PrayerTimesDisplay";
import { SOCIAL, WHATSAPP, MEMBERSHIP } from "@/lib/social";

export const metadata: Metadata = {
  title: "Aston ISOC Faith. Community. Excellence.",
  description: "Aston University Islamic Society. Serving Muslim students at Aston University, Birmingham.",
};
export const revalidate = 3600;

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default async function HomePage() {
  const [prayers, featuredEvents, campaigns] = await Promise.all([
    fetchLivePrayerTimes(),
    Promise.resolve(getFeaturedEvents()),
    Promise.resolve(getActiveCampaigns()),
  ]);
  // Homepage shows Head Brother + Head Sister only (the two society leads)
  const allExec = getBySection("executive");
  const core = [
    allExec.find(m => m.id === "head-brother"),
    allExec.find(m => m.id === "head-sister"),
  ].filter(Boolean) as typeof allExec;
  const volunteerCamps = volunteerCampaigns.filter(c => c.status !== "archived").slice(0, 3);

  return (
    <div>
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="hero" style={{ position: "relative", paddingTop: "clamp(8rem,16vw,12rem)", paddingBottom: "clamp(4rem,8vw,7rem)", overflow: "hidden" }}>
        {/* Rotating geometric ornament */}
        <div aria-hidden="true" style={{ position: "absolute", right: "-8%", top: "10%", width: "min(46vw,560px)", aspectRatio: "1", zIndex: -1, opacity: 0.28, color: "#d8af72", animation: "spin 80s linear infinite" }}>
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8" style={{ width: "100%", height: "100%" }}>
            <circle cx="100" cy="100" r="98"/>
            <circle cx="100" cy="100" r="72"/>
            <polygon points="180,100 100,180 20,100 100,20"/>
            <polygon points="156.6,156.6 43.4,156.6 43.4,43.4 156.6,43.4"/>
            <polygon points="150,100 100,150 50,100 100,50"/>
            <polygon points="135.4,135.4 64.6,135.4 64.6,64.6 135.4,64.6"/>
          </svg>
        </div>

        <div className="container">
          {/* Bismillah */}
          <Reveal>
            <p style={{ fontFamily: "'Noto Naskh Arabic', serif", direction: "rtl", color: "#d8af72", fontSize: "clamp(1.6rem,4vw,2.4rem)", marginBottom: "1.2rem", opacity: 0.9 }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </Reveal>

          <Reveal delay={60}>
            <p className="eyebrow">Aston University · Birmingham</p>
          </Reveal>

          <Reveal delay={120}>
            <h1 style={{ fontFamily: PF, fontWeight: 600, maxWidth: "16ch", lineHeight: 1.1, marginBottom: "0" }}>
              A home away from home for{" "}
              <em style={{ fontStyle: "italic", color: "#d8af72", fontWeight: 500 }}>every</em>{" "}
              Muslim student.
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="lede" style={{ marginTop: "1.6rem" }}>
              Faith, friendship and belonging at the heart of campus. Join one of Aston&apos;s most active student communities for daily prayer, weekly circles, charity, and a community that lasts a lifetime.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2.4rem" }}>
              <a href={MEMBERSHIP.join} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">
                Become a Member
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <Link href="/prayer-times" className="btn btn-ghost btn-lg">View Prayer Times</Link>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1.5rem,5vw,3.5rem)", marginTop: "3.5rem", paddingTop: "2.2rem", borderTop: "1px solid rgba(216,175,114,0.12)" }}>
              {[
                { n: "1,000+", label: "Members" },
                { n: "5×", label: "Daily prayers on campus" },
                { n: "£200k+", label: "Raised for charity" },
                { n: "50+", label: "Events each semester" },
              ].map(s => (
                <div key={s.label}>
                  <b style={{ fontFamily: PF, fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "#fff", display: "block" }}>{s.n}</b>
                  <span style={{ fontFamily: DM, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8d86a3" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PRAYER TIMES ══════════════════════════════════════════════════ */}
      <section className="section section--tight">
        <div className="container">
          <Reveal>
            <p className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>Live · Birmingham</p>
            <h2 style={{ fontFamily: PF, textAlign: "center", marginBottom: "2rem" }}>Today&apos;s prayer times</h2>
          </Reveal>
          <Reveal delay={80}>
            <PrayerTimesDisplay times={prayers} />
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "#8d86a3", textAlign: "center", marginTop: "1.2rem" }}>
              Jumu&apos;ah every Friday · Aston Students&apos; Union Hall (SU Hall) · Khutbah 13:30
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ WHAT WE OFFER ══════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Reveal><p className="eyebrow" style={{ justifyContent: "center" }}>What we offer</p></Reveal>
            <Reveal delay={80}><h2 style={{ fontFamily: PF }}>More than a society a community</h2></Reveal>
            <Reveal delay={140}><p className="lede" style={{ margin: "0 auto" }}>Everything you need to keep your deen strong while you study, all in one place.</p></Reveal>
          </div>
          <div className="grid cols-3">
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>, title: "Prayer & Jumu'ah", desc: "Dedicated brothers' and sisters' prayer spaces, with congregational Jumu'ah every Friday at the SU Hall." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>, title: "Weekly Halaqa", desc: "Reflect, learn and grow together with weekly circles, tafsir sessions and guest speakers from across the UK." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>, title: "Charity & Sadaqah", desc: "Make your time at university count. Our Charity Week and year-round fundraising support causes at home and abroad." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: "Sisters & Brothers", desc: "From football and futsal to game nights and meals out find your people and make friendships that last." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2.5 9 2.5 12 0v-5"/></svg>, title: "Mentoring & Support", desc: "New to Aston? Our mentoring scheme pairs first-years with senior students for guidance, academic and spiritual." },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 2.7 6.2 6.8.5-5.2 4.4 1.6 6.6L12 17l-5.9 3.7 1.6-6.6L2.5 9.7l6.8-.5z"/></svg>, title: "Community \u0026 Dawah", desc: "From Friday gatherings to open conversations a week of talks, exhibitions and open conversations welcoming the whole university." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 80}>
                <article className="card feature">
                  <div className="icon-badge">{item.icon}</div>
                  <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.25rem" }}>{item.title}</h3>
                  <p style={{ fontFamily: DM, fontSize: "0.95rem", marginTop: "0.5rem" }}>{item.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EVENTS ════════════════════════════════════════════════════════ */}
      <section className="section section--tight">
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
            <div>
              <Reveal><p className="eyebrow">What&apos;s On</p></Reveal>
              <Reveal delay={80}><h2 style={{ fontFamily: PF }}>Upcoming Events</h2></Reveal>
            </div>
            <Reveal><Link href="/events" className="btn btn-ghost">View All</Link></Reveal>
          </div>
          <div className="grid cols-3">
            {featuredEvents.map((e, i) => (
              <Reveal key={e.id} delay={i * 80}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div style={{ marginTop: "1.5rem", padding: "1rem 1.5rem", borderRadius: "12px", border: "1px solid rgba(216,175,114,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
              <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "#8d86a3" }}>More events announced on Instagram</p>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={{ fontFamily: DM, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", color: "#d8af72" }}>@astonisoc →</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ SISTERS & BROTHERS ════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section-head center" style={{ marginBottom: "2.5rem" }}>
            <Reveal><p className="eyebrow" style={{ justifyContent: "center" }}>Community</p></Reveal>
            <Reveal delay={80}><h2 style={{ fontFamily: PF }}>Sisters &amp; Brothers</h2></Reveal>
            <Reveal delay={120}>
              <p className="lede" style={{ marginInline: "auto", fontStyle: "italic", color: "#8d86a3", fontFamily: PF, fontSize: "0.95rem" }}>
                &ldquo;The believers are like one body in their mutual love.&rdquo; Prophet Muhammad ﷺ
              </p>
            </Reveal>
          </div>
          <div className="grid cols-2">
            <Reveal>
              <div className="card hover-sisters" style={{ borderColor: "rgba(244,114,182,0.15)" }}>
                <p className="eyebrow" style={{ color: "rgba(249,168,212,0.8)" }}>For Sisters</p>
                <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.8rem" }}>Sisters&apos; <em style={{ color: "#f9a8d4" }}>Section</em></h3>
                <p style={{ fontFamily: DM, marginTop: "0.75rem", marginBottom: "1.5rem" }}>Weekly halaqa, dedicated events, mentorship, and a strong sisterhood led by Aminah &amp; Yusra.</p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <Link href="/sisters" className="btn btn-ghost" style={{ borderColor: "rgba(249,168,212,0.3)", color: "#f9a8d4" }}>Sisters&apos; Section</Link>
                  <a href={WHATSAPP.sistersFreshers} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">WhatsApp</a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card hover-brothers" style={{ borderColor: "rgba(129,140,248,0.15)" }}>
                <p className="eyebrow" style={{ color: "rgba(165,180,252,0.8)" }}>For Brothers</p>
                <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.8rem" }}>Brothers&apos; <em style={{ color: "#a5b4fc" }}>Section</em></h3>
                <p style={{ fontFamily: DM, marginTop: "0.75rem", marginBottom: "1.5rem" }}>Brotherhood events, sports, circles, and networking led by Abdikarim &amp; Shaz.</p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <Link href="/brothers" className="btn btn-ghost" style={{ borderColor: "rgba(165,180,252,0.3)", color: "#a5b4fc" }}>Brothers&apos; Section</Link>
                  <a href={WHATSAPP.brothersFreshers} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">WhatsApp</a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* == GET INVOLVED TEASER == */}
      <section className="section section--tight">
        <div className="container">
          <Reveal>
            <div className="cta-band" style={{ textAlign: "left", padding: "clamp(2rem,4vw,3rem)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
                <div style={{ maxWidth: "56ch" }}>
                  <p className="eyebrow">Get Involved</p>
                  <h2 style={{ fontFamily: PF, fontSize: "clamp(1.6rem,3vw,2.2rem)" }}>We need you.</h2>
                  <p style={{ fontFamily: DM, color: "var(--muted)", marginTop: "0.75rem", lineHeight: 1.75 }}>
                    Ramadan, Discover Islam Week, Charity Week - every campaign runs on volunteers. Whether you can give an hour or a week, your contribution matters.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
                  <Link href="/volunteer" className="btn btn-gold">View Opportunities</Link>
                  <Link href="/contact" className="btn btn-ghost">Get in Touch</Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" />

            {/* ══ CHARITY ═══════════════════════════════════════════════════════ */}
      {campaigns.length > 0 && (
        <section className="section section--tight">
          <div className="container">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
              <div>
                <Reveal><p className="eyebrow">Sadaqah</p></Reveal>
                <Reveal delay={80}><h2 style={{ fontFamily: PF }}>Active Campaigns</h2></Reveal>
                <Reveal delay={100}>
                  <p style={{ fontFamily: PF, fontStyle: "italic", color: "#8d86a3", fontSize: "0.92rem" }}>
                    &ldquo;Charity does not decrease wealth.&rdquo; Prophet Muhammad ﷺ
                  </p>
                </Reveal>
              </div>
              <Reveal><Link href="/charity" className="btn btn-ghost">All Campaigns</Link></Reveal>
            </div>
            <div className="grid cols-2">
              {campaigns.slice(0, 2).map((c, i) => (
                <Reveal key={c.id} delay={i * 80}>
                  <div className="card">
                    {c.isFeatured && <span className="pill" style={{ marginBottom: "1rem", display: "inline-block" }}>Featured Campaign</span>}
                    <h3 style={{ fontFamily: PF, fontSize: "1.4rem", color: "#fff", marginBottom: "0.75rem" }}>{c.name}</h3>
                    <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "#8d86a3", lineHeight: 1.75, marginBottom: "1.5rem" }}>{c.description.slice(0, 150)}…</p>
                    {c.organisation && <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "#8d86a3", marginBottom: "1.25rem" }}>Via {c.organisation}</p>}
                    <a href={c.donationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Donate Now</a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ COMMITTEE ═════════════════════════════════════════════════════ */}
      <section className="section section--tight">
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
            <div>
              <Reveal><p className="eyebrow">Leadership</p></Reveal>
              <Reveal delay={80}><h2 style={{ fontFamily: PF }}>Committee 2026/27</h2></Reveal>
            </div>
            <Reveal><Link href="/committee" className="btn btn-ghost">Full Committee</Link></Reveal>
          </div>
          <div className="grid cols-2">
            {core.map((m, i) => (
              <Reveal key={m.id} delay={i * 80}>
                <MemberCard member={m} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ECOSYSTEM ════════════════════════════════════════════════════ */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head center" style={{ marginBottom: "2.5rem" }}>
            <Reveal><p className="eyebrow" style={{ justifyContent: "center" }}>Stay Connected</p></Reveal>
            <Reveal delay={80}><h2 style={{ fontFamily: PF }}>Find us online</h2></Reveal>
          </div>
          <div className="grid cols-3">
            {[
              { icon: "📸", label: "Instagram", sub: "@astonisoc primary channel", href: SOCIAL.instagram },
              { icon: "💬", label: "WhatsApp", sub: "Community announcements", href: WHATSAPP.community },
              { icon: "🔗", label: "Linktree", sub: "All official links", href: SOCIAL.linktree },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="card link" style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem" }}>{s.icon}</span>
                  <h3 style={{ fontFamily: PF, fontSize: "1.15rem", color: "#fff", marginBottom: "0.3rem" }}>{s.label}</h3>
                  <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "#8d86a3" }}>{s.sub}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JOIN CTA ══════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <Reveal>
            <CtaBanner
              title="Join the Aston ISOC Family"
              description="£5 for the full academic year. Access all events, WhatsApp communities, the discount card, and a lifelong network of Muslim students."
              primaryLabel="Become a Member"
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
