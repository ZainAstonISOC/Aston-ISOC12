"use client";
import Link from "next/link";
import { useState } from "react";
import { Event, BlogPost, CommitteeMember, Resource, Lecture } from "@/types";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

/* ── PAGE HEADER ─────────────────────────────────────────────────────────── */
export function PageHeader({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "3.5rem" }}>
      {label && <p className="eyebrow">{label}</p>}
      <h1 style={{ fontFamily: PF, fontWeight: 600, color: "#fff", marginBottom: "1rem" }}>{title}</h1>
      <div className="gold-rule" />
      {subtitle && (
        <p className="lede" style={{ color: "#b7b0c9", fontFamily: DM }}>{subtitle}</p>
      )}
    </div>
  );
}

/* ── EVENT CARD (L2) ─────────────────────────────────────────────────────── */
const EVENT_LABELS: Record<string, string> = {
  all:"All Welcome", sisters:"Sisters Only", brothers:"Brothers Only",
  jummah:"Jumu'ah", charity:"Charity", sports:"Sports",
  speaker:"Speaker", freshers:"Freshers", social:"Social",
};

export function EventCard({ event }: { event: Event }) {
  const [hovered, setHovered] = useState(false);
  const d = new Date(event.date);
  const day   = d.getDate().toString().padStart(2,"0");
  const month = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();

  return (
    <Link href={`/events/${event.id}`} className="block">
      <div
        className="card link"
        style={{
          borderColor: hovered ? "rgba(216,175,114,0.4)" : undefined,
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          boxShadow: hovered ? "0 24px 60px -24px rgba(0,0,0,0.7)" : undefined,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Date + category row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "1.2rem" }}>
          <div style={{
            textAlign: "center", padding: "0.8rem 1rem",
            borderRadius: "12px", border: "1px solid rgba(216,175,114,0.18)",
            background: "rgba(216,175,114,0.06)", flexShrink: 0,
          }}>
            <div style={{ fontFamily: PF, fontSize: "1.9rem", color: "#d8af72", lineHeight: 1, fontWeight: 500 }}>{day}</div>
            <div style={{ fontFamily: DM, fontSize: "0.65rem", letterSpacing: "0.12em", color: "#8d86a3", marginTop: "0.2rem" }}>{month}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end" }}>
            <span className={`badge badge-${event.category}`}>{EVENT_LABELS[event.category] ?? event.category}</span>
            {event.isRecurring && <span className="badge badge-muted">Recurring</span>}
          </div>
        </div>

        <h3 style={{ fontFamily: PF, fontSize: "1.25rem", fontWeight: 500, color: "#fff", marginBottom: "0.6rem", lineHeight: 1.2 }}>
          {event.title}
        </h3>
        {event.recurringNote && (
          <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "#d8af72", marginBottom: "0.5rem" }}>{event.recurringNote}</p>
        )}
        <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "#8d86a3", lineHeight: 1.7, marginBottom: "1rem" }} className="line-clamp-2">
          {event.description}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontFamily: DM, fontSize: "0.8rem", color: "#8d86a3", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ color: "#d8af72" }}>⏰</span> {event.time}
          </span>
          <span style={{ fontFamily: DM, fontSize: "0.8rem", color: "#8d86a3", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ color: "#d8af72" }}>📍</span> {event.location}
          </span>
        </div>
        <div style={{
          marginTop: "1.2rem", paddingTop: "1rem",
          borderTop: "1px solid rgba(216,175,114,0.1)",
          display: "flex", alignItems: "center", gap: "0.4rem",
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.25s",
        }}>
          <span style={{ fontFamily: DM, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d8af72" }}>View Details</span>
          <span style={{ color: "#d8af72", fontSize: "0.7rem", transition: "transform 0.2s", transform: hovered ? "translateX(4px)" : "none" }}>→</span>
        </div>
      </div>
    </Link>
  );
}

/* ── BLOG CARD ───────────────────────────────────────────────────────────── */
export function BlogCard({ post }: { post: BlogPost }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <article className="card link article"
        style={{ borderColor: hovered ? "rgba(216,175,114,0.35)" : undefined, transform: hovered ? "translateY(-4px)" : undefined }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <span className="badge badge-muted" style={{ marginBottom: "1rem", display: "inline-block" }}>{post.category}</span>
        <h3 style={{ fontFamily: PF, fontSize: "1.2rem", fontWeight: 500, color: "#fff", marginBottom: "0.75rem", lineHeight: 1.25 }}>{post.title}</h3>
        <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "#8d86a3", lineHeight: 1.7, marginBottom: "1.2rem" }} className="line-clamp-3">{post.excerpt}</p>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#8d86a3", fontFamily: DM }}>
          <span>{post.author}</span>
          <span>{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </article>
    </Link>
  );
}

