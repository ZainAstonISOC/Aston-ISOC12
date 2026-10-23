import type { WeeklySession } from "@/lib/content";
import type { JumuahSettings } from "@/lib/jumuah";
import { jamaatList } from "@/lib/jumuah";
import { DAY_OPTIONS } from "@/lib/content/schema";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const AUDIENCE: Record<string, { label: string; colour: string } | undefined> = {
  sisters: { label: "Sisters", colour: "#f9a8d4" },
  brothers: { label: "Brothers", colour: "#a5b4fc" },
};

/**
 * The regular week, Monday to Sunday. Jumu'ah always comes from the Jumu'ah
 * settings so its times can never disagree with the prayer page.
 */
export default function WeekAtIsoc({ sessions, jumuah }: { sessions: WeeklySession[]; jumuah: JumuahSettings }) {
  const all: WeeklySession[] = [
    ...sessions,
    { id: "jumuah", title: "Jumu'ah", day: "Friday", time: jamaatList(jumuah.jamaats), endTime: "", location: jumuah.location, category: "all", note: "" },
  ];
  const days = DAY_OPTIONS.map(d => d.value)
    .map(day => ({ day, items: all.filter(s => s.day === day) }))
    .filter(d => d.items.length);

  return (
    <div className="week-grid">
      {days.map(({ day, items }) => (
        <div key={day} className="card week-day">
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>{day}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {items.map(s => {
              const aud = AUDIENCE[s.category];
              return (
                <li key={s.id}>
                  <p style={{ fontFamily: PF, color: "#fff", fontSize: "1.1rem", lineHeight: 1.3 }}>
                    {s.title}
                    {aud && <span style={{ fontFamily: DM, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: aud.colour, marginLeft: "0.5rem" }}>{aud.label}</span>}
                  </p>
                  <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", marginTop: "0.15rem" }}>
                    {[s.endTime ? `${s.time}–${s.endTime}` : s.time, s.location, s.note].filter(Boolean).join(" · ")}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <style>{`
        .week-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 1rem; }
        .week-day { padding: 1.25rem 1.4rem !important; }
      `}</style>
    </div>
  );
}
