/**
 * VOLUNTEER OPPORTUNITIES DATA
 * Add new campaigns here the volunteer page updates automatically.
 * To archive a campaign: set status to "archived".
 */
export interface VolunteerCampaign {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: "active" | "upcoming" | "archived";
  roles: string[];
  commitment: string;
  impact: string;
  signupUrl?: string;   // link to form add when available
  colour: string;       // accent colour for card
  icon: string;
}

export const volunteerCampaigns: VolunteerCampaign[] = [
  {
    id: "ramadan",
    name: "Ramadan",
    tagline: "The Most Blessed Month",
    description:
      "Ramadan is the biggest and most spiritually significant campaign of the year. Volunteers organise iftaar events, tarawih coordination, charity drives, and community support for the entire Muslim community at Aston.",
    status: "upcoming",
    roles: ["Iftaar Coordinator", "Charity Fundraiser", "Logistics Volunteer", "Sisters' Lead", "Brothers' Lead", "Social Media Volunteer"],
    commitment: "4–8 hours/week during Ramadan",
    impact: "Serves 200+ students with community iftaars and raises £10,000+ for charity",
    colour: "rgba(201,162,39,0.12)",
    icon: "🌙",
  },
  {
    id: "diw",
    name: "Discover Islam Week",
    tagline: "Opening Doors. Building Bridges.",
    description:
      "Discover Islam Week (DIW) is Aston ISOC's flagship dawah event a week-long programme of talks, exhibitions, and open conversations that welcome the whole university community to learn about Islam. Volunteers are at the heart of making it happen.",
    status: "active",
    roles: ["Event Host", "Exhibition Coordinator", "Guest Speaker Liaison", "Stall Volunteer", "Social Media", "Registration Desk"],
    commitment: "3–6 hours/day during DIW week",
    impact: "Reaches 500+ non-Muslim students annually and generates meaningful conversations",
    colour: "rgba(99,91,255,0.1)",
    icon: "🤝",
  },
  {
    id: "charity-week",
    name: "Charity Week",
    tagline: "Give. Impact. Transform.",
    description:
      "Charity Week is one of the largest student charity campaigns in the UK. Aston ISOC volunteers organise fundraising events, challenges, and campaigns over an intensive week to raise as much as possible for verified humanitarian causes.",
    status: "upcoming",
    roles: ["Fundraising Lead", "Event Organiser", "Street Collection Volunteer", "Social Media Coordinator", "Sponsorship Volunteer", "Team Captain"],
    commitment: "5–10 hours during Charity Week",
    impact: "Part of the national campaign that raises millions annually for humanitarian causes",
    colour: "rgba(52,211,153,0.1)",
    icon: "🌍",
  },
];

export const getActiveCampaigns = () =>
  volunteerCampaigns.filter((c) => c.status === "active" || c.status === "upcoming");
