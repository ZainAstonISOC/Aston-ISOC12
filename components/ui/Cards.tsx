"use client";
import Link from "next/link";
import { useState } from "react";
import { Event, BlogPost, CommitteeMember, Resource, Lecture } from "@/types";
import Icon from "./Icon";
import { CATEGORY_LABELS } from "@/lib/events/categories";
import { formatEventDate } from "@/lib/events/time";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

/* ── PAGE HEADER ─────────────────────────────────────────────────────────── */
export function PageHeader({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "3.5rem" }}>
      {label && <p className="eyebrow">{label}</p>}
      <h1 style={{ fontFamily: PF, fontWeight: 600, color: "#fff" }}>{title}</h1>
      <div className="gold-rule" />
      {subtitle && (
        <p className="lede" style={{ color: "var(--muted)", fontFamily: DM }}>{subtitle}</p>
      )}
    </div>
  );
}

/* ── EVENT CARD ──────────────────────────────────────────────────────────── */
export function EventCard({ event }: { event: Event }) {
  const [hovered, setHovered] = useState(false);
  // Read straight from the YYYY-MM-DD string: new Date() would shift the day
  // for anyone viewing from a timezone behind the UK.
  const day   = event.date.slice(8, 10);
  const month = formatEventDate(event.date, { month: "short" }).toUpperCase();

  return (
    // Link and card both fill the grid cell, and the footer sits on the bottom
    // edge, so every card in a row is the same height with "View Details" level.
    <Link href={`/events/${event.id}`} style={{ display: "flex", flexDirection: "column", height: "100%", textDecoration: "none" }}>
      <div className="card link"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderColor: hovered ? "rgba(216,175,114,0.4)" : undefined,
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          boxShadow: hovered ? "0 24px 60px -24px rgba(0,0,0,0.7)" : undefined,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "1.2rem" }}>
          <div style={{
            textAlign: "center", padding: "0.8rem 1rem",
            borderRadius: "12px", border: "1px solid rgba(216,175,114,0.18)",
            background: "rgba(216,175,114,0.06)", flexShrink: 0,
          }}>
            <div style={{ fontFamily: PF, fontSize: "1.9rem", color: "#d8af72", lineHeight: 1, fontWeight: 500 }}>{day}</div>
            <div style={{ fontFamily: DM, fontSize: "0.65rem", letterSpacing: "0.12em", color: "var(--muted-2)", marginTop: "0.2rem" }}>{month}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end" }}>
            <span className={`badge badge-${event.category}`}>{CATEGORY_LABELS[event.category] ?? event.category}</span>
            {event.isRecurring && <span className="badge badge-muted">Recurring</span>}
          </div>
        </div>
        <h3 className="line-clamp-2" title={event.title} style={{ fontFamily: PF, fontSize: "1.25rem", fontWeight: 500, color: "#fff", marginBottom: "0.6rem", lineHeight: 1.2 }}>
          {event.title}
        </h3>
        {event.recurringNote && (
          <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "#d8af72", marginBottom: "0.5rem" }}>{event.recurringNote}</p>
        )}
        <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted-2)", lineHeight: 1.7, marginBottom: "1rem" }} className="line-clamp-2">
          {event.description}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.2rem" }}>
          <span style={{ fontFamily: DM, fontSize: "0.8rem", color: "var(--muted-2)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Icon name="clock" size={14} style={{ color: "#d8af72", flexShrink: 0 }} />
            {event.endTime ? `${event.time}–${event.endTime}` : event.time}
          </span>
          <span style={{ fontFamily: DM, fontSize: "0.8rem", color: "var(--muted-2)", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <Icon name="pin" size={14} style={{ color: "#d8af72", flexShrink: 0, marginTop: 3 }} />
            {event.location}
          </span>
        </div>
        <div style={{
          marginTop: "auto", paddingTop: "1rem",
          borderTop: "1px solid rgba(216,175,114,0.1)",
          display: "flex", alignItems: "center", gap: "0.4rem",
          opacity: hovered ? 1 : 0.4, transition: "opacity 0.25s",
        }}>
          <span style={{ fontFamily: DM, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d8af72" }}>View Details</span>
          <span style={{ color: "#d8af72", transition: "transform 0.2s", transform: hovered ? "translateX(4px)" : "none" }}>→</span>
        </div>
      </div>
    </Link>
  );
}

/* ── BLOG CARD ───────────────────────────────────────────────────────────── */
export function BlogCard({ post }: { post: BlogPost }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/blog/${post.slug}`} style={{ display: "block", textDecoration: "none" }}>
      <article className="card link"
        style={{ borderColor: hovered ? "rgba(216,175,114,0.35)" : undefined, transform: hovered ? "translateY(-4px)" : undefined }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <span className="badge badge-muted" style={{ marginBottom: "1rem", display: "inline-block" }}>{post.category}</span>
        <h3 style={{ fontFamily: PF, fontSize: "1.2rem", fontWeight: 500, color: "#fff", marginBottom: "0.75rem", lineHeight: 1.25 }}>{post.title}</h3>
        <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted-2)", lineHeight: 1.7, marginBottom: "1.2rem" }} className="line-clamp-3">{post.excerpt}</p>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted-2)", fontFamily: DM }}>
          <span>{post.author}</span>
          <span>{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </article>
    </Link>
  );
}

/* ── MEMBER CARD ─────────────────────────────────────────────────────────── */
export function MemberCard({ member }: { member: CommitteeMember }) {
  const [hovered, setHovered] = useState(false);
  const inits = member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="card"
      style={{ textAlign: "center", borderColor: hovered ? "rgba(216,175,114,0.3)" : undefined, transform: hovered ? "translateY(-3px)" : undefined, cursor: "default" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%", margin: "0 auto 1.1rem",
        display: "grid", placeItems: "center",
        background: "linear-gradient(145deg, rgba(216,175,114,0.2), rgba(216,175,114,0.05))",
        border: "1px solid rgba(216,175,114,0.25)",
        fontFamily: PF, fontSize: "1.3rem", fontWeight: 600, color: "#d8af72",
        transition: "all 0.22s",
      }}>{inits}</div>
      <h3 style={{ fontFamily: PF, fontSize: "1rem", fontWeight: 500, color: "#fff", marginBottom: "0.2rem" }}>{member.name}</h3>
      <p style={{ fontFamily: DM, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#d8af72", marginBottom: "0.6rem" }}>{member.role}</p>
      <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", lineHeight: 1.65 }} className="line-clamp-3">{member.bio}</p>
    </div>
  );
}

/* ── RESOURCE ITEM ───────────────────────────────────────────────────────── */
const TYPE_ICON: Record<Resource["type"], string> = { pdf: "PDF", link: "→", video: "▶", audio: "♪" };
const TYPE_LABEL: Record<Resource["type"], string> = { pdf: "PDF Download", link: "External Link", video: "Video", audio: "Audio" };

export function ResourceItem({ resource }: { resource: Resource }) {
  const [hovered, setHovered] = useState(false);

  // All resources open in a new tab
  const href   = resource.url;
  const isExt  = resource.isExternal || resource.type === "link" || resource.url.startsWith("http");
  const target = isExt ? "_blank" : "_self";
  const rel    = isExt ? "noopener noreferrer" : undefined;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        padding: "1.25rem 1.4rem",
        background: hovered ? "rgba(216,175,114,0.04)" : "var(--surface)",
        border: `1px solid ${hovered ? "rgba(216,175,114,0.32)" : "rgba(216,175,114,0.1)"}`,
        borderRadius: "var(--radius-sm)",
        textDecoration: "none",
        transition: "all 0.2s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 24px -12px rgba(0,0,0,0.5)" : "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 38, height: 38, borderRadius: "10px", flexShrink: 0,
        background: hovered ? "rgba(216,175,114,0.15)" : "rgba(216,175,114,0.08)",
        border: "1px solid rgba(216,175,114,0.2)",
        display: "grid", placeItems: "center",
        fontFamily: DM, fontSize: "0.68rem", fontWeight: 700, color: "#d8af72",
        transition: "background 0.2s",
      }}>
        {TYPE_ICON[resource.type]}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontFamily: DM, fontWeight: 600, color: hovered ? "#fff" : "var(--text)", marginBottom: "0.25rem", fontSize: "0.92rem", transition: "color 0.2s" }}>
          {resource.title}
        </p>
        <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted-2)", lineHeight: 1.6, marginBottom: "0.4rem" }}>
          {resource.description}
        </p>
        <span style={{ fontFamily: DM, fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: hovered ? "#d8af72" : "var(--muted-2)", transition: "color 0.2s" }}>
          {TYPE_LABEL[resource.type]} ↗
        </span>
      </div>
    </a>
  );
}

/* ── LECTURE CARD ────────────────────────────────────────────────────────── */
export function LectureCard({ lecture }: { lecture: Lecture }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const url = lecture.youtubeUrl ?? lecture.spotifyUrl ?? null;

  // Build thumbnail URL from video ID (playlists fall back to gradient)
  const thumb = lecture.youtubeId && !lecture.youtubeId.startsWith("PL")
    ? `https://i.ytimg.com/vi/${lecture.youtubeId}/hqdefault.jpg`
    : null;

  const inner = (
    <div className="card link"
      style={{
        padding: 0, overflow: "hidden", height: "100%",
        display: "flex", flexDirection: "column",
        borderColor: hovered ? "rgba(216,175,114,0.38)" : undefined,
        transform: hovered ? "translateY(-4px)" : undefined,
        boxShadow: hovered ? "0 16px 40px -20px rgba(0,0,0,0.7)" : undefined,
      }}>
      {/* Thumbnail */}
      <div style={{
        aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(150deg, rgba(216,175,114,0.12), rgba(31,21,71,0.5))",
        position: "relative", overflow: "hidden",
      }}>
        {thumb && !imgError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt={lecture.title} onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,9,30,0.55), transparent 55%)" }} />
          </>
        ) : (
          <div className="absolute inset-0 geo-pattern" style={{ opacity: 0.2 }} />
        )}
        {/* Play button */}
        <div style={{
          position: "absolute",
          width: 54, height: 54, borderRadius: "50%",
          background: hovered ? "rgba(216,175,114,0.95)" : "rgba(19,13,40,0.78)",
          border: `1.5px solid ${hovered ? "#d8af72" : "rgba(216,175,114,0.6)"}`,
          display: "grid", placeItems: "center",
          color: hovered ? "#130d28" : "#d8af72", fontSize: "1.15rem",
          transition: "all 0.25s", transform: hovered ? "scale(1.08)" : "scale(1)",
          paddingLeft: "3px",
        }}>▶</div>
        {lecture.isPlaylist && (
          <span style={{
            position: "absolute", top: "0.6rem", right: "0.6rem",
            background: "rgba(13,9,30,0.85)", color: "#d8af72",
            fontFamily: DM, fontSize: "0.6rem", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "0.3rem 0.6rem", borderRadius: "999px",
            border: "1px solid rgba(216,175,114,0.3)",
          }}>Playlist</span>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: "1.4rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <span className="badge badge-muted" style={{ marginBottom: "0.75rem", display: "inline-block", textTransform: "capitalize", alignSelf: "flex-start" }}>
          {lecture.duration}
        </span>
        <h3 style={{ fontFamily: PF, fontSize: "1.05rem", fontWeight: 500, color: "#fff", marginBottom: "0.4rem", lineHeight: 1.3 }}>
          {lecture.title}
        </h3>
        <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.25rem", fontWeight: 500 }}>
          {lecture.speaker}
        </p>
        <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--muted-2)", lineHeight: 1.65, marginBottom: "1rem", flex: 1 }} className="line-clamp-2">
          {lecture.description}
        </p>
        {url && (
          <p style={{ fontFamily: DM, fontSize: "0.72rem", fontWeight: 700, color: hovered ? "#d8af72" : "var(--muted-2)", letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.2s" }}>
            {lecture.isPlaylist ? "View Playlist" : "Watch on YouTube"} ↗
          </p>
        )}
      </div>
    </div>
  );

  if (!url) return <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>{inner}</div>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", height: "100%" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {inner}
    </a>
  );
}

/* ── CTA BANNER ──────────────────────────────────────────────────────────── */
export function CtaBanner({ title, description, primaryLabel, primaryHref, secondaryLabel, secondaryHref }:
  { title: string; description: string; primaryLabel: string; primaryHref: string; secondaryLabel?: string; secondaryHref?: string }) {
  const isExt = primaryHref.startsWith("http");
  return (
    <div className="cta-band">
      <h2 style={{ fontFamily: PF, fontWeight: 600 }}>{title}</h2>
      <p className="lede" style={{ margin: "0.75rem auto 2rem" }}>{description}</p>
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
