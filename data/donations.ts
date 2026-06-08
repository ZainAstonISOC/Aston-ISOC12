/**
 * DONATION CAMPAIGNS
 * ─────────────────────────────────────────────────────
 * Source: https://linktr.ee/astonisoc (verified May 2026)
 *
 * To add/archive a campaign: edit this file only.
 * Page layouts will update automatically.
 */

import { DonationCampaign } from "@/types";
import { DONATIONS } from "@/lib/social";

export const donationCampaigns: DonationCampaign[] = [
  {
    id: "ramadan-iftar-2026",
    name: "Ramadan Iftaar Campaign",
    description:
      "With immense joy and gratitude to Allah (SWT), Aston ISOC is raising funds to provide Iftaar meals for students and the local community during Ramadan. Your donation directly feeds our brothers and sisters breaking their fast.",
    donationUrl: DONATIONS.ramadanFundraiser,
    status: "active",
    isFeatured: true,
    organisation: "GoFundMe Aston ISOC",
  },
  {
    id: "general-charity",
    name: "General Charity Fund",
    description:
      "Support ISOC's ongoing charitable work. Funds are distributed across local and international causes including food banks, education support, and emergency relief.",
    donationUrl: DONATIONS.general,
    status: "active",
    isFeatured: false,
  },
];

export const getActiveCampaigns = () =>
  donationCampaigns.filter((c) => c.status === "active");

export const getFeaturedCampaign = () =>
  donationCampaigns.find((c) => c.isFeatured && c.status === "active");
