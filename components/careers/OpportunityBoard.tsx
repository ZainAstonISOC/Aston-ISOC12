"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type EmploymentType,
  type ExperienceLevel,
  type Opportunity,
  type OpportunityCategory,
} from "@/lib/careers/types";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

const ANY = "any";
type DeadlineFilter = "any" | "7" | "30" | "rolling";

/** Free-text locations collapse into a handful of buckets people actually filter by. */
function locationBucket(location: string): string {
  const l = location.toLowerCase();
  if (l.includes("campus") || l.includes("aston")) return "On campus";
  if (l.includes("birmingham")) return "Birmingham";
  if (l.includes("london")) return "London";
  if (l.includes("remote") || l.includes("virtual")) return "Remote";
  if (l.includes("nationwide") || l.includes("uk-wide") || l.includes("uk")) return "UK-wide";
  return "Other";
}

function daysUntil(iso: string): number {
  const then = new Date(`${iso}T23:59:59`).getTime();
  return Math.ceil((then - Date.now()) / 86_400_000);
}

function DeadlineTag({ deadline }: { deadline: string | null }) {
  if (!deadline) {
    return (
      <span style={{ color: "var(--muted-2)" }}>
        Rolling — check the listing
      </span>
    );
  }
  const days = daysUntil(deadline);
  const formatted = new Date(deadline).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (days < 0) return <span style={{ color: "var(--muted-2)" }}>Closed {formatted}</span>;
  const urgent = days <= 14;
  return (
    <span style={{ color: urgent ? "var(--gold-soft)" : "var(--muted-2)", fontWeight: urgent ? 600 : 400 }}>
      Closes {formatted}
      {urgent && ` · ${days === 0 ? "today" : `${days} day${days === 1 ? "" : "s"} left`}`}
    </span>
  );
}

interface Props {
  opportunities: Opportunity[];
}

