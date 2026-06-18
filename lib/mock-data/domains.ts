import { createSeedRandom, formatUrl } from "../utils";

// 1. DA / PA Checker Mock Data
export interface DomainMetric {
  domain: string;
  da: number;
  pa: number;
  spamScore: number;
  backlinks: number;
  referringDomains: number;
  lastUpdated: string;
}

export function getDomainMetrics(domain: string): DomainMetric {
  const cleanDomain = formatUrl(domain);
  const rand = createSeedRandom(cleanDomain);

  // DA: 1 to 99
  const da = Math.floor(rand() * 95) + 3;
  // PA: DA + some value, up to 99
  const pa = Math.min(99, da + Math.floor(rand() * 15) + 5);
  // Spam Score: 1% to 100% (lower usually, higher if low DA)
  const spamScore = Math.max(1, Math.floor(rand() * (da > 50 ? 5 : 45) + (da < 20 ? 15 : 1)));
  // Backlinks: related to DA
  const backlinks = Math.floor(rand() * da * da * 800) + 12;
  // Referring Domains
  const referringDomains = Math.floor(backlinks / (rand() * 5 + 2));

  // Last Updated: some date in the last 30 days
  const updatedDaysAgo = Math.floor(rand() * 30);
  const date = new Date();
  date.setDate(date.getDate() - updatedDaysAgo);
  const lastUpdated = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return {
    domain: cleanDomain,
    da,
    pa,
    spamScore,
    backlinks,
    referringDomains,
    lastUpdated
  };
}

// 2. Backlinks Mock Data
export interface BacklinkItem {
  sourceDomain: string;
  sourceUrl: string;
  anchorText: string;
  da: number;
  type: "DoFollow" | "NoFollow";
  firstSeen: string;
}

export function getBacklinks(domain: string): {
  items: BacklinkItem[];
  totalBacklinks: number;
  uniqueDomains: number;
  doFollowPct: number;
  noFollowPct: number;
  avgDa: number;
} {
  const cleanDomain = formatUrl(domain);
  const rand = createSeedRandom(cleanDomain);

  const tlds = [".com", ".org", ".net", ".edu", ".gov", ".io", ".dev"];
  const anchorTexts = [
    `visit ${cleanDomain}`,
    "click here",
    "website",
    "source link",
    "learn more",
    "seo services",
    "tech article",
    "developer blog",
    "original source",
    "read more on this site",
  ];

  const sourceDirs = ["blog", "article", "resources", "news", "docs", "tools"];
  
  const count = 15;
  const items: BacklinkItem[] = [];
  let totalDaSum = 0;
  let doFollowCount = 0;

  for (let i = 0; i < count; i++) {
    const itemRand = createSeedRandom(cleanDomain + i);
    const sourceDomain = `ref-site-${i + 1}${tlds[Math.floor(itemRand() * tlds.length)]}`;
    const sourceUrl = `https://${sourceDomain}/${sourceDirs[Math.floor(itemRand() * sourceDirs.length)]}/seo-insights-page`;
    
    // Anchor Text
    const anchorText = i === 0 ? cleanDomain : anchorTexts[Math.floor(itemRand() * anchorTexts.length)];
    
    // DA
    const da = Math.floor(itemRand() * 75) + 15;
    totalDaSum += da;

    // Type
    const type: "DoFollow" | "NoFollow" = itemRand() > 0.4 ? "DoFollow" : "NoFollow";
    if (type === "DoFollow") doFollowCount++;

    // Date
    const daysAgo = Math.floor(itemRand() * 365);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const firstSeen = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    items.push({ sourceDomain, sourceUrl, anchorText, da, type, firstSeen });
  }

  const avgDa = Math.round(totalDaSum / count);
  const doFollowPct = Math.round((doFollowCount / count) * 100);
  const noFollowPct = 100 - doFollowPct;
  
  const metrics = getDomainMetrics(cleanDomain);

  return {
    items,
    totalBacklinks: metrics.backlinks,
    uniqueDomains: metrics.referringDomains,
    doFollowPct,
    noFollowPct,
    avgDa
  };
}

