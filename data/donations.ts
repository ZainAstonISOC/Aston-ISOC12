/**
 * DONATION CAMPAIGNS
 * ─────────────────────────────────────────────────────
 * Source: https://linktr.ee/astonisoc (verified May 2026)
 *
 * These are only the starting values: the committee manages fundraisers at
 * /admin/content/fundraisers, and once saved there this file is not read.
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
    // Ramadan 2026 ended in March. Switch it back on from /admin next Ramadan.
    status: "completed",
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

