import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Log in" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <PageShell>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <p className="eyebrow">Committee only</p>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.6rem)", marginBottom: "0.75rem" }}>
          Admin
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--muted)", marginBottom: "2rem", lineHeight: 1.7 }}>
          Log in to add, edit and remove events on the website.
        </p>
        <div className="card" style={{ padding: "1.75rem" }}>
          <LoginForm />
        </div>
      </div>
    </PageShell>
  );
}
