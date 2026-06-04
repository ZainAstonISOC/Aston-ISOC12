export interface IslamicQuote {
  text: string;
  source: string;
}

export const QUOTES = {
  community:   { text: "The believers, in their mutual love, mercy, and compassion, are like one body.", source: "Prophet Muhammad ﷺ · Bukhari & Muslim" },
  knowledge:   { text: "Seek knowledge from the cradle to the grave.", source: "Attributed tradition" },
  sisters:     { text: "Paradise lies at the feet of mothers.", source: "Prophet Muhammad ﷺ · Nasai" },
  brothers:    { text: "A Muslim is the brother of a Muslim. He does not oppress him, nor does he leave him to be overpowered.", source: "Prophet Muhammad ﷺ · Bukhari & Muslim" },
  charity:     { text: "Charity does not decrease wealth.", source: "Prophet Muhammad ﷺ · Muslim" },
  prayer:      { text: "Indeed, prayer has been decreed upon the believers a decree of specified times.", source: "Surah An-Nisa' · 4:103" },
  volunteer:   { text: "The best of people are those most beneficial to people.", source: "Prophet Muhammad ﷺ · Al-Mu'jam al-Awsat" },
  patience:    { text: "Indeed, Allah is with the patient.", source: "Surah Al-Baqarah · 2:153" },
  intention:   { text: "Actions are judged by intentions.", source: "Prophet Muhammad ﷺ · Bukhari & Muslim" },
  freshers:    { text: "Whoever treads a path seeking knowledge, Allah will make easy for him the path to Paradise.", source: "Prophet Muhammad ﷺ · Muslim" },
  unity:       { text: "And hold firmly to the rope of Allah all together and do not become divided.", source: "Surah Al-Imran · 3:103" },
} as const;
