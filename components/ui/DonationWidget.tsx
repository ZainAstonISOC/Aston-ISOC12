"use client";
import { useState } from "react";
import { DONATIONS } from "@/lib/social";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const FREQUENCIES = [
  { id: "once", label: "One-time" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
] as const;

const AMOUNTS: Record<string, number[]> = {
  once:    [5, 10, 20, 50],
  weekly:  [1, 3, 5, 10],
  monthly: [5, 10, 20, 50],
};

export default function DonationWidget() {
  const [freq, setFreq] = useState<"once" | "weekly" | "monthly">("once");
  const [selected, setSelected] = useState<number | null>(10);
  const [custom, setCustom] = useState("");

  const amount = custom ? parseFloat(custom) : selected;
  const donationUrl = DONATIONS.ramadanFundraiser;

  const freqLabel: Record<string, string> = {
    once: "one-time donation",
    weekly: "per week",
    monthly: "per month",
  };

  return (
    <div className="p-8 sm:p-10 relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #131629 0%, #0D1025 100%)",
        border: "1px solid rgba(201,162,39,0.18)",
        borderRadius: "1.5rem",
        marginBottom: "0",
      }}>
      <div className="absolute top-0 right-0 w-64 h-64 geo-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-lg">
        <p className="label mb-3">Donate to Aston ISOC</p>
        <h2 style={{ fontFamily: PF, fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 500, color: "#fff", marginBottom: "0.5rem" }}>
          Choose Your Giving
        </h2>
        <span className="gold-rule" />

        {/* Frequency selector */}
        <div className="flex gap-1 mb-7 p-1 inline-flex"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,162,39,0.1)", borderRadius: "0.625rem" }}>
          {FREQUENCIES.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFreq(f.id); setSelected(AMOUNTS[f.id][1]); setCustom(""); }}
              className="px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200"
              style={{
                fontFamily: DM,
                background: freq === f.id ? "var(--gold)" : "transparent",
                color: freq === f.id ? "#0D1025" : "#A8A8B3",
                borderRadius: "0.4rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Amount grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {AMOUNTS[freq].map((amt) => (
            <button
              key={amt}
              onClick={() => { setSelected(amt); setCustom(""); }}
              className="donation-opt"
              style={{
                fontFamily: PF,
                fontSize: "1.3rem",
                fontWeight: 500,
                color: selected === amt && !custom ? "#C9A227" : "#EAEAEA",
                borderColor: selected === amt && !custom ? "rgba(201,162,39,0.55)" : "rgba(201,162,39,0.13)",
                background: selected === amt && !custom ? "rgba(201,162,39,0.1)" : "#131629",
                boxShadow: selected === amt && !custom ? "0 0 20px rgba(201,162,39,0.12)" : "none",
              }}
            >
              £{amt}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="relative mb-7">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#6B6B80", fontFamily: DM }}>£</span>
          <input
            type="number"
            placeholder="Custom amount"
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
            className="field pl-8"
            style={{ borderRadius: "0.625rem" }}
            min="1"
          />
        </div>

        {/* Summary + CTA */}
        <div className="flex items-center gap-4 flex-wrap">
          {amount && amount > 0 ? (
            <a
              href={donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ fontSize: "0.75rem" }}
            >
              Donate £{amount} {freqLabel[freq]} →
            </a>
          ) : (
            <button className="btn-gold opacity-50 cursor-not-allowed" disabled style={{ fontSize: "0.75rem" }}>
              Select an amount
            </button>
          )}
          <p className="text-xs" style={{ color: "#6B6B80", fontFamily: DM }}>
            Secure via GoFundMe · JazakAllah khayran
          </p>
        </div>

        {freq !== "once" && (
          <p className="mt-4 text-xs" style={{ color: "#4B4B60", fontFamily: DM }}>
            Voluntary — cancel at any time. Ongoing giving helps ISOC plan and sustain community programmes year-round.
          </p>
        )}
      </div>
    </div>
  );
}
