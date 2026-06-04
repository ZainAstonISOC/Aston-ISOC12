"use client";
import { useState } from "react";
import { DONATIONS } from "@/lib/social";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const FREQUENCIES = [
  { id: "once",    label: "One-time",  description: "A single act of sadaqah" },
  { id: "weekly",  label: "Weekly",    description: "Jumu'ah giving — every Friday" },
  { id: "monthly", label: "Monthly",   description: "Sustain the community year-round" },
] as const;

const AMOUNTS: Record<string, number[]> = {
  once:    [5, 10, 20, 50],
  weekly:  [1, 3,  5, 10],
  monthly: [5, 10, 20, 50],
};

const IMPACT: Record<string, Record<number, string>> = {
  once:    { 5: "Covers printing costs for one event", 10: "Funds refreshments for a halaqa", 20: "Supports one charity collection bag", 50: "Sponsors part of a community iftaar" },
  weekly:  { 1: "£52/yr — consistent barakah every Jumu'ah", 3: "£156/yr — funds the weekly halaqa", 5: "£260/yr — sustains a full lecture series", 10: "£520/yr — transforms our annual programme" },
  monthly: { 5: "£60/yr — helps cover event admin costs", 10: "£120/yr — supports our charity campaigns", 20: "£240/yr — funds a major community event", 50: "£600/yr — sustains ISOC's full programme" },
};

export default function DonationWidget() {
  const [freq, setFreq] = useState<"once" | "weekly" | "monthly">("once");
  const [selected, setSelected] = useState<number | null>(10);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  const amount = custom ? parseFloat(custom) : selected;
  const impact = amount && IMPACT[freq]?.[amount as keyof typeof IMPACT[typeof freq]];

  // Stripe-ready handler — replace href with Stripe Checkout when keys are configured
  const handleDonate = async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);

    // ── STRIPE INTEGRATION POINT ─────────────────────────────────────────
    // When Stripe is configured, replace this block with:
    //
    // const res = await fetch("/api/create-checkout-session", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ amount, frequency: freq }),
    // });
    // const { url } = await res.json();
    // window.location.href = url;
    //
    // Until then, redirect to GoFundMe:
    window.open(DONATIONS.ramadanFundraiser, "_blank");
    setLoading(false);
  };

  return (
    <div className="p-8 sm:p-10 relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #131629 0%, #0D1025 100%)",
        border: "1px solid rgba(201,162,39,0.18)",
        borderRadius: "1.5rem",
      }}>
      <div className="absolute top-0 right-0 w-64 h-64 geo-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-lg">
        <p className="label mb-3">Support Aston ISOC</p>
        <h2 style={{ fontFamily: PF, fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>
          Choose Your Giving
        </h2>
        <span className="gold-rule" />

        {/* Frequency */}
        <div className="flex gap-1 mb-8 p-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "0.625rem", display: "inline-flex" }}>
          {FREQUENCIES.map((f) => (
            <button key={f.id}
              onClick={() => { setFreq(f.id); setSelected(AMOUNTS[f.id][1]); setCustom(""); }}
              className="px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200"
              style={{
                fontFamily: DM,
                background: freq === f.id ? "var(--gold)" : "transparent",
                color: freq === f.id ? "#0D1025" : "#A8A8B3",
                borderRadius: "0.4rem", border: "none", cursor: "pointer",
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Frequency description */}
        <p className="text-xs mb-5 -mt-4" style={{ color: "#6B6B80", fontFamily: DM }}>
          {FREQUENCIES.find((f) => f.id === freq)?.description}
        </p>

        {/* Amount grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {AMOUNTS[freq].map((amt) => (
            <button key={amt}
              onClick={() => { setSelected(amt); setCustom(""); }}
              className="donation-opt"
              style={{
                fontFamily: PF, fontSize: "1.3rem", fontWeight: 500,
                color: selected === amt && !custom ? "#C9A227" : "#EAEAEA",
                borderColor: selected === amt && !custom ? "rgba(201,162,39,0.55)" : "rgba(201,162,39,0.13)",
                background: selected === amt && !custom ? "rgba(201,162,39,0.1)" : "#131629",
                boxShadow: selected === amt && !custom ? "0 0 20px rgba(201,162,39,0.12)" : "none",
              }}>
              £{amt}
            </button>
          ))}
        </div>

        {/* Custom */}
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#6B6B80", fontFamily: DM }}>£</span>
          <input type="number" placeholder="Custom amount" value={custom}
            onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
            className="field pl-8" style={{ borderRadius: "0.625rem" }} min="1"/>
        </div>

        {/* Impact message */}
        {impact && (
          <p className="mb-6 text-xs" style={{ color: "#C9A227", fontFamily: DM, opacity: 0.8 }}>
            ✦ {impact}
          </p>
        )}

        {/* CTA */}
        <div className="flex items-center gap-4 flex-wrap">
          <button onClick={handleDonate} disabled={!amount || amount <= 0 || loading}
            className="btn-gold" style={{ fontSize: "0.75rem", opacity: !amount || amount <= 0 ? 0.5 : 1 }}>
            {loading ? "Redirecting..." : amount && amount > 0
              ? `Donate £${amount}${freq !== "once" ? `/${freq === "weekly" ? "wk" : "mo"}` : ""}`
              : "Select an amount"}
          </button>
          <p className="text-xs" style={{ color: "#6B6B80", fontFamily: DM }}>
            Secure · JazakAllah khayran
          </p>
        </div>

        {freq !== "once" && (
          <p className="mt-4 text-xs" style={{ color: "#4B4B60", fontFamily: DM }}>
            Voluntary — cancel at any time. Consistent giving sustains our community year-round.
          </p>
        )}
      </div>
    </div>
  );
}
