import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import PrayerTimesDisplay from "@/components/ui/PrayerTimesDisplay";
import { fetchLivePrayerTimes } from "@/data/prayer";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Prayer Times",
  description: "Live daily prayer times for Birmingham. Campus prayer rooms and Jumu'ah info.",
};
export const revalidate = 3600;

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default async function PrayerTimesPage() {
  const times = await fetchLivePrayerTimes();

  return (
    <div style={{ minHeight: "100vh", paddingTop: "5rem" }}>
      <div className="page-hero">
        <div className="container">
          <Breadcrumb crumbs={[{ label: "Prayer Times" }]} />
          <p className="eyebrow" style={{ justifyContent: "center" }}>Birmingham · Live daily</p>
          <h1 style={{ fontFamily: PF }}>Never miss a prayer on campus</h1>
          <p className="lede" style={{ margin: "1.4rem auto 0" }}>
            Times update automatically each day. Congregational prayers are held in the prayer rooms throughout the day.
          </p>
        </div>
      </div>

      <section className="section section--tight">
        <div className="container">
          <Reveal><PrayerTimesDisplay times={times} /></Reveal>
          <Reveal delay={80}>
            <p style={{ fontFamily: DM, color: "#8d86a3", textAlign: "center", fontSize: "0.82rem", marginTop: "1rem" }}>
              Calculation method: Muslim World League (MWL). Always confirm with your local mosque for exact congregation times.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="grid cols-2">
            <Reveal>
              <article className="card" id="jummah">
                <div className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: PF, color: "#fff" }}>Jumu&apos;ah Prayer</h3>
                <p style={{ fontFamily: DM, marginTop: "0.5rem", marginBottom: "1rem" }}>
                  Friday congregational prayer is held every week during term time at the Aston Students&apos; Union Hall (SU Hall).
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { k: "Location", v: "Aston Students' Union Hall (SU Hall)" },
                    { k: "Khutbah", v: "13:30 (doors open 13:15)" },
                    { k: "Prayer",  v: "~14:00 (after khutbah)" },
                    { k: "Sisters", v: "Dedicated section side entrance" },
                  ].map(row => (
                    <p key={row.k} style={{ fontFamily: DM, fontSize: "0.88rem", color: "#8d86a3" }}>
                      <span style={{ color: "#d8af72", fontWeight: 600, marginRight: "0.5rem" }}>{row.k}:</span>{row.v}
                    </p>
                  ))}
                </div>
                <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "#8d86a3", marginTop: "1rem" }}>
                  Confirm on <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#d8af72" }}>@astonisoc</a> during exam periods.
                </p>
              </article>
            </Reveal>

            <Reveal delay={100}>
              <article className="card">
                <div className="icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: PF, color: "#fff" }}>Prayer Room Locations</h3>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.9rem", marginTop: "0.75rem" }}>
                  {[
                    { k: "Brothers Prayer Room", v: "Main Building, MB 163 Back of the Students' Union, Ground Floor" },
                    { k: "Sisters Prayer Room",  v: "Main Building, MB 183 Back of the Students' Union, Ground Floor" },
                    { k: "Wudu",                 v: "Available adjacent to both prayer rooms" },
                    { k: "Open",                 v: "All day during campus opening hours" },
                  ].map(item => (
                    <li key={item.k} style={{ fontFamily: DM, fontSize: "0.88rem", color: "#8d86a3" }}>
                      <span style={{ color: "#d8af72", fontWeight: 600, marginRight: "0.4rem" }}>{item.k}:</span>{item.v}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="flourish" style={{ marginBottom: "2.5rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="m12 3 2.7 6.2 6.8.5-5.2 4.4 1.6 6.6L12 17l-5.9 3.7 1.6-6.6L2.5 9.7l6.8-.5z"/>
            </svg>
          </div>
          <div className="section-head center">
            <Reveal><p className="eyebrow">Good to know</p></Reveal>
            <Reveal delay={80}><h2 style={{ fontFamily: PF }}>Praying on campus for the first time?</h2></Reveal>
          </div>
          <div className="grid cols-3">
            {[
              { title: "Everyone is welcome", desc: "You don't need to be a member to use the prayer rooms. New Muslims and non-Muslims are always welcome." },
              { title: "Bring nothing but yourself", desc: "Prayer mats and Qur'ans are provided. Wudu areas are right next door." },
              { title: "Find us if you're lost", desc: "Message us on Instagram or WhatsApp and a committee member will walk you to the prayer room." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <article className="card feature">
                  <h3 style={{ fontFamily: PF, color: "#fff" }}>{item.title}</h3>
                  <p style={{ fontFamily: DM, marginTop: "0.5rem" }}>{item.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="cta-band">
              <h2 style={{ fontFamily: PF }}>Want prayer times in your pocket?</h2>
              <p className="lede" style={{ margin: "0 auto 2rem" }}>Join our WhatsApp broadcast for daily times, iqamah reminders and Jumu&apos;ah updates.</p>
              <div className="cta-band__actions">
                <a className="btn btn-gold btn-lg" href={SOCIAL.linktree} target="_blank" rel="noopener noreferrer">Join WhatsApp</a>
                <Link className="btn btn-ghost btn-lg" href="/join">Become a Member</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
