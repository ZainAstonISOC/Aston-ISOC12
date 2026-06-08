"use client";
import { useState } from "react";

const STRIPE_LINK = "https://buy.stripe.com/eVq00beyY1f6gkygwOffy00";

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
  once:    { 5: "Covers printing costs for one event", 10: "Funds refreshments for a halaqa session", 20: "Supports one charity collection drive", 50: "Sponsors part of a community iftaar" },
  weekly:  { 1: "52/yr in consistent barakah every Jumu'ah", 3: "156/yr funding the weekly halaqa sessions", 5: "260/yr sustaining a full lecture series", 10: "520/yr transforming our annual programme" },
  monthly: { 5: "60/yr covering event admin and printing", 10: "120/yr supporting charity campaigns", 20: "240/yr funding a major community event", 50: "600/yr sustaining ISOC full programme" },
};

export default function DonationWidget() {
  const [freq, setFreq]         = useState<Frequency>("once");
  const [selected, setSelected] = useState<number | null>(10);
  const [custom, setCustom]     = useState("");

  const amount  = custom ? parseFloat(custom) : selected;
  const impact  = amount ? IMPACT[freq]?.[amount as keyof (typeof IMPACT)[Frequency]] : null;
  const isValid = !!amount && amount > 0;

  const freqSuffix: Record<Frequency, string> = { once: "", weekly: "/wk", monthly: "/mo" };

  // Stripe Payment Link direct redirect, no backend needed
  const handleDonate = () => {
    if (!isValid) return;
    window.open(STRIPE_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--line-soft)",
      borderRadius: "var(--radius)",
      padding: "clamp(2rem,5vw,3rem)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
        <p className="eyebrow">Support Aston ISOC</p>
        <h2 style={{ fontFamily: PF, fontWeight: 600, marginBottom: "0.5rem" }}>Choose Your Giving</h2>
        <div className="gold-rule" />

        {/* Frequency tabs */}
        <div style={{
          display: "inline-flex", gap: "0.25rem", padding: "0.3rem",
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(216,175,114,0.12)",
          borderRadius: "999px", marginBottom: "0.6rem",
        }}>
          {TABS.map(t => (
            <button key={t.id}
              onClick={() => { setFreq(t.id); setSelected(AMOUNTS[t.id][1]); setCustom(""); }}
              style={{
                fontFamily: DM, fontSize: "0.78rem", fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "0.55rem 1.1rem",
                background: freq === t.id ? "var(--gold)" : "transparent",
                color: freq === t.id ? "#1a1230" : "var(--muted)",
                borderRadius: "999px", border: "none", cursor: "pointer",
                transition: "all 0.18s",
                whiteSpace: "nowrap",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", marginBottom: "1.5rem" }}>
          {TABS.find(t => t.id === freq)?.sub}
        </p>

        {/* Amount grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.6rem", marginBottom: "0.8rem" }}>
          {AMOUNTS[freq].map(amt => {
            const isActive = selected === amt && !custom;
            return (
              <button key={amt}
                onClick={() => { setSelected(amt); setCustom(""); }}
                style={{
                  fontFamily: PF, fontSize: "1.4rem", fontWeight: 500,
                  padding: "1.1rem 0.5rem", textAlign: "center",
                  background: isActive ? "rgba(216,175,114,0.12)" : "var(--surface)",
                  border: `1px solid ${isActive ? "var(--gold)" : "var(--line-soft)"}`,
                  borderRadius: "var(--radius-sm)",
                  color: isActive ? "var(--gold)" : "var(--text)",
                  boxShadow: isActive ? "0 0 20px rgba(216,175,114,0.15)" : "none",
                  cursor: "pointer", transition: "all 0.18s",
                }}>
                £{amt}
              </button>
            );
          })}
        </div>

        {/* Custom amount */}
        <div style={{ position: "relative", marginBottom: "0.75rem" }}>
          <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)", fontFamily: DM }}>£</span>
          <input type="number" placeholder="Custom amount" value={custom}
            onChange={e => { setCustom(e.target.value); setSelected(null); }}
            className="field" style={{ paddingLeft: "2rem" }} min="1" />
        </div>

        {/* Impact */}
        <div style={{ minHeight: "1.5rem", marginBottom: "1.5rem" }}>
          {impact && (
            <p style={{ fontFamily: DM, fontSize: "0.8rem", color: "var(--gold)", opacity: 0.85 }}>
              Your £{amount} {freq === "once" ? "donation" : freq === "weekly" ? "weekly" : "monthly"} contribution: {impact}
            </p>
          )}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
          <button onClick={handleDonate} disabled={!isValid}
            className="btn btn-gold btn-lg"
            style={{ opacity: !isValid ? 0.45 : 1, cursor: !isValid ? "not-allowed" : "pointer" }}>
            {isValid ? `Donate £${amount}${freqSuffix[freq]}` : "Select an amount"}
          </button>
          <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "var(--muted-2)" }}>
            Secure via Stripe
          </p>
        </div>

        {freq !== "once" && (
          <p style={{ fontFamily: DM, fontSize: "0.75rem", color: "var(--muted-2)", marginTop: "0.85rem" }}>
            Voluntary and cancellable at any time. Consistent giving sustains our community year-round.
          </p>
        )}
      </div>
    </div>
  );
}
