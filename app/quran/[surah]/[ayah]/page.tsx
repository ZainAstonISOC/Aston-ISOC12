import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AyahText from "@/components/quran/AyahText";
import ListenButton from "@/components/quran/ListenButton";
import { loadChapter, loadSurah, loadTafsir, parseAyahRange, parseSurah } from "@/lib/quran/reader";
import { formatRef } from "@/lib/quran/format";

/**
 * A shareable page for one ayah or a short passage (/quran/2/255,
 * /quran/94/5-6): the text, both translations, recitation and the full Ibn
 * Kathir commentary, with its own link-preview card.
 */
export async function generateStaticParams() {
  return [];
}

async function resolve(params: Promise<{ surah: string; ayah: string }>) {
  const p = await params;
  const surah = parseSurah(p.surah);
  if (!surah) return null;
  const chapter = await loadChapter(surah);
  const range = parseAyahRange(p.ayah, chapter.verses_count);
  if (!range) return null;
  return { surah, chapter, from: range[0], to: range[1], ref: `${surah}:${range[0]}${range[1] > range[0] ? `-${range[1]}` : ""}` };
}

export async function generateMetadata({ params }: { params: Promise<{ surah: string; ayah: string }> }): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return { title: "Ayah not found" };
  const { verses } = await loadSurah(r.surah);
  const text = verses.slice(r.from - 1, r.to).map((v) => v.sahih).join(" ");
  return {
    title: `${r.chapter.name_simple} ${r.ref.replace("-", "–")}`,
    description: text.length > 200 ? `${text.slice(0, 197)}…` : text,
    alternates: { canonical: `/quran/${r.surah}/${r.from}${r.to > r.from ? `-${r.to}` : ""}` },
  };
}

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

export default async function AyahPage({ params }: { params: Promise<{ surah: string; ayah: string }> }) {
  const r = await resolve(params);
  if (!r) notFound();
  const [{ verses, audio }, tafsir] = await Promise.all([loadSurah(r.surah), loadTafsir(r.surah, r.from, r.to)]);
  const passage = verses.slice(r.from - 1, r.to);
  const tracks = passage.map((v, i) => ({ key: v.key, url: audio[r.from - 1 + i] })).filter((t) => t.url);
  const { chapter } = r;
  const prev = r.from > 1 ? r.from - 1 : null;
  const next = r.to < chapter.verses_count ? r.to + 1 : null;

  return (
    <PageShell>
      <Breadcrumb
        crumbs={[
          { label: "Qur'an", href: "/quran" },
          { label: chapter.name_simple, href: `/quran/${r.surah}` },
          { label: r.ref.split(":")[1].replace("-", "–") },
        ]}
      />
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="eyebrow" style={{ justifyContent: "center", display: "flex" }}>Surah {chapter.name_simple}</p>
          <h1 style={{ fontFamily: PF, fontWeight: 600 }}>{formatRef(r.ref)}</h1>
        </div>

        <article className="ayah-card">
          <AyahText verses={passage} />
          <div style={{ marginTop: "1.6rem" }}>
            <p className="ayah-translation" style={{ textAlign: "center" }}>{passage.map((v) => v.sahih).join(" ")}</p>
            <p style={{ fontFamily: DM, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-2)", textAlign: "center", marginTop: "0.4rem" }}>Saheeh International</p>
            <p className="ayah-translation" style={{ textAlign: "center", marginTop: "1.2rem" }}>{passage.map((v) => v.haleem).join(" ")}</p>
            <p style={{ fontFamily: DM, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-2)", textAlign: "center", marginTop: "0.4rem" }}>Abdel Haleem</p>
          </div>
        </article>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", alignItems: "flex-start", marginTop: "1.5rem" }}>
          <ListenButton tracks={tracks} />
          <Link href={`/quran/${r.surah}#ayah-${r.from}`} className="btn btn-ghost">Read in context</Link>
        </div>

        <section style={{ marginTop: "3rem" }} aria-labelledby="tafsir-heading">
          <p className="eyebrow">Tafsir Ibn Kathir (abridged)</p>
          <h2 id="tafsir-heading" style={{ fontFamily: PF, fontSize: "clamp(1.4rem,3vw,1.8rem)", marginBottom: "1rem" }}>Explanation</h2>
          {tafsir.map((t) => (
            <div key={t.verseKeys[0]} style={{ marginBottom: "2rem" }}>
              {(tafsir.length > 1 || t.verseKeys.length > 1) && (
                <p style={{ fontFamily: DM, fontSize: "0.8rem", fontWeight: 600, color: "var(--gold)", marginBottom: "0.5rem" }}>
                  On {t.verseKeys.length > 1 ? `${t.verseKeys[0]}–${t.verseKeys[t.verseKeys.length - 1].split(":")[1]}` : t.verseKeys[0]}
                </p>
              )}
              <div className="tafsir-body" dangerouslySetInnerHTML={{ __html: t.html }} />
            </div>
          ))}
        </section>

        <nav aria-label="Ayat" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginTop: "2rem" }}>
          {prev ? <Link href={`/quran/${r.surah}/${prev}`} className="btn btn-ghost">← Ayah {prev}</Link> : <span />}
          {next ? <Link href={`/quran/${r.surah}/${next}`} className="btn btn-ghost">Ayah {next} →</Link> : <span />}
        </nav>
        <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "var(--muted-2)", textAlign: "center", marginTop: "2rem" }}>
          Text, translations, recitation and tafsir from{" "}
          <a href="https://quran.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>quran.com</a>.
        </p>
      </div>
    </PageShell>
  );
}
