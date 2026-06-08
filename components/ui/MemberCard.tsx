"use client";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

interface Member {
  id: string;
  name: string;
  role: string;
  bio: string;
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function MemberCard({ member, large = false }: { member: Member; large?: boolean }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid rgba(216,175,114,0.14)",
        borderRadius: "var(--radius)",
        padding: large ? "2rem" : "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transition: "border-color 0.22s, transform 0.22s, box-shadow 0.22s",
        cursor: "default",
        height: "100%",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(216,175,114,0.4)";
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = "0 14px 40px -18px rgba(0,0,0,0.7)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(216,175,114,0.14)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div style={{
        width: large ? 80 : 64,
        height: large ? 80 : 64,
        borderRadius: "50%",
        background: "linear-gradient(145deg, rgba(216,175,114,0.22), rgba(216,175,114,0.05))",
        border: "1px solid rgba(216,175,114,0.3)",
        display: "grid", placeItems: "center",
        fontFamily: PF,
        fontSize: large ? "1.4rem" : "1.1rem",
        fontWeight: 600,
        color: "#d8af72",
        marginBottom: large ? "1.2rem" : "1rem",
        flexShrink: 0,
      }}>
        {initials(member.name)}
      </div>
      <p style={{ fontFamily: PF, fontSize: large ? "1.15rem" : "1rem", fontWeight: 500, color: "#fff", marginBottom: "0.2rem", lineHeight: 1.25 }}>
        {member.name}
      </p>
      <p style={{ fontFamily: DM, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#d8af72", marginBottom: "0.65rem" }}>
        {member.role}
      </p>
      <p style={{ fontFamily: DM, fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.65 }}>
        {member.bio}
      </p>
    </div>
  );
}
