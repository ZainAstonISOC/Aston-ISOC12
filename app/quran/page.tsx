import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SurahIndex from "@/components/quran/SurahIndex";
import { listChapters, revelationLabel } from "@/lib/quran/reader";

export const metadata: Metadata = {
  title: "Read the Qur'an",
  description: "Read the Qur'an with Saheeh International and Abdel Haleem translations, ayah-by-ayah recitation and Tafsir Ibn Kathir.",
  alternates: { canonical: "/quran" },
};

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default async function QuranIndexPage() {
  const chapters = await listChapters();
  const surahs = chapters.map((c) => ({
    id: c.id,
    name: c.name_simple,
    arabic: c.name_arabic,
    meaning: c.translated_name.name,
    verses: c.verses_count,
    place: revelationLabel(c.revelation_place),
  }));
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Qur'an" }]} />
      <div style={{ maxWidth: 680, marginBottom: "2.5rem" }}>
        <p className="eyebrow">Learn</p>
        <h1 style={{ fontFamily: PF, fontWeight: 600 }}>Read the Qur&apos;an</h1>
        <div className="gold-rule" />
        <p className="lede" style={{ color: "var(--muted)", fontFamily: DM }}>
          Every surah with the Arabic, an English translation, recitation ayah by ayah, and Tafsir Ibn Kathir a tap away.
        </p>
      </div>
      <SurahIndex surahs={surahs} />
      <p style={{ fontFamily: DM, fontSize: "0.8rem", color: "var(--muted-2)", marginTop: "2.5rem" }}>
        Text, translations, recitations and tafsir from{" "}
        <a href="https://quran.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>quran.com</a> (Quran Foundation).
      </p>
    </PageShell>
  );
}
