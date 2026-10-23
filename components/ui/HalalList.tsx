import type { HalalPlace } from "@/lib/content";

const DM = "'DM Sans', sans-serif";

/** Halal places as rows, each linking out when the committee added a link. */
export default function HalalList({ places }: { places: HalalPlace[] }) {
  return (
    <div className="overflow-hidden" style={{ border: "1px solid rgba(216,175,114,0.1)", borderRadius: "1rem" }}>
      {places.map((f, i) => {
        const meta = [f.kind, f.area, f.note].filter(Boolean).join(" · ");
        return (
          <div key={f.id} className="flex justify-between items-start gap-4 px-6 py-4"
            style={{ borderBottom: i < places.length - 1 ? "1px solid rgba(216,175,114,0.06)" : "none" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "#fff", fontFamily: DM }}>
                {f.url ? <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", textDecorationColor: "rgba(216,175,114,0.4)", textUnderlineOffset: 3 }}>{f.name}</a> : f.name}
              </p>
              {meta && <p className="text-xs mt-0.5" style={{ color: "var(--muted-2)", fontFamily: DM }}>{meta}</p>}
            </div>
            {f.walk && <span className="text-xs shrink-0" style={{ color: "var(--muted-2)", fontFamily: DM }}>{f.walk}</span>}
          </div>
        );
      })}
    </div>
  );
}