// 3. Link Analysis Checker
export interface PageLinkItem {
  url: string;
  anchorText: string;
  type: "Internal" | "External";
  rel: "Follow" | "NoFollow";
  statusCode: number;
}

export function getLinkAnalysis(url: string, includeInternal = true, includeExternal = true, includeNofollow = true): {
  links: PageLinkItem[];
  total: number;
  internalCount: number;
  externalCount: number;
  brokenCount: number;
  nofollowCount: number;
} {
  const cleanUrl = formatUrl(url);
  const rand = createSeedRandom(cleanUrl);

  const internalPaths = ["/about", "/blog", "/pricing", "/features", "/docs", "/terms", "/privacy", "/blog/seo-tips"];
  const externalDomains = ["google.com", "github.com", "w3schools.com", "medium.com", "twitter.com", "linkedin.com", "wikipedia.org", "broken-site-link-error.net"];
  const externalPaths = ["/about", "/search", "/wiki/Search_engine_optimization", "/user/devflow", "/status/404"];
  const anchors = ["About Us", "Contact", "Our Blog", "Pricing", "Features", "Documentation", "Terms", "Privacy Policy", "SEO Best Practices", "Google Search", "GitHub Repo", "Tutorials", "Read Article", "Follow on Twitter", "LinkedIn Profile", "Wikipedia SEO Page", "Resources Directory", "Click Here"];

  const linkCount = Math.floor(rand() * 30) + 15; // 15 to 45 links
  const links: PageLinkItem[] = [];

  let internalCount = 0;
  let externalCount = 0;
  let brokenCount = 0;
  let nofollowCount = 0;

  for (let i = 0; i < linkCount; i++) {
    const itemRand = createSeedRandom(cleanUrl + i);
    const isInternal = itemRand() > 0.4; // 60% internal, 40% external
    
    let linkUrl = "";
    let anchorText = anchors[Math.floor(itemRand() * anchors.length)];
    let type: "Internal" | "External" = "Internal";
    let rel: "Follow" | "NoFollow" = "Follow";
    let statusCode = 200;

    if (isInternal) {
      type = "Internal";
      internalCount++;
      const path = internalPaths[Math.floor(itemRand() * internalPaths.length)];
      linkUrl = `https://${cleanUrl}${path}`;
      
      // Simulate broken internal link (e.g. 5% chance)
      if (itemRand() < 0.05) {
        statusCode = 404;
        brokenCount++;
        linkUrl += "-not-found";
      }
    } else {
      type = "External";
      externalCount++;
      const domain = externalDomains[Math.floor(itemRand() * externalDomains.length)];
      const path = externalPaths[Math.floor(itemRand() * externalPaths.length)];
      linkUrl = `https://${domain}${path}`;

      // Mark nofollow
      if (itemRand() > 0.5) {
        rel = "NoFollow";
        nofollowCount++;
      }

      // Simulate broken external link (e.g. 10% chance)
      if (domain.includes("broken") || itemRand() < 0.1) {
        statusCode = 404;
        brokenCount++;
      }
    }

    const item = { url: linkUrl, anchorText, type, rel, statusCode };

    // Apply checkbox filters
    const filterPass = 
      (type === "Internal" && includeInternal) || 
      (type === "External" && includeExternal);
    
    const nofollowPass = rel === "Follow" || (rel === "NoFollow" && includeNofollow);

    if (filterPass && nofollowPass) {
      links.push(item);
    }
  }

  return {
    links,
    total: linkCount,
    internalCount,
    externalCount,
    brokenCount,
    nofollowCount
  };
}

