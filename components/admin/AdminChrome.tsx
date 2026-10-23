import Link from "next/link";
import { COLLECTIONS } from "@/lib/content/schema";

const DM = "'DM Sans', sans-serif";

/** The admin's section links, shown on every admin page so nothing is more than one click away. */
export function AdminNav({ current }: { current?: string }) {
  const links = [
    { key: "events", label: "Events", href: "/admin" },
    { key: "jumuah", label: "Jumu'ah", href: "/admin/jumuah" },
    ...COLLECTIONS.map(c => ({ key: c.key, label: c.title, href: `/admin/content/${c.key}` })),
  ];
  return (
    <nav aria-label="Admin sections" className="admin-nav">
      {links.map(l => (
        <Link key={l.key} href={l.href} className={l.key === current ? "admin-nav__link is-current" : "admin-nav__link"} aria-current={l.key === current ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

/** Shared admin styles: flash messages, list rows and the section nav. */
export function AdminStyles() {
  return (
    <style>{`
      .admin-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; }
      .admin-event {
        display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;
        padding: 1rem 1.25rem; border: 1px solid var(--line-soft); border-radius: var(--radius-sm); background: var(--surface);
      }
      .admin-flash { padding: 0.9rem 1.1rem !important; margin-bottom: 1.25rem; font-family: ${DM}; font-size: 0.9rem; color: var(--text); line-height: 1.6; }
      .admin-flash:hover { transform: none !important; }
      .admin-flash--error { border-color: rgba(248,113,113,0.4) !important; color: #fca5a5; }
      .admin-flash code { font-size: 0.85em; color: var(--gold-soft); }
      .admin-nav { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 2rem; }
      .admin-nav__link {
        font-family: ${DM}; font-size: 0.8rem; padding: 0.45rem 0.85rem; border-radius: 999px;
        border: 1px solid var(--line-soft); color: var(--muted);
      }
      .admin-nav__link:hover { color: var(--gold); border-color: var(--line); }
      .admin-nav__link.is-current { color: #130d28; background: var(--gold); border-color: var(--gold); font-weight: 600; }
      .admin-small-btn { padding: 0.55rem 0.8rem !important; font-size: 0.82rem !important; }
    `}</style>
  );
}
