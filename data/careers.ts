import { JobListing } from "@/types";

export const jobListings: JobListing[] = [
  { id: "j1", title: "Graduate Analyst — Islamic Finance", organisation: "Al Rayan Bank", type: "graduate", location: "Birmingham", deadline: "2026-08-31", url: "https://www.alrayanbank.co.uk/careers", description: "Join the UK's premier Sharia-compliant retail bank as a graduate analyst.", isIslamicFinance: true },
  { id: "j2", title: "Summer Internship — Humanitarian Programme", organisation: "Islamic Relief UK", type: "internship", location: "Birmingham / Remote", deadline: "2026-07-15", url: "https://www.islamic-relief.org.uk/get-involved/work-with-us/", description: "10-week internship across humanitarian programmes and UK policy advocacy." },
  { id: "j3", title: "Software Engineering Placement", organisation: "Aston University IT Services", type: "placement", location: "Birmingham", url: "https://www.aston.ac.uk/careers", description: "12-month industrial placement supporting the university's digital transformation." },
  { id: "j4", title: "ISOC Committee — Join the Team", organisation: "Aston ISOC", type: "volunteer", location: "Aston University, Birmingham", url: "/join", description: "Committee elections open every May. Lead your community and build real leadership experience." },
  { id: "j5", title: "Takaful (Islamic Insurance) Graduate Scheme", organisation: "Cobalt Underwriting", type: "graduate", location: "London (Hybrid)", url: "https://cobaltunderwriting.co.uk", description: "Graduate scheme within the Islamic insurance (Takaful) sector.", isIslamicFinance: true },
  { id: "j6", title: "Finance & Compliance Internship", organisation: "Bank of London and the Middle East", type: "internship", location: "London", url: "https://www.blme.com/careers", description: "Summer internship in Sharia-compliant finance operations and compliance.", isIslamicFinance: true },
];

export const getIslamicFinanceRoles = () => jobListings.filter((j) => j.isIslamicFinance);
export const getRolesByType = (type: JobListing["type"]) => jobListings.filter((j) => j.type === type);