// 4. Competitor Audit Checker
export interface CompetitorData {
  da: number;
  pa: number;
  age: number;
  indexedPages: number;
  topKeywords: { keyword: string; position: number; volume: number }[];
  trafficEstimate: string;
  countries: { country: string; flag: string; pct: number }[];
  recentPosts: { title: string; url: string; traffic: number }[];
  avgContentLength: number;
  publishingFrequency: string;
  totalBacklinks: number;
  topReferrers: string[];
  pageSpeed: number;
  mobileFriendly: boolean;
  https: boolean;
  sitemapFound: boolean;
}

export function getCompetitorData(domain: string): CompetitorData {
  const cleanDomain = formatUrl(domain);
  const rand = createSeedRandom(cleanDomain);

  const metrics = getDomainMetrics(cleanDomain);
  const age = Math.floor(rand() * 18) + 1; // 1 to 19 years
  const indexedPages = Math.floor(rand() * metrics.da * 150) + 10;

  const topKeywordsList = [
    "best developer tools", "free coding utilities", "web optimization guide",
    "search rankings tool", "seo checklist", "site performance tips",
    "backlink analyzer online", "keyword difficulty tools", "meta tags editor",
    "sitemap validator", "responsive design checks", "how to rank faster",
    "organic traffic strategy", "pagespeed solutions"
  ];
  
  const topKeywords = topKeywordsList.map((kw, i) => {
    const itemRand = createSeedRandom(cleanDomain + kw);
    return {
      keyword: kw,
      position: Math.floor(itemRand() * 20) + 1,
      volume: Math.floor(itemRand() * 15000) + 100
    };
  }).sort((a, b) => a.position - b.position).slice(0, 10);

  const trafficMin = Math.floor(rand() * metrics.da * 1000) + 100;
  const trafficMax = trafficMin + Math.floor(rand() * metrics.da * 5000);
  const trafficEstimate = `${(trafficMin / 1000).toFixed(1)}k - ${(trafficMax / 1000).toFixed(1)}k visits / mo`;

  const countries = [
    { country: "United States", flag: "🇺🇸", pct: 45 },
    { country: "India", flag: "🇮🇳", pct: 30 },
    { country: "United Kingdom", flag: "🇬🇧", pct: 15 }
  ];

  const recentPosts = [
    { title: "Ultimate SEO Guide for Next.js Applications in 2026", url: "/blog/nextjs-seo-guide", traffic: Math.floor(rand() * 500) + 50 },
    { title: "Top 10 Tools Every Software Developer Needs", url: "/blog/top-dev-tools", traffic: Math.floor(rand() * 400) + 50 },
    { title: "How to Build a Custom Sitemap Index", url: "/blog/sitemap-indexing", traffic: Math.floor(rand() * 300) + 50 },
    { title: "Why Page Speed is a Critical Search Ranking Factor", url: "/blog/pagespeed-importance", traffic: Math.floor(rand() * 200) + 50 },
    { title: "Understanding DoFollow vs NoFollow Links", url: "/blog/link-relationship-types", traffic: Math.floor(rand() * 100) + 50 }
  ];

  const avgContentLength = Math.floor(rand() * 1200) + 800; // 800 - 2000 words
  const frequencies = ["Daily", "2-3 posts / week", "Weekly", "Bi-weekly", "Monthly"];
  const publishingFrequency = frequencies[Math.floor(rand() * frequencies.length)];

  const topReferrers = [`github.com`, `medium.com`, `reddit.com`, `stackoverflow.com`, `dev.to`].slice(0, 3 + Math.floor(rand() * 3));

  const pageSpeed = Math.floor(rand() * 35) + 65; // 65 to 99
  const mobileFriendly = rand() > 0.1; // 90% true
  const https = rand() > 0.05; // 95% true
  const sitemapFound = rand() > 0.1; // 90% true

  return {
    da: metrics.da,
    pa: metrics.pa,
    age,
    indexedPages,
    topKeywords,
    trafficEstimate,
    countries,
    recentPosts,
    avgContentLength,
    publishingFrequency,
    totalBacklinks: metrics.backlinks,
    topReferrers,
    pageSpeed,
    mobileFriendly,
    https,
    sitemapFound
  };
}

