"use client";
import { useState } from "react";
import { DONATIONS } from "@/lib/social";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

type Frequency = "once" | "weekly" | "monthly";

const TABS: { id: Frequency; label: string; sub: string }[] = [
  { id: "once",    label: "One-time",  sub: "A single act of sadaqah" },
  { id: "weekly",  label: "Weekly",    sub: "Jumu'ah giving every Friday" },
  { id: "monthly", label: "Monthly",   sub: "Sustain the community year-round" },
];

const AMOUNTS: Record<Frequency, number[]> = {
  once:    [5, 10, 20, 50],
  weekly:  [1,  3,  5, 10],
  monthly: [5, 10, 20, 50],
};

const IMPACT: Record<Frequency, Record<number, string>> = {
  once: {
    5:  "Covers printing costs for one event",
    10: "Funds refreshments for a halaqa session",
    20: "Supports one charity collection drive",
    50: "Sponsors part of a community iftaar",
  },
  weekly: {
    1:  "£52/yr — consistent barakah every Jumu'ah",
    3:  "£156/yr — funds the weekly halaqa sessions",
    5:  "£260/yr — sustains a full lecture series",
    10: "£520/yr — transforms our annual programme",
  },
  monthly: {
    5:  "£60/yr — covers event admin & printing costs",
    10: "£120/yr — supports our charity campaigns",
    20: "£240/yr — funds a major community event",
    50: "£600/yr — sustains ISOC's full programme",
  },
};

export default function DonationWidget() {
  const [freq, setFreq]       = useState<Frequency>("once");
  const [selected, setSelected] = useState<number | null>(10);
  const [custom, setCustom]   = useState("");
  const [loading, setLoading] = useState(false);

  const amount = custom ? parseFloat(custom) : selected;
  const impact = amount ? IMPACT[freq]?.[amount as keyof (typeof IMPACT)[Frequency]] : null;
  const isValid = !!amount && amount > 0;

  const freqSuffix: Record<Frequency, string> = {
    once: "", weekly: "/wk", monthly: "/mo",
  };

  const handleDonate = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, frequency: freq }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Stripe not yet configured — fall back to GoFundMe
        window.open(DONATIONS.ramadanFundraiser, "_blank");
      }
    } catch {
      window.open(DONATIONS.ramadanFundraiser, "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(160deg, #131629 0%, #0D1025 100%)",
      border: "1px solid rgba(201,162,39,0.18)",
      borderRadius: "var(--radius-xl)",
      padding: "clamp(2rem, 5vw, 3.5rem)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div className="absolute top-0 right-0 w-64 h-64 geo-pattern opacity-20 pointer-events-none" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 540 }}>
        <p className="label">Support Aston ISOC</p>
        <h2 style={{ fontFamily: PF, fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>
          Choose Your Giving
        </h2>
        <span className="gold-rule" />

        {/* ── Frequency tabs ── */}
        <div style={{
          display: "flex",
          gap: "0.25rem",
          padding: "0.3rem",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(201,162,39,0.1)",
          borderRadius: "var(--radius-md)",
          marginBottom: "0.75rem",
          width: "fit-content",
        }}>
          {TABS.map((t) => (
            <button key={t.id}
              onClick={() => { setFreq(t.id); setSelected(AMOUNTS[t.id][1]); setCustom(""); }}
              style={{
                fontFamily: DM,
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.6rem 1.4rem",
                background: freq === t.id ? "var(--gold)" : "transparent",
                color: freq === t.id ? "var(--bg-deep)" : "var(--text-muted)",
                borderRadius: "calc(var(--radius-md) - 2px)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.18s ease",
                whiteSpace: "nowrap",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab description */}
        <p style={{ fontFamily: DM, fontSize: "0.8rem", color: "var(--text-dim)", marginBottom: "1.75rem" }}>
          {TABS.find((t) => t.id === freq)?.sub}
        </p>

        {/* ── Amount grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.625rem", marginBottom: "0.875rem" }}>
          {AMOUNTS[freq].map((amt) => {
            const isActive = selected === amt && !custom;
            return (
              <button key={amt}
                onClick={() => { setSelected(amt); setCustom(""); }}
                className="donation-opt"
                style={{
                  fontFamily: PF,
                  fontSize: "1.35rem",
                  fontWeight: 500,
                  color: isActive ? "var(--gold)" : "var(--text-primary)",
                  borderColor: isActive ? "rgba(201,162,39,0.55)" : "var(--border)",
                  background: isActive ? "rgba(201,162,39,0.1)" : "var(--bg-card)",
                  boxShadow: isActive ? "0 0 20px rgba(201,162,39,0.12)" : "none",
                }}>
                £{amt}
              </button>
            );
          })}
        </div>

        {/* ── Custom amount ── */}
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontFamily: DM, fontSize: "0.9rem" }}>£</span>
          <input
            type="number"
            placeholder="Custom amount"
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
            className="field"
            style={{ paddingLeft: "2rem" }}
            min="1"
          />
        </div>

        {/* ── Impact message ── */}
        <div style={{ minHeight: "1.5rem", marginBottom: "1.75rem" }}>
          {impact && (
            <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "var(--gold)", opacity: 0.85 }}>
              ✦ {impact}
            </p>
          )}
        </div>

        {/* ── CTA ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
          <button
            onClick={handleDonate}
            disabled={!isValid || loading}
            className="btn-gold"
            style={{ opacity: !isValid ? 0.45 : 1, cursor: !isValid ? "not-allowed" : "pointer" }}
          >
            {loading
              ? "Redirecting…"
              : isValid
                ? `Donate £${amount}${freqSuffix[freq]}`
                : "Select an amount"}
          </button>
          <p style={{ fontFamily: DM, fontSize: "0.75rem", color: "var(--text-dim)" }}>
            Secure · 100% goes to ISOC
          </p>
        </div>

        {freq !== "once" && (
          <p style={{ fontFamily: DM, fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "1rem" }}>
            Voluntary — cancel at any time. Consistent giving sustains our community year-round.
          </p>
        )}
      </div>
    </div>
  );
}
