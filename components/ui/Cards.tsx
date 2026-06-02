"use client";
import Link from "next/link";
import { useState } from "react";
import { Event, BlogPost, CommitteeMember, Resource, Lecture } from "@/types";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

/* ── PAGE HEADER ─────────────────────────────────────────────────────────── */
export function PageHeader({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-20">
      {label && <p className="label mb-4">{label}</p>}
      <h1 style={{ fontFamily: PF, fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 500, color: "#fff", lineHeight: 1.08 }}>
        {title}
      </h1>
      <span className="gold-rule" />
      {subtitle && (
        <p className="max-w-2xl leading-relaxed" style={{ color: "#A8A8B3", fontSize: "0.95rem", fontFamily: DM, lineHeight: 1.8 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ── EVENT CARD (L2 hover) ──────────────────────────────────────────────── */
const EVENT_BADGE: Record<string, string> = {
  all:"badge-all", sisters:"badge-sisters", brothers:"badge-brothers",
  jummah:"badge-jummah", charity:"badge-charity", sports:"badge-sports",
  speaker:"badge-speaker", freshers:"badge-freshers", social:"badge-social",
};
const EVENT_LABELS: Record<string, string> = {
  all:"All Welcome", sisters:"Sisters Only", brothers:"Brothers Only",
  jummah:"Jumu'ah", charity:"Charity", sports:"Sports",
  speaker:"Speaker", freshers:"Freshers", social:"Social",
};

export function EventCard({ event }: { event: Event }) {
  const [hovered, setHovered] = useState(false);
  const d = new Date(event.date);
  return (
    <Link href={`/events/${event.id}`} className="block">
      <div
        className="h-full flex flex-col overflow-hidden"
        style={{
          background: hovered
            ? "linear-gradient(135deg, #131629 0%, #0F1220 100%)"
            : "linear-gradient(135deg, #131629 0%, #0D1025 100%)",
          border: `1px solid ${hovered ? "rgba(201,162,39,0.42)" : "rgba(201,162,39,0.13)"}`,
          borderRadius: "1.125rem",
          transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
          transform: hovered ? "translateY(-5px)" : "translateY(0)",
          boxShadow: hovered ? "0 18px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,162,39,0.1)" : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Date bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4"
          style={{ borderBottom: "1px solid rgba(201,162,39,0.07)" }}>
          <div className="flex items-baseline gap-2.5">
            <span style={{ fontFamily: PF, fontSize: "2.8rem", fontWeight: 400, color: hovered ? "#D4AF37" : "#C9A227", lineHeight: 1, transition: "color 0.2s" }}>
              {d.getDate().toString().padStart(2, "0")}
            </span>
            <span className="text-xs font-semibold tracking-widest" style={{ color: "#6B6B80", fontFamily: DM }}>
              {d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase()}
            </span>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            <span className={`badge ${EVENT_BADGE[event.category] ?? "badge-muted"}`}>
              {EVENT_LABELS[event.category] ?? event.category}
            </span>
            {event.isRecurring && <span className="badge badge-muted">Recurring</span>}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-5">
          <h3 style={{ fontFamily: PF, fontSize: "1.2rem", fontWeight: 500, color: "#fff", marginBottom: "0.5rem", lineHeight: 1.25 }}>
            {event.title}
          </h3>
          {event.recurringNote && (
            <p className="text-xs mb-2" style={{ color: "#C9A227", fontFamily: DM }}>{event.recurringNote}</p>
          )}
          <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "#6B6B80", fontFamily: DM }}>
            {event.description}
          </p>
          <div className="space-y-1">
            <p className="text-xs" style={{ color: "#4B4B60", fontFamily: DM }}>⏰ {event.time}</p>
            <p className="text-xs" style={{ color: "#4B4B60", fontFamily: DM }}>📍 {event.location}</p>
          </div>
        </div>

        {/* CTA — revealed on hover */}
        <div className="px-5 pb-5 flex items-center gap-2"
          style={{ opacity: hovered ? 1 : 0.4, transition: "opacity 0.25s" }}>
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C9A227", fontFamily: DM }}>
            View Details
          </span>
          <span style={{ color: "#C9A227", fontSize: "0.7rem", transition: "transform 0.2s", transform: hovered ? "translateX(4px)" : "none" }}>→</span>
        </div>
      </div>
    </Link>
  );
}

/* ── BLOG CARD (L2 hover) ──────────────────────────────────────────────── */
export function BlogCard({ post }: { post: BlogPost }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <div
        className="h-full flex flex-col p-6"
        style={{
          background: "#131629",
          border: `1px solid ${hovered ? "rgba(201,162,39,0.4)" : "rgba(201,162,39,0.1)"}`,
          borderRadius: "1.125rem",
          transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? "0 14px 40px rgba(0,0,0,0.42)" : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="badge badge-muted self-start mb-4">{post.category}</span>
        <h3 style={{ fontFamily: PF, fontSize: "1.15rem", fontWeight: 500, color: "#fff", marginBottom: "0.75rem", lineHeight: 1.25 }}>
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed flex-1 mb-5 line-clamp-3" style={{ color: "#6B6B80", fontFamily: DM }}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "#4B4B60", fontFamily: DM }}>{post.author}</span>
          <span className="text-xs" style={{ color: "#4B4B60", fontFamily: DM }}>
            {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── MEMBER CARD (L1 hover, initials only) ─────────────────────────────── */
export function MemberCard({ member }: { member: CommitteeMember }) {
  const [hovered, setHovered] = useState(false);
  const initials = member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="p-6"
      style={{
        background: "#131629",
        border: `1px solid ${hovered ? "rgba(201,162,39,0.32)" : "rgba(201,162,39,0.1)"}`,
        borderRadius: "1.125rem",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.38), 0 0 0 1px rgba(201,162,39,0.08)" : "none",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex items-center justify-center w-11 h-11 mb-4"
        style={{
          background: hovered ? "rgba(201,162,39,0.12)" : "rgba(201,162,39,0.07)",
          border: `1px solid ${hovered ? "rgba(201,162,39,0.38)" : "rgba(201,162,39,0.2)"}`,
          borderRadius: "50%",
          fontFamily: PF,
          fontSize: "1rem",
          fontWeight: 600,
          color: "#C9A227",
          transition: "all 0.25s",
        }}
      >
        {initials}
      </div>
      <h3 style={{ fontFamily: PF, fontSize: "1.05rem", fontWeight: 500, color: "#fff", marginBottom: "0.2rem" }}>{member.name}</h3>
      <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#C9A227", fontFamily: DM }}>{member.role}</p>
      {member.department && <p className="text-xs mb-2.5" style={{ color: "#4B4B60", fontFamily: DM }}>{member.department}</p>}
      <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#6B6B80", fontFamily: DM }}>{member.bio}</p>
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
          className="mt-3 block text-xs transition-colors" style={{ color: "#4B4B60", fontFamily: DM }}
          onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "#C9A227")}
          onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "#4B4B60")}>
          LinkedIn →
        </a>
      )}
    </div>
  );
}

/* ── RESOURCE ITEM (L1 hover) ──────────────────────────────────────────── */
const TYPE_ICONS: Record<Resource["type"], string> = { pdf: "PDF", link: "→", video: "▶", audio: "♪" };

export function ResourceItem({ resource }: { resource: Resource }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={resource.url}
      target={resource.isExternal ? "_blank" : undefined}
      rel={resource.isExternal ? "noopener noreferrer" : undefined}
      className="flex items-start gap-4 p-4"
      style={{
        background: hovered ? "rgba(201,162,39,0.05)" : "rgba(19,22,41,0.7)",
        border: `1px solid ${hovered ? "rgba(201,162,39,0.3)" : "rgba(201,162,39,0.09)"}`,
        borderRadius: "0.875rem",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-center w-9 h-9 shrink-0 text-xs font-bold"
        style={{
          background: hovered ? "rgba(201,162,39,0.15)" : "rgba(201,162,39,0.08)",
          border: "1px solid rgba(201,162,39,0.2)",
          borderRadius: "0.5rem",
          color: "#C9A227",
          fontFamily: DM,
          transition: "background 0.2s",
        }}>
        {TYPE_ICONS[resource.type]}
      </div>
      <div>
        <p className="font-medium text-sm mb-0.5" style={{ color: "#EAEAEA", fontFamily: DM }}>{resource.title}</p>
        <p className="text-xs leading-relaxed" style={{ color: "#6B6B80", fontFamily: DM }}>{resource.description}</p>
        <p className="text-xs mt-1 capitalize" style={{ color: "#4B4B60", fontFamily: DM }}>{resource.type}</p>
      </div>
    </a>
  );
}

/* ── LECTURE CARD (L2 hover) ────────────────────────────────────────────── */
export function LectureCard({ lecture }: { lecture: Lecture }) {
  const [hovered, setHovered] = useState(false);
  const url = lecture.youtubeUrl ?? lecture.spotifyUrl;
  const inner = (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        background: "#131629",
        border: `1px solid ${hovered ? "rgba(201,162,39,0.38)" : "rgba(201,162,39,0.1)"}`,
        borderRadius: "1.125rem",
        transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 14px 42px rgba(0,0,0,0.45)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-center aspect-video relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F1220, #151937)" }}>
        <div className="absolute inset-0 geo-pattern opacity-25" />
        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full"
          style={{
            background: hovered ? "rgba(201,162,39,0.2)" : "rgba(201,162,39,0.1)",
            border: `1px solid ${hovered ? "rgba(201,162,39,0.5)" : "rgba(201,162,39,0.3)"}`,
            transition: "all 0.25s",
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}>
          <span style={{ color: "#C9A227" }}>▶</span>
        </div>
      </div>
      <div className="flex-1 p-5">
        <span className="badge badge-muted mb-3 inline-block capitalize">{lecture.category}</span>
        <h3 style={{ fontFamily: PF, fontSize: "1.05rem", fontWeight: 500, color: "#fff", marginBottom: "0.4rem", lineHeight: 1.25 }}>
          {lecture.title}
        </h3>
        <p className="text-sm" style={{ color: "#A8A8B3", fontFamily: DM }}>{lecture.speaker}</p>
        <p className="text-xs mt-0.5 mb-3" style={{ color: "#4B4B60", fontFamily: DM }}>{lecture.series} · {lecture.duration}</p>
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#6B6B80", fontFamily: DM }}>{lecture.description}</p>
      </div>
    </div>
  );
  if (url) return <a href={url} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>;
  return <div className="block">{inner}</div>;
}

/* ── CTA BANNER ─────────────────────────────────────────────────────────── */
export function CtaBanner({ title, description, primaryLabel, primaryHref, secondaryLabel, secondaryHref }:
  { title: string; description: string; primaryLabel: string; primaryHref: string; secondaryLabel?: string; secondaryHref?: string }) {
  const isExt = primaryHref.startsWith("http");
  return (
    <div className="text-center p-14 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(201,162,39,0.07) 0%, rgba(21,25,55,0.9) 50%, rgba(201,162,39,0.04) 100%)",
        border: "1px solid rgba(201,162,39,0.2)",
        borderRadius: "1.5rem",
      }}>
      <div className="absolute inset-0 geo-pattern opacity-25" />
      <div className="relative z-10">
        <h2 style={{ fontFamily: PF, fontSize: "clamp(1.9rem,3vw,2.7rem)", fontWeight: 500, color: "#fff", marginBottom: "0.85rem" }}>
          {title}
        </h2>
        <p className="max-w-md mx-auto mb-9 leading-relaxed" style={{ color: "#A8A8B3", fontSize: "0.92rem", fontFamily: DM }}>
          {description}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {isExt
            ? <a href={primaryHref} target="_blank" rel="noopener noreferrer" className="btn-gold">{primaryLabel}</a>
            : <Link href={primaryHref} className="btn-gold">{primaryLabel}</Link>}
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref} className="btn-outline-gold">{secondaryLabel}</Link>
          )}
        </div>
      </div>
    </div>
  );
}
