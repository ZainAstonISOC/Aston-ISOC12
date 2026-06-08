"use client";
import { useState } from "react";
import { CommitteeMember } from "@/types";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

interface Section { key: string; label: string; members: CommitteeMember[]; }

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function CommitteeAccordion({ sections }: { sections: Section[] }) {
  // Core committee open by default, all others closed
  const [open, setOpen] = useState<string[]>(["executive"]);

  const toggle = (key: string) => {
    setOpen(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {sections.map((section, si) => {
        const isOpen = open.includes(section.key);
        const isCoreCommittee = section.key === "executive";

        return (
          <div
            key={section.key}
            style={{
              border: `1px solid ${isOpen ? "rgba(216,175,114,0.35)" : "rgba(216,175,114,0.12)"}`,
              borderRadius: "var(--radius)",
              overflow: "hidden",
              background: isOpen ? "rgba(216,175,114,0.03)" : "var(--surface)",
              transition: "border-color 0.25s, background 0.25s",
            }}
          >
            {/* Header */}
            <button
              onClick={() => toggle(section.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.4rem 1.75rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: isOpen ? "rgba(216,175,114,0.18)" : "rgba(216,175,114,0.08)",
                  border: "1px solid rgba(216,175,114,0.2)",
                  display: "grid", placeItems: "center",
                  fontFamily: DM, fontSize: "0.7rem", fontWeight: 700, color: "#d8af72",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}>
                  {section.members.length}
                </div>
                <div>
                  <p style={{ fontFamily: PF, fontSize: "1.15rem", fontWeight: 500, color: "#fff", marginBottom: "0.1rem" }}>
                    {isCoreCommittee ? "Core Committee" : section.label}
                  </p>
                  {!isOpen && (
                    <p style={{ fontFamily: DM, fontSize: "0.78rem", color: "#8d86a3" }}>
                      {section.members.map(m => m.name.split(" ")[0]).join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#d8af72" strokeWidth="2" strokeLinecap="round"
                style={{ flexShrink: 0, transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "none" }}
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {/* Content */}
            {isOpen && (
              <div style={{ padding: "0 1.75rem 1.75rem" }}>
                <div style={{ height: "1px", background: "rgba(216,175,114,0.1)", marginBottom: "1.5rem" }} />
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isCoreCommittee
                    ? "repeat(auto-fill, minmax(220px, 1fr))"
                    : "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "1rem",
                }}>
                  {section.members.map(member => (
                    <div key={member.id}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(216,175,114,0.1)",
                        borderRadius: "14px",
                        padding: "1.25rem",
                        transition: "border-color 0.2s, background 0.2s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(216,175,114,0.3)";
                        (e.currentTarget as HTMLDivElement).style.background = "rgba(216,175,114,0.05)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(216,175,114,0.1)";
                        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: "rgba(216,175,114,0.12)",
                        border: "1px solid rgba(216,175,114,0.25)",
                        display: "grid", placeItems: "center",
                        fontFamily: PF, fontSize: "0.9rem", fontWeight: 600, color: "#d8af72",
                        marginBottom: "0.85rem",
                      }}>
                        {initials(member.name)}
                      </div>
                      <p style={{ fontFamily: PF, fontSize: "0.95rem", fontWeight: 500, color: "#fff", marginBottom: "0.15rem" }}>
                        {member.name}
                      </p>
                      <p style={{ fontFamily: DM, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#d8af72", marginBottom: "0.5rem" }}>
                        {member.role}
                      </p>
                      <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "#8d86a3", lineHeight: 1.6 }}>
                        {member.bio}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