export default function OpportunityBoard({ opportunities }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<OpportunityCategory | typeof ANY>(ANY);
  const [industry, setIndustry] = useState<string>(ANY);
  const [location, setLocation] = useState<string>(ANY);
  const [employment, setEmployment] = useState<EmploymentType | typeof ANY>(ANY);
  const [experience, setExperience] = useState<ExperienceLevel | typeof ANY>(ANY);
  const [deadline, setDeadline] = useState<DeadlineFilter>(ANY);

  /* Filter options come from the data, so a new provider widens them automatically. */
  const options = useMemo(() => {
    const industries = new Set<string>();
    const locations = new Set<string>();
    const employments = new Set<string>();
    const experiences = new Set<string>();
    const categories = new Set<string>();
    for (const o of opportunities) {
      industries.add(o.industry);
      locations.add(locationBucket(o.location));
      employments.add(o.employmentType);
      experiences.add(o.experienceLevel);
      categories.add(o.category);
    }
    return {
      industries: [...industries].sort(),
      locations: [...locations].sort(),
      employments: [...employments].sort(),
      experiences: [...experiences].sort(),
      categories: CATEGORY_ORDER.filter(c => categories.has(c)),
    };
  }, [opportunities]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunities.filter(o => {
      if (category !== ANY && o.category !== category) return false;
      if (industry !== ANY && o.industry !== industry) return false;
      if (location !== ANY && locationBucket(o.location) !== location) return false;
      if (employment !== ANY && o.employmentType !== employment) return false;
      if (experience !== ANY && o.experienceLevel !== experience) return false;

      if (deadline === "rolling" && o.deadline !== null) return false;
      if (deadline === "7" || deadline === "30") {
        if (!o.deadline) return false;
        const days = daysUntil(o.deadline);
        if (days < 0 || days > Number(deadline)) return false;
      }

      if (q) {
        const haystack = `${o.title} ${o.employer} ${o.description} ${o.industry} ${o.location}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [opportunities, query, category, industry, location, employment, experience, deadline]);

  const activeFilters =
    (category !== ANY ? 1 : 0) +
    (industry !== ANY ? 1 : 0) +
    (location !== ANY ? 1 : 0) +
    (employment !== ANY ? 1 : 0) +
    (experience !== ANY ? 1 : 0) +
    (deadline !== ANY ? 1 : 0) +
    (query.trim() ? 1 : 0);

  function clearAll() {
    setQuery("");
    setCategory(ANY);
    setIndustry(ANY);
    setLocation(ANY);
    setEmployment(ANY);
    setExperience(ANY);
    setDeadline(ANY);
  }

  return (
    <div>
      {/* ── Search ───────────────────────────────────────────────────────── */}
      <div className="ob-search">
        <label htmlFor="ob-q" className="ob-visually-hidden">
          Search opportunities
        </label>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
          className="ob-search__icon"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="ob-q"
          type="search"
          className="field ob-search__input"
          placeholder="Search by role, employer or sector — try “finance” or “Birmingham”"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* ── Category rail ────────────────────────────────────────────────── */}
      <div className="ob-rail" role="group" aria-label="Filter by opportunity type">
        <button
          type="button"
          className={`ob-chip${category === ANY ? " is-active" : ""}`}
          aria-pressed={category === ANY}
          onClick={() => setCategory(ANY)}
        >
          All types
        </button>
        {options.categories.map(c => (
          <button
            key={c}
            type="button"
            className={`ob-chip${category === c ? " is-active" : ""}`}
            aria-pressed={category === c}
            onClick={() => setCategory(category === c ? ANY : c)}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="ob-filters">
        <div className="field-wrap ob-filter">
          <label htmlFor="ob-industry">Industry</label>
          <select id="ob-industry" className="field" value={industry} onChange={e => setIndustry(e.target.value)}>
            <option value={ANY}>All industries</option>
            {options.industries.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div className="field-wrap ob-filter">
          <label htmlFor="ob-location">Location</label>
          <select id="ob-location" className="field" value={location} onChange={e => setLocation(e.target.value)}>
            <option value={ANY}>Anywhere</option>
            {options.locations.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="field-wrap ob-filter">
          <label htmlFor="ob-employment">Employment type</label>
          <select
            id="ob-employment"
            className="field"
            value={employment}
            onChange={e => setEmployment(e.target.value as EmploymentType | typeof ANY)}
          >
            <option value={ANY}>Any type</option>
            {options.employments.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="field-wrap ob-filter">
          <label htmlFor="ob-experience">Experience level</label>
          <select
            id="ob-experience"
            className="field"
            value={experience}
            onChange={e => setExperience(e.target.value as ExperienceLevel | typeof ANY)}
          >
            <option value={ANY}>Any level</option>
            {options.experiences.map(x => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </div>

        <div className="field-wrap ob-filter">
          <label htmlFor="ob-deadline">Deadline</label>
          <select
            id="ob-deadline"
            className="field"
            value={deadline}
            onChange={e => setDeadline(e.target.value as DeadlineFilter)}
          >
            <option value={ANY}>Any deadline</option>
            <option value="7">Closing within 7 days</option>
            <option value="30">Closing within 30 days</option>
            <option value="rolling">Rolling / no closing date</option>
          </select>
        </div>
      </div>

      {/* ── Result summary ───────────────────────────────────────────────── */}
      <div className="ob-summary">
        <p aria-live="polite">
          <b>{filtered.length}</b>{" "}
          {filtered.length === 1 ? "opportunity" : "opportunities"}
          {activeFilters > 0 && <span style={{ color: "var(--muted-2)" }}> · filtered</span>}
        </p>
        {activeFilters > 0 && (
          <button type="button" onClick={clearAll} className="ob-clear">
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="ob-empty">
          <h3 style={{ fontFamily: PF, color: "#fff", fontSize: "1.3rem", marginBottom: "0.6rem" }}>
            Nothing matches that yet
          </h3>
          <p style={{ fontFamily: DM, color: "var(--muted)", maxWidth: "46ch", margin: "0 auto 1.5rem", lineHeight: 1.75 }}>
            Try widening a filter. If you know of something that belongs here — a placement, a
            spring week, a role at your employer — send it to the committee and we will add it.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={clearAll} className="btn btn-gold">
              Clear all filters
            </button>
            <Link href="/feedback" className="btn btn-ghost">
              Suggest an opportunity
            </Link>
          </div>
        </div>
      ) : (
        <>
        {/* Gives the h3 opportunity titles a parent level so the document
            outline does not jump straight from h1 to h3. */}
        <h2 className="visually-hidden">All opportunities</h2>
        <ul className="ob-list">
          {filtered.map(o => {
            const internal = o.applyUrl.startsWith("/");
            return (
              <li key={o.id} className={`ob-item${o.featured ? " is-featured" : ""}`}>
                <div className="ob-item__main">
                  <div className="ob-item__tags">
                    <span className="badge badge-gold">{CATEGORY_LABELS[o.category]}</span>
                    {/* Charity roles would otherwise show the same word twice */}
                    {o.industry !== CATEGORY_LABELS[o.category] && (
                      <span className="badge badge-muted">{o.industry}</span>
                    )}
                    {o.featured && <span className="badge badge-green">Committee pick</span>}
                  </div>

                  <h3 className="ob-item__title">{o.title}</h3>
                  <p className="ob-item__employer">{o.employer}</p>
                  <p className="ob-item__desc">{o.description}</p>

                  <dl className="ob-item__meta">
                    <div>
                      <dt>Location</dt>
                      <dd>{o.location}</dd>
                    </div>
                    <div>
                      <dt>Type</dt>
                      <dd>{o.employmentType}</dd>
                    </div>
                    <div>
                      <dt>Level</dt>
                      <dd>{o.experienceLevel}</dd>
                    </div>
                    <div>
                      <dt>Deadline</dt>
                      <dd>
                        <DeadlineTag deadline={o.deadline} />
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="ob-item__action">
                  {internal ? (
                    <Link href={o.applyUrl} className="btn btn-outline-gold">
                      View details
                    </Link>
                  ) : (
                    <a href={o.applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold">
                      Apply ↗
                    </a>
                  )}
                  <span className="ob-item__source">via {o.source === "curated" ? "ISOC" : o.source}</span>
                </div>
              </li>
            );
          })}
        </ul>
        </>
      )}

      <style>{`
        .ob-visually-hidden {
          position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
        }

        .ob-search { position: relative; margin-bottom: 1.25rem; }
        .ob-search__icon {
          position: absolute; left: 1.1rem; top: 50%; transform: translateY(-50%);
          width: 19px; height: 19px; color: var(--muted-2); pointer-events: none;
        }
        .ob-search__input {
          padding: 1.05rem 1.2rem 1.05rem 3rem;
          font-size: 1rem;
          border-radius: 999px;
        }
        .ob-search__input::-webkit-search-cancel-button { filter: invert(0.6); }

        .ob-rail {
          display: flex; flex-wrap: wrap; gap: 0.5rem;
          margin-bottom: 1.75rem;
        }
        .ob-chip {
          font-family: ${DM};
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          min-height: 40px;
          border-radius: 999px;
          border: 1px solid var(--line-soft);
          background: var(--surface);
          color: var(--muted);
          transition: color var(--t-fast), border-color var(--t-fast), background var(--t-fast);
        }
        .ob-chip:hover { color: var(--text); border-color: var(--line); }
        .ob-chip.is-active {
          background: rgba(216,175,114,0.14);
          border-color: rgba(216,175,114,0.45);
          color: var(--gold-soft);
        }

        .ob-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 1rem;
          padding: 1.4rem;
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          background: var(--surface);
          margin-bottom: 1.75rem;
        }
        .ob-filter { margin-bottom: 0 !important; }
        .ob-filter label {
          font-size: 0.72rem !important;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted-2) !important;
        }
        .ob-filter .field { min-height: 44px; }

        .ob-summary {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--line-soft);
        }
        .ob-summary p { font-family: ${DM}; font-size: 0.92rem; color: var(--muted); }
        .ob-summary b { color: var(--gold); font-family: ${PF}; font-size: 1.15rem; }
        .ob-clear {
          font-family: ${DM}; font-size: 0.82rem; font-weight: 600;
          color: var(--gold); padding: 0.4rem 0.2rem; min-height: 40px;
        }
        .ob-clear:hover { text-decoration: underline; }

        .ob-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1rem; }

        .ob-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: clamp(1rem, 3vw, 2.5rem);
          align-items: start;
          padding: 1.6rem;
          border: 1px solid var(--line-soft);
          border-radius: var(--radius);
          background: var(--surface);
          transition: border-color var(--t-med), background var(--t-med), transform var(--t-med) var(--ease);
        }
        .ob-item:hover {
          border-color: rgba(216,175,114,0.32);
          background: var(--surface-2);
          transform: translateY(-2px);
        }
        /* Committee picks carry a gold spine rather than a different card shape */
        .ob-item.is-featured { border-left: 2px solid rgba(216,175,114,0.55); }

        .ob-item__tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.85rem; }
        .ob-item__title {
          font-family: ${PF}; font-size: 1.22rem; font-weight: 500;
          color: #fff; line-height: 1.3; margin-bottom: 0.25rem;
        }
        .ob-item__employer {
          font-family: ${DM}; font-size: 0.85rem; font-weight: 600;
          color: var(--gold); margin-bottom: 0.7rem;
        }
        .ob-item__desc {
          font-family: ${DM}; font-size: 0.9rem; color: var(--muted);
          line-height: 1.75; max-width: 68ch; margin-bottom: 1.1rem;
        }
        .ob-item__meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.9rem 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--line-soft);
          margin: 0;
        }
        .ob-item__meta dt {
          font-family: ${DM}; font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--muted-2); margin-bottom: 0.25rem;
        }
        .ob-item__meta dd {
          font-family: ${DM}; font-size: 0.85rem; color: var(--text);
          margin: 0; line-height: 1.5;
        }

        .ob-item__action {
          display: flex; flex-direction: column; align-items: flex-end; gap: 0.6rem;
        }
        .ob-item__source {
          font-family: ${DM}; font-size: 0.68rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted-2);
        }

        .ob-empty {
          text-align: center;
          padding: clamp(2.5rem, 7vw, 4.5rem) 1.5rem;
          border: 1px dashed var(--line);
          border-radius: var(--radius);
          background: rgba(255,255,255,0.02);
        }

        @media (max-width: 720px) {
          .ob-item { grid-template-columns: minmax(0, 1fr); }
          .ob-item__action { flex-direction: row; align-items: center; justify-content: space-between; width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ob-item, .ob-chip { transition: none; }
          .ob-item:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}
