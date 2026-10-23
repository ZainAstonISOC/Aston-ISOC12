import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import HalalList from "@/components/ui/HalalList";
import { getHalalPlaces } from "@/lib/content";
import { igDmLink } from "@/lib/social";

export const metadata: Metadata = {
  title: "Halal Food Near Campus",
  description: "Halal places to eat near Aston University, Birmingham, put together by Aston ISOC.",
};

const DM = "'DM Sans', sans-serif";

export default async function HalalFoodPage() {
  const places = await getHalalPlaces();
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Community", href: "/freshers" }, { label: "Halal Food" }]} />
      <PageHeader label="Eat Well" title="Halal Food Near Campus" subtitle="Places close to Aston, put together by the committee. Always check certification in store." />
      <Reveal>
        {places.length ? (
          <HalalList places={places} />
        ) : (
          <p style={{ fontFamily: DM, color: "var(--muted)" }}>The committee is putting this list together. Check back soon.</p>
        )}
      </Reveal>
      <Reveal>
        <p style={{ fontFamily: DM, fontSize: "0.85rem", color: "var(--muted-2)", marginTop: "2rem" }}>
          Know somewhere we&apos;ve missed, or a place that&apos;s changed?{" "}
          <a href={igDmLink()} target="_blank" rel="noopener noreferrer" style={{ color: "#d8af72" }}>Tell us on Instagram</a>
          {" · "}
          <Link href="/prayer-times" style={{ color: "#d8af72" }}>Prayer rooms on campus</Link>
        </p>
      </Reveal>
    </PageShell>
  );
}
