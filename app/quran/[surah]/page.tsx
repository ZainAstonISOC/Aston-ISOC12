import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ReaderProvider from "@/components/quran/ReaderProvider";
import Verse from "@/components/quran/Verse";
import { quranFont } from "@/lib/quran/font";
import { SURAH_COUNT, listChapters, loadChapter, loadSurah, parseSurah, revelationLabel } from "@/lib/quran/reader";

// Built on first visit, then served from cache: the text never changes.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ surah: string }> }): Promise<Metadata> {
  const n = parseSurah((await params).surah);
  if (!n) return { title: "Surah not found" };
  const c = await loadChapter(n);
  return {
    title: `Surah ${c.name_simple} (${c.translated_name.name})`,
    description: `Read Surah ${c.name_simple}, ${c.verses_count} ayat, in Arabic with English translation, recitation and Tafsir Ibn Kathir.`,
    alternates: { canonical: `/quran/${n}` },
  };
}

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default async function SurahPage({ params }: { params: Promise<{ surah: string }> }) {
  const n = parseSurah((await params).surah);
  if (!n) notFound();
  const [{ chapter, verses, audio, bismillah }, chapters] = await Promise.all([loadSurah(n), listChapters()]);
  const prev = n > 1 ? chapters[n - 2] : null;
  const next = n < SURAH_COUNT ? chapters[n] : null;

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Qur'an", href: "/quran" }, { label: chapter.name_simple }]} />
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>
            Surah {n} · {revelationLabel(chapter.revelation_place)} · {chapter.verses_count} ayat
          </p>
          <h1 style={{ fontFamily: PF, fontWeight: 600 }}>{chapter.name_simple}</h1>
          <p style={{ fontFamily: DM, color: "var(--muted)", marginTop: "0.3rem" }}>{chapter.translated_name.name}</p>
          <p lang="ar" dir="rtl" className={quranFont.className} style={{ fontSize: "2.2rem", color: "var(--gold-soft)", marginTop: "0.5rem" }}>
            {chapter.name_arabic}
          </p>
        </header>

        <ReaderProvider surah={n} surahName={chapter.name_simple} verseKeys={verses.map((v) => v.key)} defaultAudio={audio}>
          {bismillah && (
            <p lang="ar" dir="rtl" className={`quran-ar ${quranFont.className}`} style={{ textAlign: "center", fontSize: "clamp(1.6rem,4vw,2.2rem)", color: "var(--gold-soft)", margin: "0.5rem 0 1rem" }}>
              {bismillah}
            </p>
          )}
          {verses.map((v) => (
            <Verse key={v.key} verse={v} />
          ))}
        </ReaderProvider>

        <nav aria-label="Surahs" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem" }}>
          {prev ? (
            <Link href={`/quran/${prev.id}`} className="btn btn-ghost">← {prev.id}. {prev.name_simple}</Link>
          ) : <span />}
          <Link href="/quran" className="btn btn-ghost">All surahs</Link>
          {next ? (
            <Link href={`/quran/${next.id}`} className="btn btn-ghost">{next.id}. {next.name_simple} →</Link>
          ) : <span />}
        </nav>
        <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "var(--muted-2)", textAlign: "center", marginTop: "2rem" }}>
          Text, translations, recitation and tafsir from{" "}
          <a href="https://quran.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>quran.com</a>.
        </p>
      </div>
    </PageShell>
  );
}
