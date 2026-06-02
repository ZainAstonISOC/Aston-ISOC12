import Link from "next/link";

interface Crumb { label: string; href?: string; }

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav
      className="flex items-center gap-2 mb-10 text-xs tracking-widest uppercase"
      style={{ fontFamily: "Inter, sans-serif", color: "#4B5563" }}
      aria-label="Breadcrumb"
    >
      <Link href="/" className="transition-colors hover:text-yellow-400">Home</Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          <span style={{ color: "rgba(201,162,39,0.3)" }}>·</span>
          {crumb.href ? (
            <Link href={crumb.href} className="transition-colors hover:text-yellow-400">{crumb.label}</Link>
          ) : (
            <span style={{ color: "#9CA3AF" }}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
