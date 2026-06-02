import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BlogCard } from "@/components/ui/Cards";
import Reveal from "@/components/ui/Reveal";
import { getPostBySlug, blogPosts, getRecentPosts } from "@/data/blog";

export async function generateStaticParams() { return blogPosts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: post?.title ?? "Post Not Found" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const related = getRecentPosts(3).filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <PageShell>
      <Breadcrumb crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
      <Reveal>
        <div className="max-w-2xl mb-16">
          <div className="flex gap-2 flex-wrap mb-6">
            <span className="badge badge-muted">{post.category}</span>
            {post.tags.map((t) => (
              <span key={t} className="badge" style={{ background: "rgba(201,162,39,0.08)", color: "#9CA3AF", border: "1px solid rgba(201,162,39,0.15)", fontSize: "0.58rem" }}>
                #{t}
              </span>
            ))}
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
            {post.title}
          </h1>
          <span className="gold-rule" />
          <div className="flex items-center gap-6 mb-8">
            <span className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>✍ {post.author}</span>
            <span className="text-xs" style={{ color: "#6B7280", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>
              {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <p className="text-base leading-relaxed mb-8 italic" style={{ color: "#C9A227", fontFamily: "var(--font-playfair), var(--font-playfair), 'Playfair Display', Georgia, serif", fontSize: "1.1rem" }}>
            {post.excerpt}
          </p>
          <div className="space-y-5">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm leading-relaxed" style={{ color: "#9CA3AF", fontFamily: "var(--font-dm), var(--font-dm), 'DM Sans', sans-serif" }}>{para}</p>
            ))}
          </div>
          <div className="mt-10 flex gap-3">
            <Link href="/blog" className="btn-ghost">← Back to Blog</Link>
            <Link href="/contact" className="btn-outline-gold">Contact Us</Link>
          </div>
        </div>
      </Reveal>
      {related.length > 0 && (
        <Reveal>
          <div className="pt-10" style={{ borderTop: "1px solid rgba(201,162,39,0.1)" }}>
            <p className="label mb-6">Continue Reading</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((p) => <BlogCard key={p.slug} post={p} />)}
            </div>
          </div>
        </Reveal>
      )}
    </PageShell>
  );
}
