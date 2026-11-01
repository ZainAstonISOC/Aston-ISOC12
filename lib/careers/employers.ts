/**
 * EMPLOYERS READ DIRECTLY
 * ---------------------------------------------------------------
 * UK early-careers employers whose own job sites expose their postings, so a
 * listing links straight to the employer's page. Each entry was checked on
 * 2026-11-01 to return UK graduate, internship, placement or apprenticeship
 * roles.
 *
 * To add one, find a posting URL:
 *   https://{tenant}.{pod}.myworkdayjobs.com/{site}/job/...   → workday
 *   https://boards.greenhouse.io/{board} or job-boards…/{board} → greenhouse
 *   https://jobs.lever.co/{board}                              → lever
 *
 * Workday's job search is the JSON its own careers pages use, not a published
 * API, so an employer can change it without notice. A broken entry only drops
 * that employer; it is reported in the refresh log.
 */

export type EmployerFeed =
  | { kind: "workday"; name: string; tenant: string; pod: string; site: string }
  | { kind: "greenhouse"; name: string; board: string }
  | { kind: "lever"; name: string; board: string };

export const EMPLOYERS: EmployerFeed[] = [
  // Banking, markets and finance
  { kind: "workday", name: "Barclays", tenant: "barclays", pod: "wd3", site: "External_Career_Site_Barclays" },
  { kind: "workday", name: "Lloyds Banking Group", tenant: "lbg", pod: "wd3", site: "Graduate_careers" },
  { kind: "workday", name: "LSEG", tenant: "lseg", pod: "wd3", site: "Graduate_Careers" },
  { kind: "workday", name: "Financial Conduct Authority", tenant: "fca", pod: "wd3", site: "FCA_earlycareers" },
  { kind: "workday", name: "TD Securities", tenant: "td", pod: "wd3", site: "TD_Bank_Careers" },
  { kind: "workday", name: "MUFG", tenant: "mufgub", pod: "wd3", site: "MUFG-Careers" },
  { kind: "workday", name: "Houlihan Lokey", tenant: "hl", pod: "wd1", site: "Campus" },
  { kind: "workday", name: "Blackstone", tenant: "blackstone", pod: "wd1", site: "blackstone_campus_careers" },
  { kind: "workday", name: "TP ICAP", tenant: "tp", pod: "wd107", site: "TP-ICAP" },
  { kind: "workday", name: "Howden", tenant: "hyperiongrp", pod: "wd3", site: "Hyperion_External" },
  { kind: "workday", name: "FTI Consulting", tenant: "fticonsulting", pod: "wd108", site: "FTIConsultingCareers" },
  { kind: "workday", name: "JLL", tenant: "jll", pod: "wd1", site: "jllcareers" },

  // Engineering, energy and industry
  { kind: "workday", name: "Rolls-Royce", tenant: "rollsroyce", pod: "wd3", site: "Intern_Graduate" },
  { kind: "workday", name: "MBDA", tenant: "mbda", pod: "wd3", site: "MBDA-UK" },
  { kind: "workday", name: "Shell", tenant: "shell", pod: "wd3", site: "ShellCareers" },
  { kind: "workday", name: "Maersk", tenant: "maersk", pod: "wd3", site: "Maersk_Careers" },
  { kind: "workday", name: "Liberty Global", tenant: "libertyglobal", pod: "wd3", site: "Liberty_Global_Careers" },

  // Pharma and consumer goods
  { kind: "workday", name: "AstraZeneca", tenant: "astrazeneca", pod: "wd3", site: "Emerging-Talent" },
  { kind: "workday", name: "GSK", tenant: "gsk", pod: "wd5", site: "GSKCareers" },
  { kind: "workday", name: "Vertex", tenant: "vrtx", pod: "wd501", site: "Vertex_Careers" },
  { kind: "workday", name: "Johnson & Johnson", tenant: "jj", pod: "wd5", site: "JJ" },
  { kind: "workday", name: "P&G", tenant: "pg", pod: "wd5", site: "1000" },
  { kind: "workday", name: "Unilever", tenant: "unilever", pod: "wd3", site: "unilever_early_careers" },

  // Technology and trading
  { kind: "greenhouse", name: "Monzo", board: "monzo" },
  { kind: "greenhouse", name: "Stripe", board: "stripe" },
  { kind: "greenhouse", name: "IMC Trading", board: "imc" },
  { kind: "greenhouse", name: "Jump Trading", board: "jumptrading" },
  { kind: "greenhouse", name: "DRW", board: "drweng" },
  { kind: "greenhouse", name: "Deliveroo", board: "deliveroo" },
  { kind: "greenhouse", name: "GoCardless", board: "gocardless" },
  { kind: "lever", name: "Palantir", board: "palantir" },
];
