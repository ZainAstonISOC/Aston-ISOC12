import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-4"
      style={{ minHeight: "100svh", background: "transparent" }}
    >
      {/* Crescent motif */}
      <svg width="60" height="60" viewBox="0 0 28 28" fill="none" className="mb-6 opacity-40">
        <path d="M14 3C8.477 3 4 7.477 4 13s4.477 10 10 10c1.43 0 2.795-.3 4.03-.84C15.72 23.42 13.19 24 10.5 24 5.253 24 1 19.747 1 14.5S5.253 5 10.5 5c.92 0 1.81.12 2.66.35A9.95 9.95 0 0014 3z" fill="#d8af72"/>
      </svg>
      <p className="label mb-4">404</p>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 300, color: "#fff", marginBottom: "1rem" }}>
        Page Not Found
      </h1>
      <p className="mb-10 max-w-sm" style={{ color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", lineHeight: 1.7 }}>
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/" className="btn btn-gold" style={{ fontSize: "0.72rem" }}>Go Home</Link>
        <Link href="/events" className="btn btn-outline-gold" style={{ fontSize: "0.72rem" }}>View Events</Link>
        <Link href="/contact" className="btn btn-ghost" style={{ fontSize: "0.72rem" }}>Contact</Link>
      </div>
    </div>
  );
}
