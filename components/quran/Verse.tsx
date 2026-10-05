import AyahText from "./AyahText";
import VerseActions from "./VerseActions";
import type { ReaderVerse } from "@/lib/quran/reader";

/** One ayah of the surah reader. Server-rendered; only the action row is interactive. */
export default function Verse({ verse }: { verse: ReaderVerse }) {
  return (
    <article className="verse" id={`ayah-${verse.number}`} data-ayah={verse.number}>
      <VerseActions verseKey={verse.key} />
      <AyahText verses={[verse]} size="clamp(1.55rem, 4vw, 2.15rem)" align="right" />
      <p className="verse-tr verse-tr--sahih">
        <span className="verse-tr__by">Saheeh International</span>
        {verse.sahih}
      </p>
      <p className="verse-tr verse-tr--haleem">
        <span className="verse-tr__by">Abdel Haleem</span>
        {verse.haleem}
      </p>
    </article>
  );
}
