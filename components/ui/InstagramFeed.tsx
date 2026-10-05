import { getInstagramPosts, shortCaption } from "@/lib/instagram";
import { getUpcomingEvents } from "@/lib/events";
import { formatEventDate } from "@/lib/events/time";
import { SOCIAL } from "@/lib/social";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";
const HANDLE = "@astonisoc";

function IgMark({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function relativeDay(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "Last week";
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/**
 * The live grid. The first post is given the large tile so the section reads as
 * a piece of the page rather than a uniform widget of six identical squares.
 */
async function LiveGrid() {
  const feed = await getInstagramPosts(6);

  if (feed.status !== "live") return <FallbackPanel />;

  const [lead, ...rest] = feed.posts;

  return (
    <div className="ig-mosaic">
      <a
        href={lead.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="ig-tile ig-tile--lead"
        aria-label={lead.caption ? shortCaption(lead.caption, 80) : "View post on Instagram"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={lead.image} alt={lead.caption ? shortCaption(lead.caption, 80) : "Aston ISOC Instagram post"} loading="lazy" />
        <span className="ig-veil" />
        <span className="ig-meta">
          {(lead.isVideo || lead.isAlbum) && (
            <span className="ig-kind">{lead.isVideo ? "Reel" : "Gallery"}</span>
          )}
          {lead.caption && <span className="ig-cap">{shortCaption(lead.caption, 140)}</span>}
          <span className="ig-date">{relativeDay(lead.timestamp)}</span>
        </span>
      </a>

      {rest.map(post => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="ig-tile"
          aria-label={post.caption ? shortCaption(post.caption, 80) : "View post on Instagram"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.caption ? shortCaption(post.caption, 80) : "Aston ISOC Instagram post"} loading="lazy" />
          <span className="ig-veil" />
          <span className="ig-meta">
            {(post.isVideo || post.isAlbum) && (
              <span className="ig-kind">{post.isVideo ? "Reel" : "Gallery"}</span>
            )}
            <span className="ig-date">{relativeDay(post.timestamp)}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

/**
 * Shown when no token is configured or Instagram is unreachable. It carries
 * real information from our own data rather than pretending to be posts.
 */
async function FallbackPanel() {
  const upcoming = await getUpcomingEvents(3);

  return (
    <div className="ig-fallback">
      <div>
        <span className="ig-fallback__mark">
          <IgMark size={22} />
        </span>
        <h3 style={{ fontFamily: PF, fontSize: "1.5rem", color: "#fff", marginBottom: "0.6rem" }}>
          Every event lands on Instagram first
        </h3>
        <p style={{ fontFamily: DM, fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: "42ch" }}>
          Announcements, reminders and photos from the week go out on {HANDLE} before anywhere
          else. Follow the account to catch them as they happen.
        </p>
        <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ marginTop: "1.6rem" }}>
          <IgMark />
          Follow {HANDLE}
        </a>
      </div>

      {upcoming.length > 0 && (
        <div className="ig-fallback__list">
          <p
            style={{
              fontFamily: DM,
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted-2)",
              marginBottom: "1.25rem",
            }}
          >
            Announced so far
          </p>
          {upcoming.map((e, i) => (
            <div
              key={e.id}
              style={{
                paddingBottom: i === upcoming.length - 1 ? 0 : "1rem",
                marginBottom: i === upcoming.length - 1 ? 0 : "1rem",
                borderBottom: i === upcoming.length - 1 ? "none" : "1px solid var(--line-soft)",
              }}
            >
              <p style={{ fontFamily: PF, fontSize: "1.02rem", color: "#fff", marginBottom: "0.2rem" }}>{e.title}</p>
              <p style={{ fontFamily: DM, fontSize: "0.8rem", color: "var(--muted-2)" }}>
                {formatEventDate(e.date, { day: "numeric", month: "long" })} · {e.location}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InstagramFeed() {
  return (
    <>
      <LiveGrid />
      <style>{`
        .ig-mosaic {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-auto-rows: minmax(0, 1fr);
          gap: 0.85rem;
        }
        .ig-tile {
          position: relative;
          display: block;
          overflow: hidden;
          border-radius: var(--radius-sm);
          border: 1px solid var(--line-soft);
          background: linear-gradient(150deg, rgba(216,175,114,0.08), rgba(31,21,71,0.5));
          aspect-ratio: 1;
          transition: transform var(--t-med) var(--ease), border-color var(--t-med), box-shadow var(--t-med);
        }
        .ig-tile--lead { grid-column: span 2; grid-row: span 2; aspect-ratio: 1; }
        .ig-tile img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 900ms var(--ease);
        }
        .ig-veil {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(13,9,30,0.88) 0%, rgba(13,9,30,0.15) 45%, transparent 70%);
          opacity: 0.85;
          transition: opacity var(--t-med);
        }
        .ig-tile:hover { transform: translateY(-3px); border-color: rgba(216,175,114,0.4); box-shadow: var(--shadow-sm); }
        .ig-tile:hover img { transform: scale(1.05); }
        .ig-tile:hover .ig-veil { opacity: 1; }
        .ig-meta {
          position: absolute; inset: auto 0 0 0;
          display: flex; flex-direction: column; align-items: flex-start; gap: 0.4rem;
          padding: 0.9rem;
        }
        .ig-tile--lead .ig-meta { padding: 1.25rem; }
        .ig-kind {
          font-family: ${DM}; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--gold-soft);
          border: 1px solid rgba(216,175,114,0.3);
          background: rgba(19,13,40,0.7);
          padding: 0.2rem 0.55rem; border-radius: 999px;
        }
        .ig-cap {
          font-family: ${PF}; font-size: 1.02rem; color: #fff; line-height: 1.35;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .ig-date {
          font-family: ${DM}; font-size: 0.7rem; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(245,242,234,0.65);
        }
        @media (max-width: 900px) {
          .ig-mosaic { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .ig-tile--lead { grid-column: span 3; grid-row: span 1; aspect-ratio: 16 / 10; }
        }
        @media (max-width: 560px) {
          .ig-mosaic { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; }
          .ig-tile--lead { grid-column: span 2; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ig-tile, .ig-tile img { transition: none; }
          .ig-tile:hover { transform: none; }
          .ig-tile:hover img { transform: none; }
        }

        .ig-fallback {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: clamp(2rem, 5vw, 4rem);
          align-items: start;
          padding: clamp(1.9rem, 4vw, 3rem);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: linear-gradient(150deg, rgba(216,175,114,0.06), rgba(19,13,40,0.45));
        }
        .ig-fallback__mark {
          display: grid; place-items: center;
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, rgba(216,175,114,0.18), rgba(216,175,114,0.05));
          border: 1px solid var(--line);
          color: var(--gold);
          margin-bottom: 1.2rem;
        }
        .ig-fallback__list {
          border-left: 1px solid var(--line);
          padding-left: clamp(1.25rem, 3vw, 2rem);
        }
        @media (max-width: 820px) {
          .ig-fallback { grid-template-columns: minmax(0, 1fr); }
          .ig-fallback__list { border-left: none; border-top: 1px solid var(--line); padding-left: 0; padding-top: 1.75rem; }
        }
      `}</style>
    </>
  );
}
