import { createSeedRandom } from "../utils";

export interface SerpResultItem {
  position: number;
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  isAd?: boolean;
}

export interface SerpData {
  keyword: string;
  ads: SerpResultItem[];
  featuredSnippet?: {
    title: string;
    url: string;
    displayUrl: string;
    snippet: string;
    list?: string[];
  };
  organicResults: SerpResultItem[];
  peopleAlsoAsk: { question: string; answer: string }[];
  relatedSearches: string[];
}

export function generateSerpData(keyword: string, highlightDomain?: string, engine: "google" | "bing" = "google"): SerpData {
  const cleanKeyword = keyword.trim().toLowerCase();
  const rand = createSeedRandom(cleanKeyword + engine);

  // Pool of high quality general site templates to generate mock search results
  const titles = [
    `Complete Guide to ${keyword} - Best Practices`,
    `What is ${keyword}? Definition, Strategies & Examples`,
    `Top 10 ${keyword} Tools You Should Use in 2026`,
    `${keyword} Tutorial for Beginners: Step by Step`,
    `Why ${keyword} Matters for Web Development & Growth`,
    `Advanced ${keyword} Techniques to Boost Rankings`,
    `The Future of ${keyword}: Key Trends to Watch`,
    `Everything You Need to Know About ${keyword}`,
    `How to Master ${keyword} in 30 Days (Free Course)`,
    `${keyword} Explained: Simple Guide for Non-Techies`
  ];

  const domains = [
    "hubspot.com", "searchengineland.com", "moz.com", "ahrefs.com", 
    "semrush.com", "medium.com", "wikipedia.org", "backlinko.com", 
    "devflow.co.in", "optimizely.com", "neilpatel.com", "w3schools.com"
  ];

  const snippets = [
    `Discover the foundational aspects of ${keyword} and learn how to optimize your digital marketing funnel. Read our comprehensive analysis and case study...`,
    `Looking to improve your understanding of ${keyword}? This reference guide breaks down standard terms, strategies, and templates for implementation.`,
    `Check out our list of the best tools and software for automating your ${keyword} workflow. Compare pricing, reviews, and features to choose the right one.`,
    `In this beginner-friendly tutorial, we walk through how to configure your system, compile key assets, and launch your first ${keyword} campaign successfully.`,
    `Search rankings and user engagement are closely linked to how you manage ${keyword}. Find out why experts recommend this checklist for sites of all sizes.`,
    `Ready to scale? These advanced frameworks will help you audit your current ${keyword} strategy, identify bottleneck areas, and implement fixes.`,
    `Industry experts weigh in on where ${keyword} is headed over the next decade. Learn about AI integrations, mobile search modifications, and schema markup.`
  ];

  // 1. Ads (1 to 2 ads)
  const adCount = Math.floor(rand() * 2) + 1;
  const ads: SerpResultItem[] = [];
  for (let i = 0; i < adCount; i++) {
    const adRand = createSeedRandom(cleanKeyword + engine + "ad" + i);
    const domain = domains[Math.floor(adRand() * domains.length)];
    ads.push({
      position: -adCount + i,
      title: `Ad: Official ${keyword} Services - Professional Solution`,
      url: `https://www.${domain}/services/${cleanKeyword.replace(/\s+/g, "-")}`,
      displayUrl: `www.${domain}/${cleanKeyword.replace(/\s+/g, "-")}`,
      snippet: `Grow your traffic and rankings with our expert ${keyword} packages. Free audit report, 24/7 client support, and guaranteed improvement. Request a quote today!`,
      isAd: true
    });
  }

  // 2. Featured Snippet (30% chance for informational search terms)
  let featuredSnippet;
  if (rand() > 0.7) {
    const fsRand = createSeedRandom(cleanKeyword + engine + "fs");
    const domain = domains[Math.floor(fsRand() * domains.length)];
    featuredSnippet = {
      title: `${keyword} Key Implementation Steps`,
      url: `https://www.${domain}/guides/learn-${cleanKeyword.replace(/\s+/g, "-")}`,
      displayUrl: `www.${domain}/guides/learn-${cleanKeyword.replace(/\s+/g, "-")}`,
      snippet: `To get started with ${keyword}, follow these core optimization steps:`,
      list: [
        `Identify target search intents and keywords matching your core message.`,
        `Optimize on-page assets including titles, meta tags, and header tag structures.`,
        `Establish crawlable navigation links, internal redirects, and XML sitemaps.`,
        `Build backlink networks with referring domains and descriptive anchor text.`
      ]
    };
  }

  // 3. Organic Results (10 results)
  const organicResults: SerpResultItem[] = [];
  let highlightPlaced = false;

  for (let i = 1; i <= 10; i++) {
    const orgRand = createSeedRandom(cleanKeyword + engine + "org" + i);
    let domain = domains[i % domains.length];
    
    // Inject highlighted domain if specified, placing it at a deterministic spot based on keyword
    if (highlightDomain && !highlightPlaced) {
      const cleanHighlight = highlightDomain.replace(/^(https?:\/\/)?(www\.)?/, "").toLowerCase();
      // Let's deterministically place it at rank 2 to 7
      const targetPos = Math.floor(rand() * 6) + 2;
      if (i === targetPos) {
        domain = cleanHighlight;
        highlightPlaced = true;
      }
    }

    const titleTemplate = titles[i % titles.length];
    const snippetTemplate = snippets[i % snippets.length];
    const slug = cleanKeyword.replace(/\s+/g, "-");

    organicResults.push({
      position: i,
      title: titleTemplate,
      url: `https://www.${domain}/${slug}`,
      displayUrl: `https://www.${domain}/${slug}`,
      snippet: snippetTemplate
    });
  }

  // 4. People Also Ask
  const peopleAlsoAsk = [
    {
      question: `What are the benefits of ${keyword}?`,
      answer: `Implementing ${keyword} helps businesses capture high-intent search traffic, establish domain authority, lower customer acquisition costs, and drive long-term organic growth compared to paid advertisements.`
    },
    {
      question: `How long does it take to see results with ${keyword}?`,
      answer: `Typically, rankings and traffic improvements from optimizing ${keyword} take between 3 to 6 months to materialize, depending on site authority, keyword difficulty, competition, and content quality.`
    },
    {
      question: `Can I do ${keyword} optimization for free?`,
      answer: `Yes, you can optimize for ${keyword} using free tools like Google Search Console, keyword generators, and open-source audit checklists to identify issues, analyze competitors, and structure your pages.`
    }
  ];

  // 5. Related Searches
  const relatedSearches = [
    `${keyword} definition`,
    `${keyword} examples`,
    `${keyword} tutorial pdf`,
    `best tools for ${keyword}`,
    `${keyword} strategies for small business`,
    `how to check ${keyword}`,
    `${keyword} checklist 2026`,
    `${keyword} trends`
  ];

  return {
    keyword,
    ads,
    featuredSnippet,
    organicResults,
    peopleAlsoAsk,
    relatedSearches
  };
}
