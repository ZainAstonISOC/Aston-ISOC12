import { redirect } from "next/navigation";
export default function BlogPostPage() { redirect("/resources"); }
export async function generateStaticParams() { return []; }
