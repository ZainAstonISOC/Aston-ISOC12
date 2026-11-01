"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_BADGE,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  SOURCE_LABELS,
  type Opportunity,
  type OpportunityCategory,
  type Region,
} from "@/lib/careers/types";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const ALL = "all";
const PAGE = 30;
const TOP = 6;
const REGIONS: Region[] = ["Birmingham", "London", "Rest of UK", "Remote"];
type Sort = "top" | "closing" | "new";

function daysUntil(iso: string): number {
  return Math.ceil((new Date(`${iso}T23:59:59`).getTime() - Date.now()) / 86_400_000);
}

function Deadline({ deadline }: { deadline: string | null }) {
  if (!deadline) return <span className="ob-dl">No closing date published</span>;
  const days = daysUntil(deadline);
  const date = new Date(deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const urgent = days <= 14;
  return (
    <span className={`ob-dl${urgent ? " is-urgent" : ""}`}>
      Closes {date}
      {urgent && ` · ${days <= 0 ? "today" : `${days} day${days === 1 ? "" : "s"} left`}`}
    </span>
  );
}

/** Adzuna's terms require an "Adzuna" link to adzuna.co.uk on each of its listings. */
function Source({ o }: { o: Opportunity }) {
  if (o.source === "adzuna") {
    return (
      <a href="https://www.adzuna.co.uk" target="_blank" rel="noopener noreferrer" className="ob-source ob-source--adzuna">
        Jobs by Adzuna
      </a>
    );
  }
  return <span className={`ob-source${o.source === "employer" ? " is-direct" : ""}`}>{o.source === "employer" ? "Direct from employer" : `via ${SOURCE_LABELS[o.source]}`}</span>;
}

function Card({ o }: { o: Opportunity }) {
  return (
    <li className="ob-item">
      <div className="ob-item__main">
        <div className="ob-item__tags">
          <span className="badge badge-gold">{CATEGORY_BADGE[o.category]}</span>
          {o.region === "Birmingham" && <span className="badge badge-green">Birmingham</span>}
        </div>
        <h3 className="ob-item__title">{o.title}</h3>
        <p className="ob-item__employer">
          {o.employer}
          <span> · {o.location}</span>
        </p>
        {o.description && <p className="ob-item__desc">{o.description}</p>}
        <p className="ob-item__meta">
          <Deadline deadline={o.deadline} />
          {o.salary && <span>{o.salary}</span>}
        </p>
      </div>
      <div className="ob-item__action">
        <a href={o.applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold">
          View &amp; apply ↗
        </a>
        <Source o={o} />
      </div>
    </li>
  );
}

export default function OpportunityBoard({ opportunities }: { opportunities: Opportunity[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<OpportunityCategory | typeof ALL>(ALL);
  const [region, setRegion] = useState<Region | typeof ALL>(ALL);
  const [sort, setSort] = useState<Sort>("top");
  const [shown, setShown] = useState(PAGE);

  const counts = useMemo(() => {
    const c = new Map<OpportunityCategory, number>();
    for (const o of opportunities) c.set(o.category, (c.get(o.category) ?? 0) + 1);
    return c;
  }, [opportunities]);

  /** The best few, one per employer, so the strip isn't six roles from one bank. */
  const top = useMemo(() => {
    const employers = new Set<string>();
    const out: Opportunity[] = [];
    for (const o of opportunities) {
      if (employers.has(o.employer)) continue;
      employers.add(o.employer);
      out.push(o);
      if (out.length === TOP) break;
    }
    return out;
  }, [opportunities]);

  const filtered = useMemo(() => {
    // Every word must appear somewhere, so "finance birmingham" narrows rather than widens.
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const list = opportunities.filter(o => {
      if (tab !== ALL && o.category !== tab) return false;
      if (region !== ALL && o.region !== region) return false;
      if (!words.length) return true;
      const hay = `${o.title} ${o.employer} ${o.location} ${o.description} ${CATEGORY_BADGE[o.category]}`.toLowerCase();
      return words.every(w => hay.includes(w));
    });
    if (sort === "closing") {
      return [...list].sort((a, b) => (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999"));
    }
    if (sort === "new") return [...list].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    return list; // already ranked by score
  }, [opportunities, query, tab, region, sort]);

  const filtering = query.trim() !== "" || tab !== ALL || region !== ALL;

  function reset() {
    setQuery("");
    setTab(ALL);
    setRegion(ALL);
    setSort("top");
    setShown(PAGE);
  }

  return (
    <div>
      {/* ── Search ───────────────────────────────────────────────────────── */}
      <div className="ob-search">
        <label htmlFor="ob-q" className="visually-hidden">Search opportunities</label>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="ob-search__icon">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="ob-q"
          type="search"
          className="field ob-search__input"
          placeholder="Search roles, employers or places: try “finance”, “software” or “Birmingham”"
          value={query}
          onChange={e => { setQuery(e.target.value); setShown(PAGE); }}
        />
      </div>

      {/* ── Type tabs ────────────────────────────────────────────────────── */}
      <div className="ob-rail" role="group" aria-label="Filter by opportunity type">
        <button type="button" className={`ob-chip${tab === ALL ? " is-active" : ""}`} aria-pressed={tab === ALL} onClick={() => { setTab(ALL); setShown(PAGE); }}>
          All <span className="ob-chip__n">{opportunities.length}</span>
        </button>
        {CATEGORY_ORDER.filter(c => counts.get(c)).map(c => (
          <button
            key={c}
            type="button"
            className={`ob-chip${tab === c ? " is-active" : ""}`}
            aria-pressed={tab === c}
            onClick={() => { setTab(tab === c ? ALL : c); setShown(PAGE); }}
          >
            {CATEGORY_LABELS[c]} <span className="ob-chip__n">{counts.get(c)}</span>
          </button>
        ))}
      </div>

      {/* ── Top opportunities (only before anyone narrows the list) ───────── */}
      {!filtering && top.length > 0 && (
        <section className="ob-top" aria-labelledby="ob-top-h">
          <h2 id="ob-top-h" className="ob-top__h">Top opportunities right now</h2>
          <p className="ob-top__sub">Ranked automatically: employers&apos; own listings, Birmingham roles, deadlines coming up and new postings come first.</p>
          <ul className="ob-top__grid">
            {top.map(o => (
              <li key={o.id}>
                <a href={o.applyUrl} target="_blank" rel="noopener noreferrer" className="ob-top__card">
                  <span className="badge badge-gold">{CATEGORY_BADGE[o.category]}</span>
                  <span className="ob-top__title">{o.title}</span>
                  <span className="ob-top__employer">{o.employer}</span>
                  <span className="ob-top__foot">
                    <Deadline deadline={o.deadline} />
                    <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="ob-filters">
        <div className="field-wrap ob-filter">
          <label htmlFor="ob-region">Location</label>
          <select id="ob-region" className="field" value={region} onChange={e => { setRegion(e.target.value as Region | typeof ALL); setShown(PAGE); }}>
            <option value={ALL}>Anywhere</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="field-wrap ob-filter">
          <label htmlFor="ob-sort">Sort by</label>
          <select id="ob-sort" className="field" value={sort} onChange={e => setSort(e.target.value as Sort)}>
            <option value="top">Best match</option>
            <option value="closing">Closing soonest</option>
            <option value="new">Newest</option>
          </select>
        </div>
      </div>

      <div className="ob-summary">
        <p aria-live="polite">
          <b>{filtered.length}</b> {filtered.length === 1 ? "opportunity" : "opportunities"}
          {filtering && <span style={{ color: "var(--muted-2)" }}> · filtered</span>}
        </p>
        {(filtering || sort !== "top") && (
          <button type="button" onClick={reset} className="ob-clear">Clear filters</button>
        )}
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="ob-empty">
          <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.3rem", marginBottom: "0.6rem" }}>Nothing matches that right now</h3>
          <p style={{ fontFamily: DM, color: "var(--muted)", maxWidth: "46ch", margin: "0 auto 1.5rem", lineHeight: 1.75 }}>
            Try fewer words or a wider location. The board refreshes every morning, so check back tomorrow too.
          </p>
          <button type="button" onClick={reset} className="btn btn-gold">Clear filters</button>
        </div>
      ) : (
        <>
          <h2 className="visually-hidden">All opportunities</h2>
          <ul className="ob-list">
            {filtered.slice(0, shown).map(o => <Card key={o.id} o={o} />)}
          </ul>
          {shown < filtered.length && (
            <div style={{ textAlign: "center", marginTop: "1.75rem" }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShown(n => n + PAGE)}>
                Show {Math.min(PAGE, filtered.length - shown)} more
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        .ob-search { position: relative; margin-bottom: 1.25rem; }
        .ob-search__icon {
          position: absolute; left: 1.1rem; top: 50%; transform: translateY(-50%);
          width: 19px; height: 19px; color: var(--muted-2); pointer-events: none;
        }
        .ob-search__input { padding: 1.05rem 1.2rem 1.05rem 3rem; font-size: 1rem; border-radius: 999px; }
        .ob-search__input::-webkit-search-cancel-button { filter: invert(0.6); }

        .ob-rail { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.75rem; }
        .ob-chip {
          font-family: ${DM}; font-size: 0.82rem; font-weight: 600;
          padding: 0.5rem 1rem; min-height: 40px; border-radius: 999px;
          border: 1px solid var(--line-soft); background: var(--surface); color: var(--muted);
          transition: color var(--t-fast), border-color var(--t-fast), background var(--t-fast);
        }
        .ob-chip:hover { color: var(--text); border-color: var(--line); }
        .ob-chip.is-active { background: rgba(216,175,114,0.14); border-color: rgba(216,175,114,0.45); color: var(--gold-soft); }
        .ob-chip__n { font-weight: 400; color: var(--muted-2); margin-left: 0.2rem; }
        .ob-chip.is-active .ob-chip__n { color: var(--gold); }

        .ob-top { margin-bottom: 2rem; }
        .ob-top__h { font-family: ${PF}; font-size: 1.35rem; font-weight: 500; color: #fff; margin-bottom: 0.3rem; }
        .ob-top__sub { font-family: ${DM}; font-size: 0.82rem; color: var(--muted-2); margin-bottom: 1rem; }
        .ob-top__grid { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.9rem; }
        .ob-top__card {
          display: flex; flex-direction: column; align-items: flex-start; gap: 0.45rem; height: 100%;
          padding: 1.2rem; border-radius: var(--radius);
          border: 1px solid rgba(216,175,114,0.28);
          background: linear-gradient(150deg, rgba(216,175,114,0.08), rgba(19,13,40,0.5));
          transition: border-color var(--t-med), transform var(--t-med) var(--ease);
        }
        .ob-top__card:hover { border-color: rgba(216,175,114,0.55); transform: translateY(-2px); }
        .ob-top__title { font-family: ${PF}; font-size: 1.05rem; color: #fff; line-height: 1.3; }
        .ob-top__employer { font-family: ${DM}; font-size: 0.82rem; font-weight: 600; color: var(--gold); }
        .ob-top__foot { margin-top: auto; padding-top: 0.4rem; width: 100%; display: flex; justify-content: space-between; align-items: center; font-family: ${DM}; font-size: 0.8rem; color: var(--gold); }

        .ob-filters {
          display: grid; grid-template-columns: repeat(2, minmax(0, 220px)); gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .ob-filter { margin-bottom: 0 !important; }
        .ob-filter label { font-size: 0.72rem !important; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted-2) !important; }
        .ob-filter .field { min-height: 44px; }

        .ob-summary {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
          padding-bottom: 1rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--line-soft);
        }
        .ob-summary p { font-family: ${DM}; font-size: 0.92rem; color: var(--muted); }
        .ob-summary b { color: var(--gold); font-family: ${PF}; font-size: 1.15rem; }
        .ob-clear { font-family: ${DM}; font-size: 0.82rem; font-weight: 600; color: var(--gold); padding: 0.4rem 0.2rem; min-height: 40px; }
        .ob-clear:hover { text-decoration: underline; }

        .ob-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.85rem; }
        .ob-item {
          display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: clamp(1rem, 3vw, 2.5rem); align-items: center;
          padding: 1.3rem 1.5rem; border: 1px solid var(--line-soft); border-radius: var(--radius); background: var(--surface);
          transition: border-color var(--t-med), background var(--t-med);
        }
        .ob-item:hover { border-color: rgba(216,175,114,0.32); background: var(--surface-2); }
        .ob-item__tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.6rem; }
        .ob-item__title { font-family: ${PF}; font-size: 1.15rem; font-weight: 500; color: #fff; line-height: 1.3; margin-bottom: 0.2rem; }
        .ob-item__employer { font-family: ${DM}; font-size: 0.85rem; font-weight: 600; color: var(--gold); margin-bottom: 0.5rem; }
        .ob-item__employer span { font-weight: 400; color: var(--muted-2); }
        .ob-item__desc {
          font-family: ${DM}; font-size: 0.88rem; color: var(--muted); line-height: 1.65; max-width: 70ch; margin-bottom: 0.6rem;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .ob-item__meta { display: flex; flex-wrap: wrap; gap: 0.4rem 1.2rem; font-family: ${DM}; font-size: 0.82rem; color: var(--muted-2); }
        .ob-dl { color: var(--muted-2); }
        .ob-dl.is-urgent { color: var(--gold-soft); font-weight: 600; }
        .ob-item__action { display: flex; flex-direction: column; align-items: flex-end; gap: 0.55rem; }
        .ob-source { font-family: ${DM}; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted-2); }
        .ob-source.is-direct { color: #86efac; }
        /* Adzuna's terms: the word "Adzuna", at least 116 × 23px, linked to adzuna.co.uk. */
        .ob-source--adzuna { display: inline-flex; align-items: center; justify-content: center; min-width: 116px; min-height: 23px; color: var(--muted); text-decoration: underline; text-underline-offset: 3px; }

        .ob-empty { text-align: center; padding: clamp(2.5rem, 7vw, 4.5rem) 1.5rem; border: 1px dashed var(--line); border-radius: var(--radius); background: rgba(255,255,255,0.02); }

        @media (max-width: 900px) { .ob-top__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 720px) {
          .ob-item { grid-template-columns: minmax(0, 1fr); padding: 1.15rem; }
          .ob-item__action { flex-direction: row; align-items: center; justify-content: space-between; width: 100%; }
          .ob-item__desc { display: none; }
          .ob-filters { grid-template-columns: 1fr 1fr; }
          /* The rail scrolls sideways rather than stacking four rows deep. */
          .ob-rail { flex-wrap: nowrap; overflow-x: auto; margin-inline: -16px; padding-inline: 16px; scrollbar-width: none; }
          .ob-rail::-webkit-scrollbar { display: none; }
          .ob-chip { flex: none; }
        }
        @media (max-width: 560px) {
          .ob-top__grid { grid-template-columns: minmax(0, 1fr); }
          .ob-top__grid > li:nth-child(n + 5) { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ob-item, .ob-chip, .ob-top__card { transition: none; }
          .ob-top__card:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}
