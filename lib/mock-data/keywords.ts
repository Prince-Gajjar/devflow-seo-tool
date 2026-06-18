import { createSeedRandom } from "../utils";

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  cpc: number;
  competition: "Low" | "Medium" | "High";
  trend: number[];
}

export function generateKeywords(seed: string): KeywordSuggestion[] {
  const cleanSeed = seed.trim().toLowerCase();
  const rand = createSeedRandom(cleanSeed);

  const prefixes = ["best", "how to", "top", "cheap", "free", "easy", "ultimate", "local", "online", "professional"];
  const suffixes = ["tool", "guide", "tutorial", "tips", "for beginners", "strategy", "services", "agency", "examples", "software"];
  const questionForms = ["what is", "how does", "why use", "is it worth doing"];

  // Generate unique suggestion strings
  const suggestionsSet = new Set<string>();
  
  // Base seed itself
  suggestionsSet.add(cleanSeed);
  
  // Add some simple variations
  suggestionsSet.add(`${cleanSeed} ${suffixes[Math.floor(rand() * suffixes.length)]}`);
  suggestionsSet.add(`${cleanSeed} ${suffixes[Math.floor(rand() * suffixes.length)]}`);
  suggestionsSet.add(`${prefixes[Math.floor(rand() * prefixes.length)]} ${cleanSeed}`);
  suggestionsSet.add(`${prefixes[Math.floor(rand() * prefixes.length)]} ${cleanSeed} ${suffixes[Math.floor(rand() * suffixes.length)]}`);

  // Generate 20 distinct keyword suggestions
  while (suggestionsSet.size < 25) {
    const r = rand();
    let kw = "";
    if (r < 0.3) {
      const pref = prefixes[Math.floor(rand() * prefixes.length)];
      kw = `${pref} ${cleanSeed}`;
    } else if (r < 0.6) {
      const suff = suffixes[Math.floor(rand() * suffixes.length)];
      kw = `${cleanSeed} ${suff}`;
    } else if (r < 0.8) {
      const pref = prefixes[Math.floor(rand() * prefixes.length)];
      const suff = suffixes[Math.floor(rand() * suffixes.length)];
      kw = `${pref} ${cleanSeed} ${suff}`;
    } else {
      const q = questionForms[Math.floor(rand() * questionForms.length)];
      kw = `${q} ${cleanSeed}`;
    }
    suggestionsSet.add(kw);
  }

  // Convert to KeywordSuggestion objects with deterministic properties
  return Array.from(suggestionsSet).map((kw, index) => {
    const itemRand = createSeedRandom(kw + cleanSeed); // seed for item properties
    
    // Monthly Volume: 500 to 95,000 (higher for shorter terms, lower for longer ones)
    const lengthFactor = Math.max(0.1, 1 - (kw.split(" ").length - 1) * 0.15);
    const volume = Math.floor((itemRand() * 90000 + 500) * lengthFactor);
    
    // CPC: $0.10 to $15.00
    const cpc = Math.round((itemRand() * 14.9 + 0.1) * 100) / 100;
    
    // Competition
    const compVal = itemRand();
    let competition: "Low" | "Medium" | "High" = "Medium";
    if (compVal < 0.33) competition = "Low";
    else if (compVal < 0.67) competition = "Medium";
    else competition = "High";
    
    // Trend: 7-day sparkline trend data
    const baseTrend = itemRand() * 100;
    const trend = Array.from({ length: 7 }, () => {
      const fluctuation = (itemRand() - 0.5) * 30; // +/- 15%
      return Math.max(10, Math.round(baseTrend + fluctuation));
    });

    return {
      keyword: kw,
      volume,
      cpc,
      competition,
      trend
    };
  });
}
