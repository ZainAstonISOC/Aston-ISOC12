import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import DailyAyah from "@/components/quran/DailyAyah";
import { AYAT, AYAT_SOURCE, todaysAyah } from "@/lib/ayah";
import { londonDate } from "@/lib/quran/format";

export const metadata: Metadata = {
  title: "Daily Ayah",
  description: "One ayah of the Qur'an a day, with translation and recitation, chosen by the Aston ISOC committee.",
  alternates: { canonical: "/ayah" },
};

// Re-picked hourly on the server; the page also re-picks in the browser.
export const revalidate = 3600;

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default function AyahPage() {
  const date = londonDate();
  const { index } = todaysAyah(date);
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Daily Ayah" }]} />
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <p className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>Daily Ayah</p>
          <h1 style={{ fontFamily: PF, fontWeight: 600 }}>One ayah, every day</h1>
        </div>

        <DailyAyah ayat={AYAT} initialIndex={index} serverDate={date} />

        <div style={{ marginTop: "2.5rem", textAlign: "center", fontFamily: DM, fontSize: "0.84rem", color: "var(--muted-2)", lineHeight: 1.7 }}>
          <p>A new ayah each day, chosen by the committee. Open it once and it keeps working without a connection; a recitation you have played once does too.</p>
          <p style={{ marginTop: "0.6rem" }}>
            Text and translation from{" "}
            <a href="https://quran.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>quran.com</a>
            {" "}({AYAT_SOURCE.replace(/^quran\.com \(Quran Foundation\): /, "")}).
          </p>
        </div>
      </div>
    </PageShell>
  );
}
