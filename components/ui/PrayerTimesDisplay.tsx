"use client";
import { useSyncExternalStore } from "react";
import { PrayerTime } from "@/types";
import { PRAYER_LINKS } from "@/lib/social";

const ARABIC = ["الفجر","الشروق","الظهر","العصر","المغرب","العشاء"];
const DM = "'DM Sans', sans-serif";

function pad(n: number) { return String(n).padStart(2, "0"); }

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

const londonClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/**
 * Seconds since midnight in Birmingham. The times on the board are London
 * times, so the countdown must be too — a visitor's phone set to another
 * timezone used to get a countdown hours out.
 */
function londonSeconds(ms: number): number {
  const [h, m, s] = londonClock.format(ms).split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

// A one-second clock shared by every board on the page. The server snapshot is
// null, so the first client render matches the server and the countdown
// appears straight after hydration.
function subscribe(cb: () => void) {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
}
const getSecond = () => Math.floor(Date.now() / 1000);
const getServerSecond = () => null;

export default function PrayerTimesDisplay({ times }: { times: PrayerTime[] | null }) {
  const second = useSyncExternalStore(subscribe, getSecond, getServerSecond);

  if (!times) {
    return (
      <div className="prayer-board" style={{ textAlign: "center" }}>
        <p style={{ fontFamily: DM, color: "var(--muted)", lineHeight: 1.7 }}>
          Today&apos;s prayer times couldn&apos;t load just now.
        </p>
        <a href={PRAYER_LINKS.liveWidget} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold" style={{ marginTop: "1rem" }}>
          See the prayer room timetable
        </a>
      </div>
    );
  }

  // Next prayer (Sunrise is shown but is not a prayer). After Isha it is Fajr.
  const prayers = times.filter(p => p.name !== "Sunrise");
  let next: PrayerTime | undefined;
  let countdown = "--:--:--";
  if (second !== null) {
    const now = londonSeconds(second * 1000);
    next = prayers.find(p => timeToMinutes(p.time) * 60 > now) ?? prayers[0];
    const diff = (timeToMinutes(next.time) * 60 - now + 86_400) % 86_400;
    countdown = `${pad(Math.floor(diff / 3600))}:${pad(Math.floor((diff % 3600) / 60))}:${pad(diff % 60)}`;
  }

  return (
    <div className="prayer-board">
      {/* Top bar */}
      <div className="prayer-board__top">
        <div>
          <span className="pill live">Live · Birmingham</span>
          <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", marginTop: "0.5rem" }}>
            Start times · Moonsighting Committee method
          </p>
        </div>
        <div className="prayer-board__next">
          <p style={{ fontFamily: DM, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted-2)", marginBottom: "0.3rem" }}>
            Next prayer
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#d8af72", fontWeight: 600 }}>
            {next?.name ?? " "}
          </p>
          <p style={{ fontFamily: DM, fontSize: "1.35rem", color: "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: "0.05em" }}>
            {countdown}
          </p>
        </div>
      </div>

      {/* Prayer grid */}
      <div className="prayer-grid">
        {times.map((p, i) => (
          <div key={p.name} className={`prayer-cell${p === next ? " next" : ""}`}>
            <div className="name">{p.name}</div>
            <div className="ar">{ARABIC[i]}</div>
            <div className="time">{p.time}</div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", textAlign: "center", marginTop: "1.1rem" }}>
        Jamaat times are set by the prayer room:{" "}
        <a href={PRAYER_LINKS.liveWidget} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
          see today&apos;s jamaat times
        </a>
      </p>
    </div>
  );
}
