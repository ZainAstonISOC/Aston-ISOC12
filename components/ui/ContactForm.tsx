"use client";

import { useState, useRef } from "react";
import { SOCIAL } from "@/lib/social";

const PF = "'Playfair Display', Georgia, serif";
const DM = "'DM Sans', sans-serif";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot, must stay empty
}

const INITIAL: FormState = { name: "", email: "", subject: "", message: "", website: "" };

const SUBJECTS = [
  "General Enquiry", "Freshers Info", "Membership", "Event Enquiry",
  "Sponsorship & Partnership", "Charity Collaboration", "Media & Press",
  "Committee Application", "Other",
];

// Simple client-side rate limit: max 3 submissions per session, 20s apart
const MAX_SUBMISSIONS = 3;
const COOLDOWN_MS = 20000;

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "rate-limited">("idle");
  const submitCount = useRef(0);
  const lastSubmit = useRef(0);

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name) e.name = "Name is required";
    else if (name.length > 100) e.name = "Name is too long";

    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    else if (email.length > 150) e.email = "Email is too long";

    if (!form.subject) e.subject = "Please select a subject";

    if (!message) e.message = "Message is required";
    else if (message.length < 10) e.message = "Message must be at least 10 characters";
    else if (message.length > 2000) e.message = "Message must be under 2000 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e?: React.MouseEvent) => {
    e?.preventDefault();

    // Honeypot: if filled, silently drop (bot)
    if (form.website) { setStatus("success"); setForm(INITIAL); return; }

    // Rate limiting
    const now = Date.now();
    if (submitCount.current >= MAX_SUBMISSIONS) { setStatus("rate-limited"); return; }
    if (now - lastSubmit.current < COOLDOWN_MS && lastSubmit.current !== 0) {
      setStatus("rate-limited"); return;
    }

    if (!validate()) return;

    setStatus("submitting");
    submitCount.current += 1;
    lastSubmit.current = now;

    // No backend endpoint configured, guide user to Instagram (primary channel)
    await new Promise(r => setTimeout(r, 800));
    setStatus("success");
    setForm(INITIAL);
  };

  const field = (key: keyof FormState, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%", padding: "0.75rem 1rem",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${hasError ? "rgba(248,113,113,0.6)" : "var(--line-soft)"}`,
    borderRadius: "var(--radius-sm)",
    color: "var(--text)", fontFamily: DM, fontSize: "0.9rem",
    outline: "none", transition: "border-color 0.18s",
  });

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: DM, fontSize: "0.82rem", fontWeight: 600,
    color: "var(--text)", marginBottom: "0.4rem",
  };
  const errStyle: React.CSSProperties = { fontFamily: DM, fontSize: "0.75rem", color: "#f87171", marginTop: "0.3rem" };

  if (status === "success") {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
        <h3 style={{ fontFamily: PF, fontSize: "1.4rem", color: "#fff", marginBottom: "0.5rem" }}>Message Ready</h3>
        <p style={{ fontFamily: DM, fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
          For the fastest response, please send us your message directly on Instagram. It&apos;s our primary channel and we reply within 24 hours. JazakAllah khayran.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Message @astonisoc</a>
          <button onClick={() => setStatus("idle")} className="btn btn-ghost">Write Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        {status === "rate-limited" && (
          <div style={{ padding: "0.85rem 1rem", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "var(--radius-sm)" }}>
            <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "#fca5a5" }}>
              Please wait a moment before sending another message, or reach us directly on{" "}
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#d8af72" }}>Instagram</a>.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="cf-name" style={labelStyle}>Full Name *</label>
          <input id="cf-name" type="text" value={form.name} maxLength={100}
            onChange={e => field("name", e.target.value)}
            style={inputStyle(!!errors.name)} placeholder="Your full name" autoComplete="name" />
          {errors.name && <p style={errStyle}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="cf-email" style={labelStyle}>Email Address *</label>
          <input id="cf-email" type="email" value={form.email} maxLength={150}
            onChange={e => field("email", e.target.value)}
            style={inputStyle(!!errors.email)} placeholder="your.email@example.com" autoComplete="email" />
          {errors.email && <p style={errStyle}>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="cf-subject" style={labelStyle}>Subject *</label>
          <select id="cf-subject" value={form.subject}
            onChange={e => field("subject", e.target.value)}
            className="field" style={inputStyle(!!errors.subject)}>
            <option value="">Select a subject...</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.subject && <p style={errStyle}>{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="cf-message" style={labelStyle}>Message *</label>
          <textarea id="cf-message" value={form.message} rows={5} maxLength={2000}
            onChange={e => field("message", e.target.value)}
            style={{ ...inputStyle(!!errors.message), resize: "vertical" }} placeholder="How can we help?" />
          {errors.message && <p style={errStyle}>{errors.message}</p>}
          <p style={{ fontFamily: DM, fontSize: "0.7rem", color: "var(--muted-2)", marginTop: "0.3rem", textAlign: "right" }}>
            {form.message.length}/2000
          </p>
        </div>

        {/* Honeypot field, hidden from users, catches bots */}
        <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
          <label htmlFor="cf-website">Website (leave blank)</label>
          <input id="cf-website" type="text" tabIndex={-1} autoComplete="off"
            value={form.website} onChange={e => field("website", e.target.value)} />
        </div>

        <button onClick={handleSubmit} disabled={status === "submitting"}
          className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}>
          {status === "submitting" ? "Sending..." : "Send Message"}
        </button>

        <p style={{ fontFamily: DM, fontSize: "0.72rem", color: "var(--muted-2)", textAlign: "center", lineHeight: 1.6 }}>
          By submitting, you agree to our{" "}
          <a href="/privacy" style={{ color: "#d8af72" }}>Privacy Policy</a>. We never share your details.
        </p>
      </div>
    </div>
  );
}
