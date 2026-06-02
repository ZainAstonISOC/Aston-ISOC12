import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PageHeader, BlogCard } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = { title: "Blog & Articles" };

export default function BlogPage() {
  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Blog & Articles" }]} />
      <PageHeader label="Knowledge & Insight" title="Blog & Articles" subtitle="Perspectives on faith, student life, careers, and community." />
      <div className="flex flex-wrap gap-2 mb-10">
        {Array.from(new Set(blogPosts.map((p) => p.category))).map((cat) => (
          <span key={cat} className="badge badge-muted" style={{ padding: "0.4rem 1rem" }}>{cat}</span>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogPosts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 60}>
            <BlogCard post={p} />
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}
