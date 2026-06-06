"use client";
import { useEffect, useState } from "react";
import { PrayerTime } from "@/types";

const PRAYER_NAMES = ["Fajr","Sunrise","Dhuhr","Asr","Maghrib","Isha"];
const ARABIC = ["الفجر","الشروق","الظهر","العصر","المغرب","العشاء"];

function pad(n: number) { return String(n).padStart(2,"0"); }

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentPrayerIndex(times: PrayerTime[]): number {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  // Find next prayer (skip Sunrise as a prayer)
  const prayerOrder = times.filter(p => p.name !== "Sunrise");
  let nextIdx = prayerOrder.findIndex(p => timeToMinutes(p.time) > nowMins);
  // nextIdx -1 means all passed today — highlight Fajr (next day)
  if (nextIdx === -1) nextIdx = 0;
  // Map back to full array index
  const nextName = prayerOrder[nextIdx]?.name;
  return times.findIndex(p => p.name === nextName);
}

function getCountdown(nextTime: string): string {
  const now = new Date();
  const [h, m] = nextTime.split(":").map(Number);
  let target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const diff = target.getTime() - now.getTime();
  const hrs  = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1_000);
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

export default function PrayerTimesDisplay({ times }: { times: PrayerTime[] }) {
  const [nextIdx, setNextIdx]     = useState(() => getCurrentPrayerIndex(times));
  const [countdown, setCountdown] = useState(() => getCountdown(times.filter(p => p.name !== "Sunrise")[
    (() => { const now = new Date(); const nowMins = now.getHours()*60+now.getMinutes();
      const arr = times.filter(p=>p.name!=="Sunrise"); let i = arr.findIndex(p=>timeToMinutes(p.time)>nowMins);
      if(i===-1)i=0; return i; })()
  ]?.time ?? "00:00"));

  useEffect(() => {
    const tick = setInterval(() => {
      const idx = getCurrentPrayerIndex(times);
      setNextIdx(idx);
      const nextPrayer = times.filter(p => p.name !== "Sunrise")[
        (() => { const now = new Date(); const nowMins = now.getHours()*60+now.getMinutes();
          const arr = times.filter(p=>p.name!=="Sunrise"); let i = arr.findIndex(p=>timeToMinutes(p.time)>nowMins);
          if(i===-1)i=0; return i; })()
      ];
      if (nextPrayer) setCountdown(getCountdown(nextPrayer.time));
    }, 1000);
    return () => clearInterval(tick);
  }, [times]);

  const nextPrayer = times[nextIdx];

  return (
    <div className="prayer-board">
      {/* Top bar */}
      <div className="prayer-board__top">
        <div>
          <span className="pill live">Live · Birmingham</span>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "#8d86a3", marginTop: "0.5rem" }}>
            Auto-updates daily · Muslim World League method
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#8d86a3", marginBottom: "0.3rem" }}>
            Next prayer
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#d8af72", fontWeight: 600 }}>
            {nextPrayer?.name ?? "—"}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.35rem", color: "#fff", fontVariantNumeric: "tabular-nums", letterSpacing: "0.05em" }}>
            {countdown}
          </p>
        </div>
      </div>

      {/* Prayer grid */}
      <div className="prayer-grid">
        {times.map((p, i) => (
          <div
            key={p.name}
            className={`prayer-cell${i === nextIdx ? " next" : ""}`}
          >
            <div className="name">{p.name}</div>
            <div className="ar">{ARABIC[i]}</div>
            <div className="time">{p.time}</div>
            {p.iqamaTime && p.name !== "Sunrise" && (
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", color: i === nextIdx ? "rgba(216,175,114,0.7)" : "#6B6B80", marginTop: "0.3rem" }}>
                {p.iqamaTime}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
