"use client";

import React, { useState, useMemo } from "react";
import { Link2, AlertCircle, ShieldAlert, GitBranch, ArrowUpRight, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { ResultsTable, ColumnConfig } from "@/components/tools/ResultsTable";
import { BarChart } from "@/components/charts/BarChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getLinkAnalysis, PageLinkItem } from "@/lib/mock-data/domains";
import { cn, isValidUrl } from "@/lib/utils";

const guideSteps = [
  {
    title: "Provide a webpage URL",
    description: "Enter the website page link you want to audit. Make sure to specify the complete protocol path (e.g. 'https://example.com/blog')."
  },
  {
    title: "Apply custom crawling filters",
    description: "Use the checkboxes to include/exclude internal page links, external third-party links, or nofollow attributes in the crawled list."
  },
  {
    title: "Inspect link response reports",
    description: "Audit status codes (like 200 OK or 404 Not Found), examine anchor texts, and review the top linked domains graph."
  }
];

export default function LinkAnalysisPage() {
  const [url, setUrl] = useState("");
  const [includeInternal, setIncludeInternal] = useState(true);
  const [includeExternal, setIncludeExternal] = useState(true);
  const [includeNofollow, setIncludeNofollow] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL.");
      return;
    }
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/scrape?mode=links&url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to scan links");
      }

      setAnalysis(data);
      toast.success("Webpage scanned. Links analyzed successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while scanning links.");
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Group links dynamically for sub-tabs and checkboxes
  const filteredLinksByTab = useMemo(() => {
    if (!analysis) return [];
    
    let links = analysis.links || [];

    // Filter reactively based on checkbox selectors
    if (!includeInternal) {
      links = links.filter((l: PageLinkItem) => l.type !== "Internal");
    }
    if (!includeExternal) {
      links = links.filter((l: PageLinkItem) => l.type !== "External");
    }
    if (!includeNofollow) {
      links = links.filter((l: PageLinkItem) => l.rel !== "NoFollow");
    }

    if (activeTab === "internal") {
      return links.filter((l: PageLinkItem) => l.type === "Internal");
    }
    if (activeTab === "external") {
      return links.filter((l: PageLinkItem) => l.type === "External");
    }
    if (activeTab === "broken") {
      return links.filter((l: PageLinkItem) => l.statusCode !== 200);
    }
    return links; // 'all'
  }, [analysis, activeTab, includeInternal, includeExternal, includeNofollow]);

  // Aggregate Top Domains count for BarChart
  const topDomainsData = useMemo(() => {
    if (!analysis || analysis.links.length === 0) return [];
    
    const freq: Record<string, number> = {};
    analysis.links.forEach((l: PageLinkItem) => {
      try {
        const parsed = new URL(l.url);
        freq[parsed.hostname] = (freq[parsed.hostname] || 0) + 1;
      } catch {
        freq["internal path"] = (freq["internal path"] || 0) + 1;
      }
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [analysis]);

  // Table Columns
  const columns: ColumnConfig<PageLinkItem>[] = [
    {
      key: "url",
      label: "Link Target URL",
      sortable: true,
      render: (val) => (
        <a 
          href={val} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline font-semibold block truncate max-w-[280px] md:max-w-md"
        >
          {val}
        </a>
      )
    },
    {
      key: "anchorText",
      label: "Anchor Text",
      sortable: true,
      render: (val) => (
        <span className="text-foreground italic font-medium">{val || "(No anchor text)"}</span>
      )
    },
    {
      key: "type",
      label: "Link Type",
      sortable: true,
      render: (val) => (
        <span className={cn(
          "px-2.5 py-0.5 rounded text-xs font-bold",
          val === "Internal" ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground"
        )}>
          {val}
        </span>
      )
    },
    {
      key: "rel",
      label: "Attribute",
      sortable: true,
      render: (val) => (
        <span className={cn(
          "text-xs font-semibold",
          val === "Follow" ? "text-primary" : "text-muted-foreground"
        )}>
          {val}
        </span>
      )
    },
    {
      key: "statusCode",
      label: "HTTP Status",
      sortable: true,
      render: (val) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-xs font-bold font-mono",
          val === 200 ? "bg-primary/10 text-primary" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
        )}>
          {val}
        </span>
      )
    }
  ];

  return (
    <ToolLayout toolId="link-analysis" guideSteps={guideSteps}>
      
      {/* Input Form */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleAnalyze} className="space-y-4">
            
            <div className="space-y-1.5">
              <label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Webpage URL to Analyze
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="https://example.com/blog-article-page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Checkboxes filters */}
            <div className="flex flex-wrap gap-6 items-center pt-2">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  checked={includeInternal}
                  onChange={(e) => setIncludeInternal(e.target.checked)}
                  className="h-4 w-4 rounded border-card-border bg-input text-primary focus:ring-ring"
                />
                Include Internal Links
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  checked={includeExternal}
                  onChange={(e) => setIncludeExternal(e.target.checked)}
                  className="h-4 w-4 rounded border-card-border bg-input text-primary focus:ring-ring"
                />
                Include External Links
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-foreground">
                <input
                  type="checkbox"
                  checked={includeNofollow}
                  onChange={(e) => setIncludeNofollow(e.target.checked)}
                  className="h-4 w-4 rounded border-card-border bg-input text-primary focus:ring-ring"
                />
                Include Nofollow Links
              </label>
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Analyze Webpage Links
            </Button>

          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="stats" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && analysis && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Summary Dashboard row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            
            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Total Links Scanned</span>
                <h3 className="text-2xl font-black text-foreground">{analysis.total}</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Internal Links</span>
                <h3 className="text-2xl font-black text-primary">{analysis.internalCount}</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">External Links</span>
                <h3 className="text-2xl font-black text-accent">{analysis.externalCount}</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Nofollow Links</span>
                <h3 className="text-2xl font-black text-muted-foreground">{analysis.nofollowCount}</h3>
              </CardContent>
            </Card>

            <Card className={cn(
              "bg-card/30 border-card-border/60 col-span-2 lg:col-span-1",
              analysis.brokenCount > 0 ? "border-rose-500/30 bg-rose-500/5 animate-pulse" : ""
            )}>
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Broken Links (404)</span>
                <h3 className={cn(
                  "text-2xl font-black",
                  analysis.brokenCount > 0 ? "text-rose-500" : "text-primary"
                )}>
                  {analysis.brokenCount}
                </h3>
              </CardContent>
            </Card>

          </div>

          {/* Chart & Summary */}
          {topDomainsData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Linked domain chart */}
              <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2">
                <h4 className="font-bold text-base text-foreground flex items-center gap-1.5">
                  <GitBranch className="h-4 w-4 text-primary" />
                  Top Outgoing Linked Domains
                </h4>
                <BarChart data={topDomainsData} layout="horizontal" color="#a3e635" />
              </Card>

              {/* Action notice */}
              <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-between gap-4 h-full">
                <div className="space-y-2">
                  <h4 className="font-bold text-base text-foreground flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                    Link Quality Audit
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Search engine spiders lose crawl efficiency when hitting broken redirects. Remove or edit any highlighted 404 links.
                  </p>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between items-center py-1.5 border-b border-card-border/20">
                    <span>Clean Status (200 OK)</span>
                    <span className="text-primary font-bold">{(analysis.links.filter((l: any) => l.statusCode === 200).length / analysis.links.length * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-card-border/20">
                    <span>Redirect Code Rate</span>
                    <span className="text-amber-500 font-bold">0%</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span>Errors Code Rate (404)</span>
                    <span className="text-rose-500 font-bold">{(analysis.links.filter((l: any) => l.statusCode !== 200).length / analysis.links.length * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </Card>

            </div>
          )}

          {/* Links details table tab switcher */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border/20 pb-2">
              <h3 className="text-lg font-bold text-foreground">Discovered Webpage Links</h3>
              
              {/* Category selector */}
              <div className="flex items-center gap-1.5 bg-card-border/30 rounded-lg p-1">
                {[
                  { key: "all", label: `All (${analysis.links.length})` },
                  { key: "internal", label: `Internal (${analysis.internalCount})` },
                  { key: "external", label: `External (${analysis.externalCount})` },
                  { key: "broken", label: `Broken (${analysis.brokenCount})` }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-all",
                      activeTab === tab.key
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <ResultsTable
              columns={columns}
              data={filteredLinksByTab}
              csvFilename={`link_analysis_${url.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/[^\w]/g, "_")}.csv`}
              searchKey="url"
              searchPlaceholder="Filter crawled links..."
              pageSize={15}
            />
          </div>

        </div>
      )}

    </ToolLayout>
  );
}