/* ── MEMBER CARD (initials, no photo) ────────────────────────────────────── */
export function MemberCard({ member }: { member: CommitteeMember }) {
  const [hovered, setHovered] = useState(false);
  const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="card"
      style={{ textAlign: "center", borderColor: hovered ? "rgba(216,175,114,0.3)" : undefined, transform: hovered ? "translateY(-3px)" : undefined, cursor: "default" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        width: 88, height: 88, borderRadius: "50%", margin: "0 auto 1.2rem",
        display: "grid", placeItems: "center",
        background: hovered ? "linear-gradient(145deg, rgba(216,175,114,0.25), rgba(216,175,114,0.06))" : "linear-gradient(145deg, rgba(216,175,114,0.18), rgba(216,175,114,0.05))",
        border: "1px solid rgba(216,175,114,0.25)",
        fontFamily: PF, fontSize: "1.5rem", fontWeight: 600, color: "#d8af72",
        transition: "all 0.25s",
      }}>{initials}</div>
      <h3 style={{ fontFamily: PF, fontSize: "1.05rem", fontWeight: 500, color: "#fff", marginBottom: "0.2rem" }}>{member.name}</h3>
      <p style={{ fontFamily: DM, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", color: "#d8af72", marginBottom: "0.6rem" }}>{member.role}</p>
      <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "#8d86a3", lineHeight: 1.65 }} className="line-clamp-3">{member.bio}</p>
    </div>
  );
}

/* ── RESOURCE ITEM ───────────────────────────────────────────────────────── */
const TYPE_LABELS: Record<Resource["type"], string> = { pdf: "PDF", link: "→", video: "▶", audio: "♪" };

export function ResourceItem({ resource }: { resource: Resource }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={resource.url}
      target={resource.isExternal ? "_blank" : undefined}
      rel={resource.isExternal ? "noopener noreferrer" : undefined}
      className="card link"
      style={{
        display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1.2rem 1.4rem",
        borderColor: hovered ? "rgba(216,175,114,0.32)" : undefined,
        background: hovered ? "rgba(216,175,114,0.04)" : undefined,
        transform: hovered ? "translateY(-2px)" : undefined,
      }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="icon-badge" style={{ width: 36, height: 36, borderRadius: "10px", flexShrink: 0, fontSize: "0.7rem", fontWeight: 700, fontFamily: DM }}>
        {TYPE_LABELS[resource.type]}
      </div>
      <div>
        <p style={{ fontFamily: DM, fontWeight: 600, color: "#f5f2ea", marginBottom: "0.25rem", fontSize: "0.9rem" }}>{resource.title}</p>
        <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "#8d86a3", lineHeight: 1.6 }}>{resource.description}</p>
      </div>
    </a>
  );
}

/* ── LECTURE CARD ────────────────────────────────────────────────────────── */
export function LectureCard({ lecture }: { lecture: Lecture }) {
  const [hovered, setHovered] = useState(false);
  const url = lecture.youtubeUrl ?? lecture.spotifyUrl;
  const inner = (
    <div className="card link"
      style={{
        padding: 0, overflow: "hidden",
        borderColor: hovered ? "rgba(216,175,114,0.38)" : undefined,
        transform: hovered ? "translateY(-4px)" : undefined,
      }}>
      <div style={{
        aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(150deg, rgba(216,175,114,0.12), rgba(31,21,71,0.5))",
        position: "relative",
      }}>
        <div className="icon-badge" style={{ width: 52, height: 52, borderRadius: "50%" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div style={{ padding: "1.4rem" }}>
        <span className="badge badge-muted" style={{ marginBottom: "0.75rem", display: "inline-block", textTransform: "capitalize" }}>{lecture.category}</span>
        <h3 style={{ fontFamily: PF, fontSize: "1.1rem", fontWeight: 500, color: "#fff", marginBottom: "0.4rem", lineHeight: 1.25 }}>{lecture.title}</h3>
        <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "#b7b0c9", marginBottom: "0.25rem" }}>{lecture.speaker}</p>
        <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "#8d86a3", marginBottom: "0.75rem" }}>{lecture.series} · {lecture.duration}</p>
        <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "#8d86a3", lineHeight: 1.65 }} className="line-clamp-2">{lecture.description}</p>
      </div>
    </div>
  );
  if (url) return <a href={url} target="_blank" rel="noopener noreferrer" className="block" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>{inner}</a>;
  return <div className="block" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>{inner}</div>;
}

/* ── CTA BANNER ──────────────────────────────────────────────────────────── */
export function CtaBanner({ title, description, primaryLabel, primaryHref, secondaryLabel, secondaryHref }:
  { title: string; description: string; primaryLabel: string; primaryHref: string; secondaryLabel?: string; secondaryHref?: string }) {
  const isExt = primaryHref.startsWith("http");
  return (
    <div className="cta-band">
      <h2 style={{ fontFamily: PF, fontWeight: 600, marginBottom: "0.75rem" }}>{title}</h2>
      <p className="lede" style={{ marginBottom: "2rem", marginInline: "auto" }}>{description}</p>
      <div className="cta-band__actions">
        {isExt
          ? <a href={primaryHref} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">{primaryLabel}</a>
          : <Link href={primaryHref} className="btn btn-gold btn-lg">{primaryLabel}</Link>}
        {secondaryLabel && secondaryHref && (
          <Link href={secondaryHref} className="btn btn-ghost btn-lg">{secondaryLabel}</Link>
        )}
      </div>
    </div>
  );
}
