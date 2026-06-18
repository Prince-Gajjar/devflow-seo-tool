"use client";

import React, { useState } from "react";
import { Globe, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { ResultsTable, ColumnConfig } from "@/components/tools/ResultsTable";
import { BarChart } from "@/components/charts/BarChart";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { getDomainMetrics, DomainMetric } from "@/lib/mock-data/domains";
import { cn, formatNumber, formatUrl } from "@/lib/utils";

const guideSteps = [
  {
    title: "Enter domains to check",
    description: "Type or paste up to 10 domains (one per line, e.g. 'github.com' or 'google.com') in the input text area."
  },
  {
    title: "Check domain parameters",
    description: "Click 'Check DA' to query our authority estimator. We will look up backlinks profiles, referring domains, and spam rates."
  },
  {
    title: "Review authority comparisons",
    description: "Analyze the DA circular meters. If multiple domains were entered, look at the horizontal bar chart comparing their strength."
  }
];

export default function DomainAuthorityPage() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<DomainMetric[]>([]);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    const domains = inputText
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    if (domains.length === 0) {
      toast.error("Please enter at least one domain.");
      return;
    }

    if (domains.length > 10) {
      toast.error("Maximum 10 domains allowed at a time.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const fetchPromises = domains.map(async (domain) => {
        try {
          const res = await fetch(`/api/domain-info?domain=${encodeURIComponent(domain)}`);
          const data = await res.json();
          if (!res.ok) {
            return {
              domain,
              da: 0,
              pa: 0,
              spamScore: 0,
              backlinks: 0,
              referringDomains: 0,
              lastUpdated: "N/A",
              error: data.error || "Failed to resolve"
            } as any;
          }
          return data;
        } catch {
          return {
            domain,
            da: 0,
            pa: 0,
            spamScore: 0,
            backlinks: 0,
            referringDomains: 0,
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
      } else if (successfulCount < domains.length) {
        toast.error(`${domains.length - successfulCount} domain(s) failed to resolve.`);
      } else {
        toast.success("Domain authority metrics calculated successfully!");
      }
    } catch {
      toast.error("An error occurred while checking domains.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDaBadgeColor = (da: number) => {
    if (da <= 30) return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    if (da <= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-primary bg-primary/10 border-primary/20";
  };

  const getAuthorityLabel = (da: number) => {
    if (da <= 30) return "Low Authority (New or Spam Site)";
    if (da <= 60) return "Medium Authority (Growing Brand)";
    return "High Authority (Established Industry Leader)";
  };

  // Recharts comparison structure
  const comparisonChartData = results.map((r) => ({
    name: r.domain,
    value: r.da
  }));

  // Table Columns
  const columns: ColumnConfig<DomainMetric>[] = [
    {
      key: "domain",
      label: "Domain",
      sortable: true,
      render: (val) => (
        <span className="text-foreground font-semibold flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-primary" />
          {val}
        </span>
      )
    },
    {
      key: "da",
      label: "DA Score",
      sortable: true,
      render: (val) => (
        <span className={cn(
          "px-2.5 py-0.5 rounded text-xs font-bold font-mono border",
          getDaBadgeColor(val)
        )}>
          DA {val}
        </span>
      )
    },
    {
      key: "pa",
      label: "PA Score",
      sortable: true,
      render: (val) => (
        <span className="font-bold text-foreground font-mono">PA {val}</span>
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
    },
    {
      key: "backlinks",
      label: "Backlinks Count",
      sortable: true,
      render: (val) => (
        <span className="text-primary font-bold">{formatNumber(val)}</span>
      )
    },
    {
      key: "referringDomains",
      label: "Referring Domains",
      sortable: true,
      render: (val) => (
        <span className="text-foreground font-semibold">{formatNumber(val)}</span>
      )
    },
    {
      key: "lastUpdated",
      label: "Last Updated",
      sortable: true
    }
  ];

  return (
    <ToolLayout toolId="domain-authority" guideSteps={guideSteps}>
      
      {/* Input textarea */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleCheck} className="space-y-4">
            
            <div className="space-y-1.5">
              <label htmlFor="domains" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Enter Domains (Up to 10, one per line)
              </label>
              <Textarea
                id="domains"
                placeholder="e.g.&#10;google.com&#10;github.com&#10;wikipedia.org"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Check Domain Authority
            </Button>

          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="table" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && results.length > 0 && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Primary circular meter for first item */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Score circle */}
            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-center items-center text-center gap-4">
              <span className="text-xs font-bold uppercase text-accent">Primary Domain Audit</span>
              <h4 className="font-extrabold text-lg text-foreground line-clamp-1">{results[0].domain}</h4>
              
              <div className="relative flex items-center justify-center h-28 w-28">
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="var(--border)" strokeWidth="8" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="transparent"
                    stroke={results[0].da > 60 ? "#a3e635" : results[0].da > 30 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - results[0].da / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-foreground">{results[0].da}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">DA Score</span>
                </div>
              </div>

              <span className="text-xs font-semibold text-muted-foreground">
                {getAuthorityLabel(results[0].da)}
              </span>
            </Card>

            {/* General Advice or Multi-domain Compare Chart */}
            <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2 h-full flex flex-col justify-center gap-4">
              {results.length > 1 ? (
                <div className="space-y-2">
                  <h4 className="font-bold text-base text-foreground">Domain Authority Comparison</h4>
                  <BarChart data={comparisonChartData} color="#a3e635" layout="vertical" />
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-bold text-base text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Domain Health Details
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Domain Authority is a search engine ranking score developed by third parties. It predicts how likely a website is to rank in SERPs, ranging from 1 to 100.
                  </p>
                  
                  <div className="space-y-1 text-xs text-muted-foreground border-t border-card-border/20 pt-3">
                    <div className="flex justify-between py-1">
                      <span>DA Category:</span>
                      <strong className="text-foreground">{results[0].da > 60 ? "Strong" : results[0].da > 30 ? "Medium" : "Weak"}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Spam Risk:</span>
                      <strong className={results[0].spamScore > 10 ? "text-rose-500" : "text-primary"}>
                        {results[0].spamScore > 10 ? "High Risk" : "Low Risk"}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </Card>

          </div>

          {/* Detailed table view */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground">Authority Breakdown Table</h3>
              <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                Scores are estimates. For exact profiles, use Moz or Ahrefs.
              </span>
            </div>
            
            <ResultsTable
              columns={columns}
              data={results}
              csvFilename="domain_authority_scores.csv"
              searchKey="domain"
              searchPlaceholder="Filter domains..."
              pageSize={10}
            />
          </div>

        </div>
      )}

    </ToolLayout>
  );
}
