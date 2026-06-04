import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Reveal from "@/components/ui/Reveal";
import { fetchLivePrayerTimes, PRAYER_LINKS } from "@/data/prayer";
import { SOCIAL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Prayer Times",
  description: "Live daily prayer times for Birmingham — Fajr, Dhuhr, Asr, Maghrib, Isha. Campus prayer rooms and Jumu'ah info.",
};
export const revalidate = 3600;

export default async function PrayerTimesPage() {
  const times = await fetchLivePrayerTimes();
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ background: "#0D1025", minHeight: "100vh", paddingTop: "5rem" }}>
      <div className="container py-16">
        <Breadcrumb crumbs={[{ label: "Prayer Times" }]} />

        <div className="mb-16">
          <p className="label mb-3">Salah</p>
          <h1 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1 }}>
            Prayer Times
          </h1>
          <span className="gold-rule" />
          <p style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif", fontSize: "0.9rem" }}>
            Birmingham, UK · {today}
          </p>
          <p className="mt-1 text-xs" style={{ color: "#34D399", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
            ✓ Live — updates daily via Aladhan API
          </p>
        </div>

        {/* Prayer times grid */}
        <Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {times.map((p, i) => (
              <div
                key={p.name}
                className="prayer-card"
                style={{
                  borderRadius: "1rem",
                  background: i === 2 ? "rgba(201,162,39,0.08)" : "#131629",
                  border: i === 2 ? "1px solid rgba(201,162,39,0.4)" : "1px solid rgba(201,162,39,0.1)",
                  boxShadow: i === 2 ? "0 0 30px rgba(201,162,39,0.08)" : "none",
                }}
              >
                <p
                  className="text-xs tracking-widest uppercase mb-2"
                  style={{ color: i === 2 ? "#C9A227" : "#4B5563", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif",
                    fontSize: "2rem",
                    fontWeight: 300,
                    color: i === 2 ? "#C9A227" : "#fff",
                    lineHeight: 1,
                  }}
                >
                  {p.time}
                </p>
                {p.iqamaTime && p.name !== "Sunrise" && (
                  <p className="mt-2 text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
                    Iqama: {p.iqamaTime}
                  </p>
                )}
                {i === 2 && (
                  <p className="mt-1.5 text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
                    Next
                  </p>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Live widget */}
        <Reveal delay={100}>
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 mb-12"
            style={{ background: "rgba(201,162,39,0.04)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: "0.75rem" }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: "#E5E7EB", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>Live Prayer Times Display</p>
              <p className="text-xs mt-0.5" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>Digital display for the on-campus prayer room at Aston</p>
            </div>
            <a href={PRAYER_LINKS.liveWidget} target="_blank" rel="noopener noreferrer" className="btn-outline-gold shrink-0" style={{ fontSize: "0.68rem", padding: "0.6rem 1.2rem" }}>
              View Live Display →
            </a>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Campus rooms */}
          <Reveal>
            <div className="h-full" style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1rem", overflow: "hidden" }}>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(201,162,39,0.08)" }}>
                <p className="label">On-Campus</p>
                <h2 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "1.4rem", fontWeight: 300, color: "#fff" }}>Prayer Rooms</h2>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(201,162,39,0.06)" }}>
                {[
                  { room: "Main Building — MB131", notes: "Mixed · Sisters & brothers sections", wudu: "Yes" },
                  { room: "Aston Business School — ABS G05", notes: "Sisters preferred space", wudu: "Yes" },
                  { room: "Engineering — EAS W10", notes: "Open to all", wudu: "Nearby" },
                  { room: "Student Union — Multi-faith Room", notes: "Bookable, all faiths", wudu: "No" },
                ].map((r) => (
                  <div key={r.room} className="px-6 py-3.5" style={{ borderColor: "rgba(201,162,39,0.06)" }}>
                    <p className="text-sm font-medium" style={{ color: "#E5E7EB", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{r.room}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#4B5563", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{r.notes} · Wudu: {r.wudu}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Jummah */}
          <Reveal delay={100}>
            <div className="h-full flex flex-col gap-4">
              <div
                className="p-6"
                style={{ background: "rgba(201,162,39,0.05)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: "1rem" }}
              >
                <p className="label mb-2">Every Friday</p>
                <h2 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "1.6rem", fontWeight: 300, color: "#fff", marginBottom: "1rem" }}>
                  Jumu&apos;ah Prayer
                </h2>
                <div className="space-y-1.5 text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
                  <p><span className="font-medium" style={{ color: "#E5E7EB" }}>Location:</span> Aston Students' Union Hall (SU Hall)</p>
                  <p><span className="font-medium" style={{ color: "#E5E7EB" }}>Khutbah:</span> 13:30 (doors 13:15)</p>
                  <p><span className="font-medium" style={{ color: "#E5E7EB" }}>Prayer:</span> ~14:00</p>
                  <p><span className="font-medium" style={{ color: "#E5E7EB" }}>Sisters:</span> Dedicated section — side entrance</p>
                </div>
                <p className="mt-4 text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
                  Confirm on <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#C9A227" }}>@astonisoc</a> during exam periods.
                </p>
              </div>

              <div className="p-6" style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1rem" }}>
                <p className="label mb-3">Nearby</p>
                <div className="space-y-2">
                  {[
                    { name: "Birmingham Central Mosque", dist: "0.4 mi" },
                    { name: "Green Lane Masjid", dist: "1.2 mi" },
                    { name: "Al-Furqan Mosque", dist: "0.8 mi" },
                  ].map((m) => (
                    <div key={m.name} className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{m.name}</span>
                      <span className="text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{m.dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Etiquette */}
        <Reveal>
          <div className="p-6" style={{ background: "#131629", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "1rem" }}>
            <p className="label mb-3">Etiquette</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Remove shoes before entering the prayer area",
                "Keep mobile phones on silent during prayer",
                "Maintain cleanliness — leave the space as you found it",
                "Perform wudu before entering the prayer area",
                "Respect the shared space with the whole community",
              ].map((e) => (
                <div key={e} className="flex items-start gap-2.5 text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
                  <span style={{ color: "#C9A227", marginTop: "2px", flexShrink: 0 }}>✓</span>
                  {e}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