// 5. Top Referrers Mock Data
export interface ReferrerItem {
  domain: string;
  visits: number;
  pct: number;
  linksCount: number;
  da: number;
}

export function getReferrers(domain: string, timeRange = "30"): {
  items: ReferrerItem[];
  sourcesPct: { name: string; value: number }[];
  geoBreakdown: { country: string; flag: string; visits: number; pct: number }[];
  trendData: { name: string; visits: number }[];
} {
  const cleanDomain = formatUrl(domain);
  const rand = createSeedRandom(cleanDomain);

  const referrerPool = ["github.com", "dev.to", "medium.com", "reddit.com/r/seo", "producthunt.com", "news.ycombinator.com", "t.co", "linkedin.com", "facebook.com", "youtube.com", "hashnode.dev", "stackshare.io"];
  
  const days = parseInt(timeRange) || 30;
  const metrics = getDomainMetrics(cleanDomain);
  const totalVisits = Math.floor(rand() * metrics.da * 1200) + 400;

  // Generate 8 referrer items
  const items: ReferrerItem[] = [];
  let remainingPct = 100;
  
  for (let i = 0; i < 8; i++) {
    const itemRand = createSeedRandom(cleanDomain + i);
    const domainName = referrerPool[i % referrerPool.length];
    
    // Pct
    const pct = i === 7 ? remainingPct : Math.max(2, Math.floor(remainingPct * (itemRand() * 0.4 + 0.1)));
    remainingPct = Math.max(0, remainingPct - pct);
    
    const visits = Math.round((pct / 100) * totalVisits);
    const linksCount = Math.floor(itemRand() * 50) + 1;
    const da = Math.floor(itemRand() * 60) + 35;

    items.push({ domain: domainName, visits, pct, linksCount, da });
  }
  
  items.sort((a, b) => b.visits - a.visits);

  // Sources percentage
  const direct = Math.floor(rand() * 20) + 15;
  const organic = Math.floor(rand() * 30) + 30;
  const referral = Math.floor(rand() * 15) + 15;
  const social = 100 - direct - organic - referral;
  const sourcesPct = [
    { name: "Organic Search", value: organic },
    { name: "Direct Traffic", value: direct },
    { name: "Referral Links", value: referral },
    { name: "Social Media", value: social }
  ];

  // Geo breakdown
  const geoBreakdown = [
    { country: "United States", flag: "🇺🇸", visits: Math.round(totalVisits * 0.42), pct: 42 },
    { country: "India", flag: "🇮🇳", visits: Math.round(totalVisits * 0.28), pct: 28 },
    { country: "United Kingdom", flag: "🇬🇧", visits: Math.round(totalVisits * 0.12), pct: 12 },
    { country: "Germany", flag: "🇩🇪", visits: Math.round(totalVisits * 0.08), pct: 8 },
    { country: "Others", flag: "🌐", visits: Math.round(totalVisits * 0.10), pct: 10 }
  ];

  // Trend Data: visitor trend over time
  const points = 6;
  const trendData = Array.from({ length: points }, (_, idx) => {
    const ptRand = createSeedRandom(cleanDomain + idx);
    const date = new Date();
    date.setDate(date.getDate() - (points - 1 - idx) * (days / points));
    const name = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    const fluctuation = (ptRand() - 0.5) * (totalVisits / points * 0.5);
    const visits = Math.round((totalVisits / points) + fluctuation);

    return { name, visits };
  });

  return {
    items,
    sourcesPct,
    geoBreakdown,
    trendData
  };
}

// 6. Top Search Queries Mock Data
export interface SearchQueryItem {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  intent: "Informational" | "Navigational" | "Transactional" | "Commercial";
}

