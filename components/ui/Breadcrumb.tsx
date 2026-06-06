import Link from "next/link";
interface Crumb { label: string; href?: string; }
export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <p className="breadcrumb" style={{ marginBottom: "1.5rem" }}>
      <Link href="/">Home</Link>
      {crumbs.map((c, i) => (
        <span key={i}>
          {" · "}
          {c.href ? <Link href={c.href}>{c.label}</Link> : <span style={{ color: "#d8af72" }}>{c.label}</span>}
        </span>
      ))}
    </p>
  );
}
