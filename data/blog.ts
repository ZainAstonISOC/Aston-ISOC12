import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "navigating-university-as-a-muslim",
    title: "Navigating University as a Muslim Student",
    excerpt:
      "Starting university can be overwhelming. Here's how Aston ISOC helps Muslim students maintain their faith, identity, and wellbeing throughout their studies.",
    content: `Starting university is one of the most significant transitions in a young Muslim's life. Away from home, surrounded by new faces, and facing academic pressure it can feel isolating. This is exactly why Aston ISOC exists.\n\nFrom the very first day of freshers week, we ensure that every Muslim student has a community to belong to. Our buddy system, halaqa circles, and regular social events mean you'll never feel alone in your journey.\n\nKeeping up your Salah, finding halal food, and maintaining your Islamic identity on campus are all challenges we've navigated and we've built systems to help you do the same.`,
    author: "Aston ISOC Advocacy Team",
    date: "2025-09-01",
    category: "Student Life",
    tags: ["freshers", "university", "faith", "community"],
  },
  {
    slug: "ramadan-2025-guide",
    title: "Your Complete Ramadan 2025 Guide at Aston",
    excerpt:
      "Everything you need to know about fasting, prayers, iftars, and community events during Ramadan at Aston University.",
    content: `Ramadan at Aston is unlike anywhere else. The community spirit, late-night tarawih prayers, and communal iftars make it one of the most spiritually nourishing months of the year.\n\nThis guide covers prayer timetables for Birmingham, campus iftar arrangements, tarawih locations, and all ISOC's Ramadan programming.`,
    author: "Aston ISOC Advocacy Team",
    date: "2025-02-15",
    category: "Faith & Practice",
    tags: ["ramadan", "fasting", "prayer", "community"],
  },
  {
    slug: "islamic-finance-career-guide",
    title: "Breaking Into Islamic Finance: A Graduate's Guide",
    excerpt:
      "Islamic finance is a growing global industry. Here's how Aston students can build careers in halal banking, investment, and financial services.",
    content: `The Islamic finance industry is now worth over $3 trillion globally and is one of the fastest-growing sectors in finance. For Muslim graduates, it represents a unique opportunity to build careers that align with their values.\n\nThis article explores the key institutions, qualifications (CIMA, ACCA, AAOIFI), and networking strategies to break into the field.`,
    author: "Aston ISOC Advocacy Team",
    date: "2025-03-10",
    category: "Careers",
    tags: ["careers", "finance", "halal", "graduate"],
  },
  {
    slug: "understanding-zakah-in-practice",
    title: "Understanding Zakah: A Practical Guide for Students",
    excerpt:
      "How does Zakah work? What are the nisab thresholds for 2025? A clear and practical breakdown for Muslim students.",
    content: `Zakah is one of the five pillars of Islam and an obligation upon every Muslim who meets the nisab threshold. For students, understanding when and how to pay Zakah can be confusing.\n\nThis guide breaks down the calculations, nisab thresholds for gold and silver in 2025, and how to ensure your Zakah reaches those who truly need it.`,
    author: "Aston ISOC Advocacy Team",
    date: "2025-04-05",
    category: "Islamic Education",
    tags: ["zakah", "finance", "pillars", "education"],
  },
  {
    slug: "sisters-mental-health-islam",
    title: "Mental Health Through an Islamic Lens",
    excerpt:
      "A compassionate exploration of mental health for Muslim students, drawing on Islamic wisdom and modern wellbeing practices.",
    content: `Mental health is one of the most pressing issues facing university students today. For Muslim students, navigating mental health while maintaining faith can be a complex journey.\n\nThis article explores how Islamic principles of tawakkul, sabr, and community support align powerfully with evidence-based wellbeing practices.`,
    author: "Aston ISOC Advocacy Team",
    date: "2025-04-20",
    category: "Wellbeing",
    tags: ["mental-health", "wellbeing", "sisters", "faith"],
  },
  {
    slug: "charity-impact-report-2025",
    title: "Aston ISOC Charity Impact Report 2024/25",
    excerpt:
      "How your donations made a difference this year a full breakdown of every campaign, every pound raised, and every life impacted.",
    content: `This year, Aston ISOC raised over £200,000 for charity. From Palestine emergency relief to local Birmingham food banks, every campaign reflected our commitment to being a community that gives back.\n\nThis report documents every initiative, the organisations we partnered with, and the measurable impact your generosity created.`,
    author: "Aston ISOC Advocacy Team",
    date: "2025-06-01",
    category: "Charity",
    tags: ["charity", "impact", "donations", "community"],
  },
];

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((p) => p.slug === slug);

export const getPostsByCategory = (category: string): BlogPost[] =>
  blogPosts.filter((p) => p.category === category);

export const getRecentPosts = (count = 3): BlogPost[] =>
  [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