export function getSearchQueries(input: string, mode: "domain" | "topic"): SearchQueryItem[] {
  const cleanInput = input.trim().toLowerCase();
  const rand = createSeedRandom(cleanInput);

  const informationalPool = ["how to", "what is", "guide", "tips", "tutorial", "explained"];
  const commercialPool = ["best", "comparison", "vs", "review", "pricing", "alternative"];
  const transactionalPool = ["buy", "hire", "service", "download", "pro", "cheap"];
  const navigationalPool = ["login", "dashboard", "homepage", "contact number", "support"];

  const queries: SearchQueryItem[] = [];
  const baseCount = 20;

  for (let i = 0; i < baseCount; i++) {
    const itemRand = createSeedRandom(cleanInput + i);
    let query = "";
    let intent: "Informational" | "Navigational" | "Transactional" | "Commercial" = "Informational";

    const intentVal = itemRand();
    if (intentVal < 0.4) {
      intent = "Informational";
      const word = informationalPool[Math.floor(itemRand() * informationalPool.length)];
      query = mode === "domain" ? `${word} ${cleanInput.split(".")[0]}` : `${word} ${cleanInput}`;
    } else if (intentVal < 0.65) {
      intent = "Commercial";
      const word = commercialPool[Math.floor(itemRand() * commercialPool.length)];
      query = mode === "domain" ? `${cleanInput.split(".")[0]} ${word}` : `${cleanInput} ${word}`;
    } else if (intentVal < 0.85) {
      intent = "Transactional";
      const word = transactionalPool[Math.floor(itemRand() * transactionalPool.length)];
      query = mode === "domain" ? `${cleanInput.split(".")[0]} ${word}` : `${cleanInput} ${word}`;
    } else {
      intent = "Navigational";
      const word = navigationalPool[Math.floor(itemRand() * navigationalPool.length)];
      query = mode === "domain" ? `${cleanInput.split(".")[0]} ${word}` : `${cleanInput} ${word}`;
    }

    // Impressions (500 to 100,000)
    const impressions = Math.floor(itemRand() * 99500) + 500;
    // Clicks (Impressions * CTR)
    // Position (1.0 to 45.0)
    const position = Math.round((itemRand() * 44 + 1) * 10) / 10;
    
    // CTR based on position (better position -> higher CTR)
    let baseCtr = 0.35; // Position 1 average
    if (position > 1) {
      baseCtr = 0.35 / Math.pow(position, 0.7);
    }
    const ctrVal = Math.min(0.45, Math.max(0.01, baseCtr + (itemRand() - 0.5) * 0.05));
    const clicks = Math.round(impressions * ctrVal);
    const ctr = Math.round(ctrVal * 1000) / 10;

    queries.push({
      query,
      impressions,
      clicks,
      ctr,
      position,
      intent
    });
  }

  // Sort by clicks
  return queries.sort((a, b) => b.clicks - a.clicks);
}

// 7. Sitemap Finder Mock Data
export interface SitemapItem {
  url: string;
  type: string;
  urlCount: number;
  lastModified: string;
  status: "Valid" | "Invalid" | "Unreachable";
}

