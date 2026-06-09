export type CommitteeSection =
  | "executive" | "academic" | "jummah" | "marketing"
  | "social_media" | "education" | "advocacy"
  | "sisters" | "brothers" | "general";

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  year: string;
  bio: string;
  email?: string;
  linkedin?: string;
  photo?: string;
  section: CommitteeSection;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: "all" | "sisters" | "brothers" | "jummah" | "charity" | "sports" | "speaker" | "freshers" | "social";
  description: string;
  registrationUrl?: string;
  image?: string;
  isFeatured?: boolean;
  isRecurring?: boolean;
  recurringNote?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category:
    | "quran" | "hadith" | "fiqh" | "dawah" | "general"
    | "new-muslim" | "dua" | "study-skills" | "wellbeing"
    | "student-finance" | "productivity" | "community";
  type: "pdf" | "link" | "video" | "audio";
  url: string;
  isExternal?: boolean;
}

export interface Lecture {
  id: string;
  title: string;
  speaker: string;
  series: string;
  duration: string;
  date: string;
  youtubeId?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  category: "khutbah" | "lecture" | "halaqa" | "podcast" | "event";
  description: string;
  thumbnailUrl?: string;
}

export interface DonationCampaign {
  id: string;
  name: string;
  description: string;
  donationUrl: string;
  status: "active" | "completed" | "upcoming";
  isFeatured?: boolean;
  targetAmount?: number;
  raisedAmount?: number;
  deadline?: string;
  organisation?: string;
}

export interface CharityInitiative {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  deadline?: string;
  donationUrl?: string;
  isActive: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  organisation: string;
  type: "graduate" | "placement" | "internship" | "volunteer" | "workshop" | "networking";
  location: string;
  deadline?: string;
  url: string;
  description: string;
  isIslamicFinance?: boolean;
}

export interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  iqamaTime?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: "gold" | "silver" | "bronze" | "community";
  website: string;
  description: string;
  logo?: string;
}

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  icon: string;
}
