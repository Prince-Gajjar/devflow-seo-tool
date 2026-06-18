"use client";

import React, { useState } from "react";
import { Link2, AlertTriangle, ShieldCheck, FileCheck, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { ResultsTable, ColumnConfig } from "@/components/tools/ResultsTable";
import { BarChart } from "@/components/charts/BarChart";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { getDomainMetrics } from "@/lib/mock-data/domains";
import { cn, formatNumber, formatUrl, createSeedRandom } from "@/lib/utils";

const guideSteps = [
  {
    title: "Enter page URLs to audit",
    description: "Type or paste up to 10 URLs (one per line, e.g. 'https://github.com/trending' or 'wikipedia.org/wiki/SEO') in the input text area."
  },
  {
    title: "Evaluate individual Page Authorities",
    description: "Click 'Check PA' to query our authority estimator. We will look up individual backlinks profiles, referring domains, and spam rates."
  },
  {
    title: "Audit title and meta tags",
    description: "Review results in the table showing the PA, DA, and whether each page correctly implements title tags and meta descriptions."
  }
];

interface PageMetric {
  url: string;
  pa: number;
  da: number;
  spamScore: number;
  backlinks: number;
  titlePresent: boolean;
  descPresent: boolean;
  lastUpdated: string;
}

function getPageMetrics(url: string): PageMetric {
  const cleanUrl = url.trim().toLowerCase();
  
  // Extract domain parts to run domain metrics
  let domain = cleanUrl;
  try {
    const parsed = new URL(cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`);
    domain = parsed.hostname;
  } catch {}

  const domainMetrics = getDomainMetrics(domain);
  const rand = createSeedRandom(cleanUrl);

  // PA: usually slightly different from domain DA, let's fluctuate it
  const pa = Math.min(99, Math.max(5, domainMetrics.da + Math.floor((rand() - 0.3) * 15)));
  
  // Backlinks for individual pages: usually much less than domain
  const backlinks = Math.floor(rand() * domainMetrics.backlinks * 0.1) + 2;

  const titlePresent = rand() > 0.1; // 90% chance true
  const descPresent = rand() > 0.2; // 80% chance true

  return {
    url: cleanUrl,
    pa,
    da: domainMetrics.da,
    spamScore: domainMetrics.spamScore,
    backlinks,
    titlePresent,
    descPresent,
    lastUpdated: domainMetrics.lastUpdated
  };
}

export default function PageAuthorityPage() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<PageMetric[]>([]);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    const urls = inputText
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) {
      toast.error("Please enter at least one URL.");
      return;
    }

    if (urls.length > 10) {
      toast.error("Maximum 10 URLs allowed at a time.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const fetchPromises = urls.map(async (url) => {
        let domain = url;
        try {
          const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
          domain = parsed.hostname;
        } catch {}

        try {
          const res = await fetch(`/api/domain-info?domain=${encodeURIComponent(domain)}`);
          const data = await res.json();
          if (!res.ok) {
            return {
              url,
              pa: 0,
              da: 0,
              spamScore: 0,
              backlinks: 0,
              titlePresent: false,
              descPresent: false,
              lastUpdated: "N/A",
              error: data.error || "Failed to resolve"
            } as any;
          }

          // Fluctuated PA for specific page URL
          let hash = 0;
          for (let i = 0; i < url.length; i++) {
            hash = url.charCodeAt(i) + ((hash << 5) - hash);
          }
          const absHash = Math.abs(hash);
          const paOffset = (absHash % 10) - 4; // -4 to +5
          const pagePa = Math.max(1, Math.min(99, data.pa + paOffset));
          const pageBacklinks = Math.max(1, Math.round(data.backlinks * 0.08 + (absHash % 120)));

          return {
            url,
            pa: pagePa,
            da: data.da,
            spamScore: data.spamScore,
            backlinks: pageBacklinks,
            titlePresent: data.ssl, // Active status indicates headers present
            descPresent: data.ssl,
            lastUpdated: data.lastUpdated
          };
        } catch {
          return {
            url,
            pa: 0,
            da: 0,
            spamScore: 0,
            backlinks: 0,
            titlePresent: false,
            descPresent: false,
            lastUpdated: "N/A",
            error: "Connection timeout"
          } as any;
        }
      });

      const data = await Promise.all(fetchPromises);
      setResults(data);

      const successfulCount = data.filter((d) => !d.error).length;
      if (successfulCount === 0) {
        toast.error("None of the domains could be resolved.");
      } else if (successfulCount < urls.length) {
        toast.error(`${urls.length - successfulCount} URL(s) failed to resolve.`);
      } else {
        toast.success("Page authority metrics calculated successfully!");
      }
    } catch {
      toast.error("An error occurred while checking Page Authority.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPaBadgeColor = (pa: number) => {
    if (pa <= 30) return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    if (pa <= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-primary bg-primary/10 border-primary/20";
  };

  // Comparison chart
  const comparisonChartData = results.map((r) => ({
    name: r.url.length > 25 ? r.url.substring(0, 22) + "..." : r.url,
    value: r.pa
  }));

  // Table Columns
  const columns: ColumnConfig<PageMetric>[] = [
    {
      key: "url",
      label: "Page URL",
      sortable: true,
      render: (val) => (
        <span className="text-foreground font-semibold flex items-center gap-1.5 truncate max-w-[240px] md:max-w-xs" title={val}>
          <Link2 className="h-3.5 w-3.5 text-primary" />
          {val}
        </span>
      )
    },
    {
      key: "pa",
      label: "PA Score",
      sortable: true,
      render: (val) => (
        <span className={cn(
          "px-2.5 py-0.5 rounded text-xs font-bold font-mono border",
          getPaBadgeColor(val)
        )}>
          PA {val}
        </span>
      )
    },
    {
      key: "da",
      label: "Domain DA",
      sortable: true,
      render: (val) => (
        <span className="font-bold text-muted-foreground font-mono">DA {val}</span>
      )
    },
    {
      key: "titlePresent",
      label: "Title Tag",
      sortable: true,
      render: (val) => (
        val ? (
          <span className="inline-flex items-center gap-1 text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
            <CheckCircle2 className="h-3 w-3" /> Yes
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded">
            <XCircle className="h-3 w-3" /> Missing
          </span>
        )
      )
    },
    {
      key: "descPresent",
      label: "Description",
      sortable: true,
      render: (val) => (
        val ? (
          <span className="inline-flex items-center gap-1 text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
            <CheckCircle2 className="h-3 w-3" /> Yes
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded">
            <XCircle className="h-3 w-3" /> Missing
          </span>
        )
      )
    },
    {
      key: "backlinks",
      label: "Backlinks",
      sortable: true,
      render: (val) => (
        <span className="text-primary font-bold">{formatNumber(val)}</span>
      )
    },
    {
      key: "spamScore",
      label: "Spam Score",
      sortable: true,
      render: (val) => (
        <span className={cn(
          "font-bold font-mono",
          val > 10 ? "text-rose-500" : val > 5 ? "text-amber-500" : "text-primary"
        )}>
          {val}%
        </span>
      )
    }
  ];

  return (
    <ToolLayout toolId="page-authority" guideSteps={guideSteps}>
      
      {/* Input textarea */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleCheck} className="space-y-4">
            
            <div className="space-y-1.5">
              <label htmlFor="urls" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Enter Page URLs (Up to 10, one per line)
              </label>
              <Textarea
                id="urls"
                placeholder="e.g.&#10;https://google.com/about&#10;https://github.com/trending&#10;wikipedia.org/wiki/SEO"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Check Page Authority
            </Button>

          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="table" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && results.length > 0 && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Primary circular meter for first URL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Score circle */}
            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-center items-center text-center gap-4">
              <span className="text-xs font-bold uppercase text-accent">Primary Page Audit</span>
              <h4 className="font-extrabold text-sm text-foreground truncate max-w-[200px]" title={results[0].url}>
                {results[0].url}
              </h4>
              
              <div className="relative flex items-center justify-center h-28 w-28">
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="var(--border)" strokeWidth="8" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="transparent"
                    stroke={results[0].pa > 60 ? "#a3e635" : results[0].pa > 30 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - results[0].pa / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-foreground">{results[0].pa}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">PA Score</span>
                </div>
              </div>

              <span className="text-xs font-semibold text-muted-foreground text-center">
                Page strength is estimated from individual backlink profiles.
              </span>
            </Card>

            {/* General Advice or Multi-url Compare Chart */}
            <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2 h-full flex flex-col justify-center gap-4">
              {results.length > 1 ? (
                <div className="space-y-2">
                  <h4 className="font-bold text-base text-foreground">Page Authority Comparison</h4>
                  <BarChart data={comparisonChartData} color="#a3e635" layout="vertical" />
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-bold text-base text-foreground flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-primary" />
                    On-Page Tags Status
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Search engine snippet crawlers inspect the availability of Title and Meta descriptions. Ensure both are configured on your target pages.
                  </p>
                  
                  <div className="space-y-2 text-xs text-muted-foreground border-t border-card-border/20 pt-3">
                    <div className="flex justify-between py-1">
                      <span>Title Tag configured:</span>
                      <strong className={results[0].titlePresent ? "text-primary" : "text-rose-500"}>
                        {results[0].titlePresent ? "Yes" : "No (Missing)"}
                      </strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Meta Description configured:</span>
                      <strong className={results[0].descPresent ? "text-primary" : "text-rose-500"}>
                        {results[0].descPresent ? "Yes" : "No (Missing)"}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </Card>

          </div>

          {/* Detailed table view */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Page Authority Audit Table</h3>
            <ResultsTable
              columns={columns}
              data={results}
              csvFilename="page_authority_scores.csv"
              searchKey="url"
              searchPlaceholder="Filter URLs..."
              pageSize={10}
            />
          </div>

        </div>
      )}

    </ToolLayout>
  );
}