export function getSitemaps(domain: string): {
  sitemaps: SitemapItem[];
  robotsContent: string;
} {
  const cleanDomain = formatUrl(domain);
  const rand = createSeedRandom(cleanDomain);

  const sitemaps: SitemapItem[] = [
    {
      url: `https://${cleanDomain}/sitemap_index.xml`,
      type: "Sitemap Index",
      urlCount: Math.floor(rand() * 4) + 2,
      lastModified: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Valid"
    },
    {
      url: `https://${cleanDomain}/sitemap-posts.xml`,
      type: "XML Sitemap",
      urlCount: Math.floor(rand() * 800) + 100,
      lastModified: new Date(Date.now() - 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Valid"
    },
    {
      url: `https://${cleanDomain}/sitemap-pages.xml`,
      type: "XML Sitemap",
      urlCount: Math.floor(rand() * 50) + 10,
      lastModified: new Date(Date.now() - 604800000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Valid"
    }
  ];

  // Image sitemap, 50% chance
  if (rand() > 0.5) {
    sitemaps.push({
      url: `https://${cleanDomain}/sitemap-images.xml`,
      type: "Image Sitemap",
      urlCount: Math.floor(rand() * 1500) + 200,
      lastModified: new Date(Date.now() - 172800000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Valid"
    });
  }

  // 10% chance of an invalid sitemap
  if (rand() < 0.1) {
    sitemaps.push({
      url: `https://${cleanDomain}/sitemap-broken-news.xml`,
      type: "News Sitemap",
      urlCount: 0,
      lastModified: "N/A",
      status: "Invalid"
    });
  }

  const robotsContent = `# Robots.txt file for https://${cleanDomain}
User-agent: *
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /api/
Disallow: /search/
Allow: /wp-admin/admin-ajax.php

# Sitemaps list
Sitemap: https://${cleanDomain}/sitemap_index.xml
Sitemap: https://${cleanDomain}/sitemap-images.xml
`;

  return { sitemaps, robotsContent };
}

// 8. Index Checker
export interface IndexStatusItem {
  url: string;
  googleIndexed: "Indexed" | "Not Indexed" | "Possibly Indexed";
  bingIndexed: "Indexed" | "Not Indexed" | "Possibly Indexed";
  lastCrawled: string;
  status: "Live" | "Deindexed" | "Blocked by robots.txt" | "Not Found";
}

export function getIndexStatuses(urls: string[], checkGoogle = true, checkBing = true): IndexStatusItem[] {
  return urls.map((url, idx) => {
    const cleanUrl = url.trim().toLowerCase();
    if (!cleanUrl) return null;
    const rand = createSeedRandom(cleanUrl);

    // Indexed Statuses
    let googleIndexed: "Indexed" | "Not Indexed" | "Possibly Indexed" = "Indexed";
    let bingIndexed: "Indexed" | "Not Indexed" | "Possibly Indexed" = "Indexed";
    let status: "Live" | "Deindexed" | "Blocked by robots.txt" | "Not Found" = "Live";

    const statVal = rand();
    if (statVal < 0.8) {
      status = "Live";
      googleIndexed = checkGoogle ? "Indexed" : "Possibly Indexed";
      bingIndexed = checkBing ? "Indexed" : "Possibly Indexed";
    } else if (statVal < 0.9) {
      status = "Blocked by robots.txt";
      googleIndexed = "Not Indexed";
      bingIndexed = "Not Indexed";
    } else if (statVal < 0.95) {
      status = "Not Found";
      googleIndexed = "Not Indexed";
      bingIndexed = "Not Indexed";
    } else {
      status = "Deindexed";
      googleIndexed = "Not Indexed";
      bingIndexed = "Not Indexed";
    }

    // Last Crawled
    const daysAgo = Math.floor(rand() * 10);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const lastCrawled = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return {
      url: cleanUrl,
      googleIndexed,
      bingIndexed,
      lastCrawled,
      status
    };
  }).filter(item => item !== null) as IndexStatusItem[];
}

// 9. Crawlability Test Mock Data
export interface CrawlabilityMetric {
  title: string;
  status: "success" | "fail" | "warning";
  description: string;
}

export function getCrawlabilityTest(url: string, bot: string): {
  score: number;
  checks: CrawlabilityMetric[];
  headers: string;
  robotsRules: string;
  recommendations: string[];
} {
  const cleanUrl = formatUrl(url);
  const rand = createSeedRandom(cleanUrl + bot);

  const checks: CrawlabilityMetric[] = [
    {
      title: "robots.txt allows crawling",
      status: rand() > 0.05 ? "success" : "fail",
      description: "Checks if robots.txt file restricts search engines from accessing this directory path."
    },
    {
      title: "URL is accessible (HTTP 200)",
      status: rand() > 0.03 ? "success" : "fail",
      description: "Validates that the server returns a successful 200 HTTP status code."
    },
    {
      title: "No noindex meta tag found",
      status: rand() > 0.1 ? "success" : "fail",
      description: "Scans for HTML meta tag <meta name='robots' content='noindex'> that blocks indexing."
    },
    {
      title: "No X-Robots-Tag: noindex header",
      status: rand() > 0.05 ? "success" : "fail",
      description: "Verifies HTTP headers don't contain the X-Robots-Tag directive instructing bots not to index."
    },
    {
      title: "Page load time optimization",
      status: rand() > 0.2 ? "success" : "warning",
      description: "Checks if the page loads in less than 3.0 seconds (Simulated: " + (rand() * 4 + 1).toFixed(2) + "s)."
    },
    {
      title: "No login/auth wall detected",
      status: rand() > 0.02 ? "success" : "fail",
      description: "Checks if the page content requires cookies, authorization, or redirects to a signup portal."
    },
    {
      title: "Internal links are crawlable",
      status: rand() > 0.08 ? "success" : "warning",
      description: "Scans internal anchor tags to confirm they use valid href paths rather than JavaScript clicks."
    },
    {
      title: "No infinite redirect loop",
      status: rand() > 0.01 ? "success" : "fail",
      description: "Validates that redirect paths terminate rather than causing a loop limit."
    },
    {
      title: "Canonical tag points to self/valid page",
      status: rand() > 0.12 ? "success" : "warning",
      description: "Verifies canonical URL headers point to either itself or a designated target URL."
    },
    {
      title: "Sitemap reference found",
      status: rand() > 0.15 ? "success" : "warning",
      description: "Confirms robots.txt specifies a Sitemap directory link."
    }
  ];

  // Calculate score based on statuses
  let scoreSum = 0;
  checks.forEach(c => {
    if (c.status === "success") scoreSum += 10;
    else if (c.status === "warning") scoreSum += 5;
  });
  const score = scoreSum;

  const headers = `HTTP/2 200 OK
content-type: text/html; charset=UTF-8
vary: Accept-Encoding, User-Agent
cache-control: max-age=600, must-revalidate
x-powered-by: Next.js
content-encoding: gzip
date: ${new Date().toUTCString()}
server: Vercel
x-robots-tag: index, follow, max-snippet:-1, max-image-preview:large
`;

  const robotsRules = `User-agent: ${bot}
Disallow: /wp-admin/
Disallow: /private/
Disallow: /checkout/
Allow: /

Sitemap: https://${cleanUrl}/sitemap.xml
`;

  const recommendations: string[] = [];
  checks.forEach(c => {
    if (c.status === "fail") {
      if (c.title.includes("robots.txt")) recommendations.push("Update your robots.txt to remove Disallow rules covering this directory.");
      else if (c.title.includes("HTTP 200")) recommendations.push("Verify that your page is live and returns a 200 OK code instead of 404 or 500.");
      else if (c.title.includes("noindex meta")) recommendations.push("Remove <meta name='robots' content='noindex'> from your head tag.");
      else if (c.title.includes("X-Robots-Tag")) recommendations.push("Modify server HTTP response headers to remove 'noindex' from X-Robots-Tag.");
      else if (c.title.includes("redirect loop")) recommendations.push("Resolve server redirects to ensure users don't cycle between two identical pages.");
      else if (c.title.includes("auth wall")) recommendations.push("Ensure public content is crawlable without password logins or auth tokens.");
    } else if (c.status === "warning") {
      if (c.title.includes("load time")) recommendations.push("Optimize image sizes, minify CSS/JS bundles, and use caching to reduce page load to under 3s.");
      else if (c.title.includes("Canonical tag")) recommendations.push("Verify canonical declarations point to the absolute URL version of this webpage.");
      else if (c.title.includes("Sitemap reference")) recommendations.push("Add a 'Sitemap: [URL]' declaration to the footer of your robots.txt file.");
      else if (c.title.includes("links are crawlable")) recommendations.push("Change JS click triggers on links to standard <a href='...'> anchors.");
    }
  });

  if (recommendations.length === 0) {
    recommendations.push("Perfect setup! No optimizations are necessary for crawler accessibility.");
  }

  return {
    score,
    checks,
    headers,
    robotsRules,
    recommendations
  };
}
