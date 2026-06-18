"use client";
import { useState } from "react";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const ZAKAT_RATE = 0.025;

// Nisab reference values (approximate, users should verify current rates)
// Gold nisab: 87.48g, Silver nisab: 612.36g
const FIELDS = [
  { id: "cash",        label: "Cash & Savings",     hint: "Bank accounts, cash in hand, digital wallets" },
  { id: "gold",        label: "Gold (value)",        hint: "Market value of gold you own" },
  { id: "silver",      label: "Silver (value)",      hint: "Market value of silver you own" },
  { id: "investments", label: "Investments",         hint: "Shares, funds, crypto, pensions you can access" },
  { id: "business",    label: "Business Assets",     hint: "Stock, receivables, cash held in business" },
] as const;

type FieldId = typeof FIELDS[number]["id"];

export default function ZakatCalculator() {
  const [values, setValues] = useState<Record<FieldId, string>>({
    cash: "", gold: "", silver: "", investments: "", business: "",
  });
  const [liabilities, setLiabilities] = useState("");

  const num = (v: string) => {
    const n = parseFloat(v);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  const totalAssets = FIELDS.reduce((sum, f) => sum + num(values[f.id]), 0);
  const totalLiabilities = num(liabilities);
  const netWealth = Math.max(0, totalAssets - totalLiabilities);
  const zakatDue = netWealth * ZAKAT_RATE;

  const fmt = (n: number) =>
    n.toLocaleString("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", maxWidth: 880 }}>
      <div className="zakat-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "2rem", alignItems: "start" }}>

        {/* Inputs */}
        <div>
          <div className="card">
            <p className="eyebrow">Your Assets</p>
            <h2 style={{ fontFamily: PF, fontSize: "1.3rem", fontWeight: 500, color: "#fff", marginBottom: "1.5rem" }}>What You Own</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {FIELDS.map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} style={{ fontFamily: DM, fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "0.35rem" }}>
                    {f.label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)", fontFamily: DM }}>£</span>
                    <input
                      id={f.id} type="number" inputMode="decimal" min="0" placeholder="0.00"
                      value={values[f.id]}
                      onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}
                      className="field" style={{ paddingLeft: "2rem" }}
                    />
                  </div>
                  <p style={{ fontFamily: DM, fontSize: "0.72rem", color: "var(--muted-2)", marginTop: "0.3rem" }}>{f.hint}</p>
                </div>
              ))}
            </div>

            <div style={{ height: "1px", background: "rgba(216,175,114,0.12)", margin: "1.75rem 0" }} />

            <div>
              <label htmlFor="liabilities" style={{ fontFamily: DM, fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", display: "block", marginBottom: "0.35rem" }}>
                Liabilities & Debts
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)", fontFamily: DM }}>£</span>
                <input
                  id="liabilities" type="number" inputMode="decimal" min="0" placeholder="0.00"
                  value={liabilities}
                  onChange={e => setLiabilities(e.target.value)}
                  className="field" style={{ paddingLeft: "2rem" }}
                />
              </div>
              <p style={{ fontFamily: DM, fontSize: "0.72rem", color: "var(--muted-2)", marginTop: "0.3rem" }}>
                Immediate debts due, e.g. rent owed, bills, short-term loans
              </p>
            </div>
          </div>
        </div>

        {/* Result */}
        <div style={{ position: "sticky", top: "5.5rem" }}>
          <div className="card" style={{ background: "rgba(216,175,114,0.05)", border: "1px solid rgba(216,175,114,0.25)" }}>
            <p className="eyebrow">Your Zakat</p>
            <h2 style={{ fontFamily: PF, fontSize: "1.3rem", fontWeight: 500, color: "#fff", marginBottom: "1.5rem" }}>Summary</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
              <Row label="Total assets" value={fmt(totalAssets)} />
              <Row label="Less liabilities" value={`− ${fmt(totalLiabilities)}`} />
              <div style={{ height: "1px", background: "rgba(216,175,114,0.15)" }} />
              <Row label="Net zakatable wealth" value={fmt(netWealth)} bold />
            </div>

            <div style={{
              background: "rgba(216,175,114,0.1)", border: "1px solid rgba(216,175,114,0.3)",
              borderRadius: "var(--radius-sm)", padding: "1.5rem", textAlign: "center",
            }}>
              <p style={{ fontFamily: DM, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d8af72", marginBottom: "0.5rem" }}>
                Zakat Due (2.5%)
              </p>
              <p style={{ fontFamily: PF, fontSize: "2.4rem", fontWeight: 600, color: "#d8af72", lineHeight: 1 }}>
                {fmt(zakatDue)}
              </p>
            </div>

            <a href="/donate" className="btn btn-gold" style={{ width: "100%", justifyContent: "center", textAlign: "center", marginTop: "1.25rem" }}>
              Give Your Zakat
            </a>
          </div>
        </div>
      </div>

      {/* Methodology + disclaimer */}
      <div className="card">
        <p className="eyebrow">Methodology</p>
        <h3 style={{ fontFamily: PF, fontSize: "1.2rem", fontWeight: 500, color: "#fff", marginBottom: "1rem" }}>How Zakat Is Calculated</h3>
        <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: "1rem" }}>
          Zakat is due at 2.5% on your net zakatable wealth, provided it has been held for one full lunar year (hawl) and is above the nisab threshold. Add up all your zakatable assets (cash, the value of gold and silver, accessible investments, and business assets), then subtract immediate liabilities. Zakat is 2.5% of the remaining net amount.
        </p>
        <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: "1rem" }}>
          The nisab is the minimum amount of wealth a Muslim must hold before Zakat becomes obligatory. It is set at the value of 87.48g of gold or 612.36g of silver. Most scholars recommend using the silver value so that more is given in charity. If your net wealth is below nisab, no Zakat is due.
        </p>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-sm)", padding: "1.1rem 1.25rem", marginTop: "0.5rem" }}>
          <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--muted)" }}>Disclaimer:</strong> This calculator provides an estimate for general guidance only and does not constitute religious or financial advice. Zakat rulings can vary by school of thought and individual circumstance. Please verify the current nisab value and consult a qualified scholar or a trusted Zakat body such as the National Zakat Foundation for a definitive calculation.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .zakat-grid { grid-template-columns: 1fr !important; }
          .zakat-grid > div:last-child { position: static !important; }
        }
      `}</style>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
      <span style={{ fontFamily: DM, fontSize: "0.88rem", color: bold ? "#fff" : "var(--muted)", fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span style={{ fontFamily: DM, fontSize: bold ? "1rem" : "0.9rem", color: bold ? "#fff" : "var(--muted)", fontWeight: bold ? 700 : 500, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}
