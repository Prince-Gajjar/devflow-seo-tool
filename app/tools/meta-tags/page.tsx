"use client";

import React, { useState } from "react";
import { Link2, AlertCircle, CheckCircle, AlertTriangle, FileJson, Code, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn, isValidUrl, formatUrl, createSeedRandom } from "@/lib/utils";

const guideSteps = [
  {
    title: "Submit a website URL",
    description: "Enter the complete link address of the webpage you wish to inspect (e.g. 'https://github.com' or 'medium.com')."
  },
  {
    title: "Extract and audit tag configurations",
    description: "Click 'Extract Meta Tags' to run our simulated headers crawler. We will check canonical declarations, robots parameters, and charsets."
  },
  {
    title: "Inspect social and search previews",
    description: "Look at the generated Google SERP snippets, Facebook Open Graph layouts, and Twitter Card visual mockups, then fix the flagged issues."
  }
];

interface MetaInfo {
  title: string;
  description: string;
  keywords: string;
  robots: string;
  canonical: string;
  charset: string;
  viewport: string;
  author: string;
  generator: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
}

// Generate realistic meta tags based on domain
function getMockMetaTags(url: string): MetaInfo {
  const cleanDomain = formatUrl(url);
  const rand = createSeedRandom(cleanDomain);

  const siteName = cleanDomain.split(".")[0];
  const capitalizedSite = siteName.charAt(0).toUpperCase() + siteName.slice(1);

  // Determinstic strings
  const descriptions = [
    `Welcome to ${capitalizedSite}. Discover resources, read featured articles, collaborate on software code repositories, and join our community of developers today.`,
    `Optimize, scale, and manage your workflows with ${capitalizedSite}. Our platform provides secure systems, automated configurations, and integrations.`,
    `Looking for the best guides on ${capitalizedSite}? Review tutorials, documentation wikis, and reference files compiled by digital tech experts.`
  ];

  const title = `${capitalizedSite} - Official Site | Build, Share & Deploy`;
  const description = descriptions[Math.floor(rand() * descriptions.length)];
  const keywords = `${siteName}, online platform, developer tools, technical articles, tutorials`;
  const robots = rand() > 0.05 ? "index, follow, max-image-preview:large" : "noindex, nofollow";
  const canonical = `https://www.${cleanDomain}/`;
  const charset = "UTF-8";
  const viewport = "width=device-width, initial-scale=1.5, shrink-to-fit=no";
  const author = `${capitalizedSite} Content Team`;
  const generator = rand() > 0.5 ? "Next.js" : "WordPress 6.4.2";

  // OG / Twitter
  const ogTitle = title;
  const ogDescription = description;
  // Use a reliable placeholder image that matches dark/light theme
  const ogImage = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop`;
  const ogUrl = canonical;
  const ogType = "website";
  const ogSiteName = capitalizedSite;

  const twitterCard = "summary_large_image";
  const twitterTitle = title;
  const twitterDescription = description.substring(0, 120) + "...";
  const twitterImage = ogImage;
  const twitterSite = `@${siteName}`;

  return {
    title,
    description,
    keywords,
    robots,
    canonical,
    charset,
    viewport,
    author,
    generator,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType,
    ogSiteName,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    twitterSite
  };
}

export default function MetaTagsPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [meta, setMeta] = useState<MetaInfo | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a website URL.");
      return;
    }
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/scrape?mode=meta&url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to extract meta tags");
      }

      setMeta(data);
      toast.success("Meta tags extracted successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while fetching meta tags.");
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate SEO score and lists issues
  const auditMeta = (data: MetaInfo) => {
    let score = 100;
    const issues: { title: string; desc: string; type: "error" | "warning" }[] = [];

    if (!data.title) {
      score -= 25;
      issues.push({ title: "Title Tag Missing", desc: "Title tags are crucial for search algorithms and click CTR.", type: "error" });
    } else if (data.title.length < 30 || data.title.length > 65) {
      score -= 10;
      issues.push({
        title: "Suboptimal Title Length",
        desc: `Current: ${data.title.length} chars. Optimal: 50-60 characters. Too short/long titles get truncated.`,
        type: "warning"
      });
    }

    if (!data.description) {
      score -= 25;
      issues.push({ title: "Meta Description Missing", desc: "Meta descriptions summarize search snippet summaries.", type: "error" });
    } else if (data.description.length < 120 || data.description.length > 160) {
      score -= 10;
      issues.push({
        title: "Suboptimal Description Length",
        desc: `Current: ${data.description.length} chars. Optimal: 150-160 characters to fit search snippet bounds.`,
        type: "warning"
      });
    }

    if (!data.canonical) {
      score -= 15;
      issues.push({ title: "Canonical URL Missing", desc: "Prevents duplicate URL content issues in indexing structures.", type: "error" });
    }

    if (!data.ogImage) {
      score -= 15;
      issues.push({ title: "Open Graph (og:image) Missing", desc: "Lacks image thumbnail previews on social timeline shares.", type: "error" });
    }

    if (!data.robots) {
      score -= 10;
      issues.push({ title: "Robots Directives Missing", desc: "Instruct crawler index bots clearly (e.g. index, follow).", type: "warning" });
    }

    if (!data.keywords) {
      score -= 5;
      issues.push({ title: "Meta Keywords Missing", desc: "Though less weighted now, meta keywords assist local taxonomies.", type: "warning" });
    }

    return { score: Math.max(0, score), issues };
  };

  const handleCopyJSON = () => {
    if (!meta) return;
    navigator.clipboard.writeText(JSON.stringify(meta, null, 2));
    toast.success("Meta data copied as JSON!");
  };

  const handleCopyHTML = () => {
    if (!meta) return;
    const htmlBlock = `<!-- Basic Meta Tags -->
<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
${meta.keywords ? `<meta name="keywords" content="${meta.keywords}">` : ""}
<meta name="robots" content="${meta.robots}">
<link rel="canonical" href="${meta.canonical}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${meta.ogType}">
<meta property="og:title" content="${meta.ogTitle}">
<meta property="og:description" content="${meta.ogDescription}">
${meta.ogImage ? `<meta property="og:image" content="${meta.ogImage}">` : ""}
<meta property="og:url" content="${meta.ogUrl}">
<meta property="og:site_name" content="${meta.ogSiteName}">

<!-- Twitter Card -->
<meta name="twitter:card" content="${meta.twitterCard}">
<meta name="twitter:title" content="${meta.twitterTitle}">
<meta name="twitter:description" content="${meta.twitterDescription}">
${meta.twitterImage ? `<meta name="twitter:image" content="${meta.twitterImage}">` : ""}`;
    
    navigator.clipboard.writeText(htmlBlock);
    toast.success("Meta tags copied as HTML code snippet!");
  };

  const audit = meta ? auditMeta(meta) : { score: 100, issues: [] };

  return (
    <ToolLayout toolId="meta-tags" guideSteps={guideSteps}>
      
      {/* Input URL */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleExtract} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow space-y-1.5">
              <label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Enter Website URL to Inspect
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="e.g. https://github.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto" isLoading={isLoading}>
              Extract Meta Tags
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="generic" />}

      {/* Results */}
      {!isLoading && hasSearched && meta && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* SEO Score & Issues Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* SEO score card */}
            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-center items-center gap-4 text-center">
              <span className="text-xs font-bold uppercase text-muted-foreground">Meta Tags SEO Score</span>
              
              <div className="relative flex items-center justify-center h-28 w-28">
                {/* Circular Score representation */}
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="var(--border)" strokeWidth="8" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="transparent"
                    stroke={audit.score > 80 ? "#a3e635" : audit.score > 50 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - audit.score / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-foreground">{audit.score}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">/ 100</span>
                </div>
              </div>

              <span className={cn(
                "text-sm font-bold",
                audit.score > 80 ? "text-primary" : audit.score > 50 ? "text-amber-500" : "text-rose-500"
              )}>
                {audit.score > 80 ? "Excellent Setup" : audit.score > 50 ? "Needs Optimization" : "Critical Fixes Needed"}
              </span>
            </Card>

            {/* Issues checklist card */}
            <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b border-card-border/30 pb-2">
                <h3 className="font-bold text-base text-foreground">Audit Checklist ({audit.issues.length} Issues)</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleCopyJSON}>
                    <FileJson className="h-3.5 w-3.5" />
                    Copy JSON
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleCopyHTML}>
                    <Code className="h-3.5 w-3.5" />
                    Copy HTML
                  </Button>
                </div>
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
                {audit.issues.length > 0 ? (
                  audit.issues.map((issue, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start bg-card-border/10 p-3 rounded border border-card-border/20">
                      {issue.type === "error" ? (
                        <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h5 className="text-sm font-bold text-foreground">{issue.title}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{issue.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-primary p-4 justify-center bg-primary/5 rounded border border-primary/20">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-bold">All essential meta tags found. No issues detected!</span>
                  </div>
                )}
              </div>
            </Card>

          </div>

          {/* Extracted Tags Categories Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Basic tags */}
            <Card className="bg-card/30 border-card-border/60">
              <CardHeader className="border-b border-card-border/30">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Basic Head Elements
                </CardTitle>
                <CardDescription>Foundational crawler indexing metadata tags.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { label: "Title Tag", value: meta.title, length: meta.title?.length, limit: "50-60 chars" },
                  { label: "Meta Description", value: meta.description, length: meta.description?.length, limit: "150-160 chars" },
                  { label: "Meta Keywords", value: meta.keywords || "Not found", isWarning: !meta.keywords },
                  { label: "Robots Directives", value: meta.robots || "Not found" },
                  { label: "Canonical Link", value: meta.canonical, isLink: true },
                  { label: "Charset Coding", value: meta.charset }
                ].map((tag, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase">
                      <span>{tag.label}</span>
                      {tag.length !== undefined && (
                        <span className={cn(
                          "font-mono text-[10px] lowercase",
                          tag.label === "Title Tag" 
                            ? (tag.length >= 50 && tag.length <= 60 ? "text-primary" : "text-amber-500")
                            : (tag.length >= 150 && tag.length <= 160 ? "text-primary" : "text-amber-500")
                        )}>
                          {tag.length} chars ({tag.limit})
                        </span>
                      )}
                    </div>
                    <div className={cn(
                      "p-2.5 rounded bg-card-border/20 text-sm font-mono break-all border border-card-border/10",
                      tag.isWarning && "text-muted-foreground/60 italic"
                    )}>
                      {tag.isLink ? (
                        <a href={tag.value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{tag.value}</a>
                      ) : (
                        tag.value
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* OG Social Tags */}
            <Card className="bg-card/30 border-card-border/60">
              <CardHeader className="border-b border-card-border/30">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Open Graph (Facebook) Metadata
                </CardTitle>
                <CardDescription>Visual thumbnail and timeline formatting properties.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { label: "og:title", value: meta.ogTitle },
                  { label: "og:description", value: meta.ogDescription },
                  { label: "og:url", value: meta.ogUrl },
                  { label: "og:type", value: meta.ogType },
                  { label: "og:site_name", value: meta.ogSiteName },
                  { label: "og:image Link", value: meta.ogImage || "Not found", isImage: true }
                ].map((tag, i) => (
                  <div key={i} className="space-y-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase block">{tag.label}</span>
                    {tag.isImage && tag.value !== "Not found" ? (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded bg-card-border/20 text-sm font-mono break-all border border-card-border/10 text-primary truncate">
                          {tag.value}
                        </div>
                        <img src={tag.value} alt="OG Image Preview" className="h-32 w-full object-cover rounded border border-card-border/50" />
                      </div>
                    ) : (
                      <div className="p-2.5 rounded bg-card-border/20 text-sm font-mono break-all border border-card-border/10">
                        {tag.value}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Twitter cards */}
            <Card className="bg-card/30 border-card-border/60">
              <CardHeader className="border-b border-card-border/30">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  Twitter Cards Layout
                </CardTitle>
                <CardDescription>Display properties optimized for X/Twitter timelines.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { label: "twitter:card", value: meta.twitterCard },
                  { label: "twitter:title", value: meta.twitterTitle },
                  { label: "twitter:description", value: meta.twitterDescription },
                  { label: "twitter:site", value: meta.twitterSite },
                  { label: "twitter:image Link", value: meta.twitterImage || "Not found", isImage: true }
                ].map((tag, i) => (
                  <div key={i} className="space-y-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase block">{tag.label}</span>
                    {tag.isImage && tag.value !== "Not found" ? (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded bg-card-border/20 text-sm font-mono break-all border border-card-border/10 text-primary truncate">
                          {tag.value}
                        </div>
                        <img src={tag.value} alt="Twitter Card Preview" className="h-32 w-full object-cover rounded border border-card-border/50" />
                      </div>
                    ) : (
                      <div className="p-2.5 rounded bg-card-border/20 text-sm font-mono break-all border border-card-border/10">
                        {tag.value}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Technical Viewports */}
            <Card className="bg-card/30 border-card-border/60">
              <CardHeader className="border-b border-card-border/30">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Technical Configurations
                </CardTitle>
                <CardDescription>Responsive scale settings and author details.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { label: "Viewport Options", value: meta.viewport },
                  { label: "Document Author", value: meta.author || "Not found" },
                  { label: "Framework Generator", value: meta.generator || "Not found" }
                ].map((tag, i) => (
                  <div key={i} className="space-y-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase block">{tag.label}</span>
                    <div className="p-2.5 rounded bg-card-border/20 text-sm font-mono break-all border border-card-border/10">
                      {tag.value}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Social and SERP visual previews */}
          <div className="border-t border-card-border/30 pt-8 space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Snippet Previews
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
               {/* Google SERP Preview */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider">Google Search Result (Desktop)</h4>
                <div className="border border-card-border bg-[#121212] text-[#bdc1c6] p-6 rounded shadow-none space-y-1 font-sans">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="text-xs text-gray-400">{meta.canonical}</span>
                  </div>
                  <h4 className="text-xl text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-tight">
                    {meta.title}
                  </h4>
                  <p className="text-sm text-[#bdc1c6] leading-relaxed max-w-[600px] mt-1.5">
                    {meta.description}
                  </p>
                </div>
              </div>

              {/* Facebook Card Mockup */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider">Facebook Social Share Mockup</h4>
                <div className="border border-card-border bg-[#1c1c1f] text-foreground rounded overflow-hidden shadow-none font-sans max-w-sm">
                  {meta.ogImage && (
                    <img src={meta.ogImage} alt="Social Mock" className="h-44 w-full object-cover" />
                  )}
                  <div className="p-4 border-t border-card-border/40 bg-[#09090b] space-y-1 text-xs">
                    <span className="uppercase text-muted-foreground font-mono text-[9px] tracking-wider block">{formatUrl(url)}</span>
                    <h5 className="font-bold text-sm text-foreground line-clamp-1">{meta.ogTitle}</h5>
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">{meta.ogDescription}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </ToolLayout>
  );
}
