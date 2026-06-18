"use client";

import React, { useState, useMemo } from "react";
import { Globe, ShieldAlert, Award, AlertCircle, Info } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { ResultsTable, ColumnConfig } from "@/components/tools/ResultsTable";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getBacklinks, BacklinkItem } from "@/lib/mock-data/domains";
import { cn, formatNumber, formatUrl, createSeedRandom } from "@/lib/utils";

const tlds = [
  { code: "all", name: "All TLDs" },
  { code: ".com", name: ".com" },
  { code: ".org", name: ".org" },
  { code: ".edu", name: ".edu" },
  { code: ".gov", name: ".gov" }
];

const sortOptions = [
  { code: "da", name: "Authority (DA)" },
  { code: "firstSeen", name: "Date (First Seen)" },
  { code: "anchorText", name: "Anchor Text" }
];

const guideSteps = [
  {
    title: "Enter your domain",
    description: "Input the domain you want to audit (e.g. 'devflow.co.in' or 'example.com') to scan for incoming hyperlinks."
  },
  {
    title: "Configure filters & ordering",
    description: "Filter by top-level domains (TLDs like .edu or .gov) and choose to sort by domain authority (DA) or discovery date."
  },
  {
    title: "Audit link distributions",
    description: "Examine your average DA metrics, the ratio of DoFollow vs NoFollow backlinks in the donut chart, and download the full report."
  }
];

export default function BacklinksPage() {
  const [domain, setDomain] = useState("");
  const [tldFilter, setTldFilter] = useState("all");
  const [sortBy, setSortBy] = useState("da");

  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [backlinkData, setBacklinkData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!domain.trim()) {
      toast.error("Please enter a domain.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/domain-info?domain=${encodeURIComponent(domain)}&mode=backlinks`);
      const apiData = await res.json();

      if (!res.ok) {
        throw new Error(apiData.error || "Failed to resolve domain");
      }

      setBacklinkData(apiData);
      toast.success("Backlink profile retrieved successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while fetching backlinks.");
      setBacklinkData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort items dynamically on client side
  const processedItems = useMemo(() => {
    if (!backlinkData) return [];

    let items = [...backlinkData.items] as BacklinkItem[];

    // 1. TLD Filter
    if (tldFilter !== "all") {
      items = items.filter((item) => item.sourceDomain.endsWith(tldFilter));
    }

    // 2. Sort Logic
    items.sort((a, b) => {
      if (sortBy === "da") {
        return b.da - a.da; // Descending DA
      }
      if (sortBy === "anchorText") {
        return a.anchorText.localeCompare(b.anchorText);
      }
      if (sortBy === "firstSeen") {
        return new Date(b.firstSeen).getTime() - new Date(a.firstSeen).getTime(); // Newest first
      }
      return 0;
    });

    return items;
  }, [backlinkData, tldFilter, sortBy]);

  // Aggregate Referring Domains (grouping by hostname)
  const referringDomainsChartData = useMemo(() => {
    if (!backlinkData) return [];
    // Just compile domain authority values for top 5 sources
    return backlinkData.items
      .slice(0, 5)
      .map((item: BacklinkItem) => ({
        name: item.sourceDomain,
        value: item.da
      }));
  }, [backlinkData]);

  // Donut chart representation (dofollow vs nofollow)
  const donutChartData = useMemo(() => {
    if (!backlinkData) return [];
    return [
      { name: "DoFollow", value: backlinkData.doFollowPct },
      { name: "NoFollow", value: backlinkData.noFollowPct }
    ];
  }, [backlinkData]);

  // Table Columns
  const columns: ColumnConfig<BacklinkItem>[] = [
    {
      key: "sourceDomain",
      label: "Referring Domain",
      sortable: true,
      render: (val) => (
        <span className="text-foreground font-semibold flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-primary" />
          {val}
        </span>
      )
    },
    {
      key: "sourceUrl",
      label: "Link Target Source URL",
      render: (val) => (
        <a 
          href={val} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline block truncate max-w-[200px] md:max-w-xs"
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
        <span className="text-foreground font-semibold bg-card-border/10 px-2 py-1 rounded">
          {val}
        </span>
      )
    },
    {
      key: "da",
      label: "Domain DA",
      sortable: true,
      render: (val) => (
        <span className="font-bold text-accent font-mono">{val}</span>
      )
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (val) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-xs font-bold",
          val === "DoFollow" ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground"
        )}>
          {val}
        </span>
      )
    },
    {
      key: "firstSeen",
      label: "First Discovered",
      sortable: true
    }
  ];

  return (
    <ToolLayout toolId="backlinks" guideSteps={guideSteps}>
      
      {/* Input */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Domain */}
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="domain" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Domain Name
              </label>
              <Input
                id="domain"
                placeholder="e.g. devflow.co.in"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>

            {/* Filter by TLD */}
            <div className="space-y-1.5">
              <label htmlFor="tld" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Filter TLD
              </label>
              <Select id="tld" value={tldFilter} onChange={(e) => setTldFilter(e.target.value)}>
                {tlds.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Sort options */}
            <div className="space-y-1.5">
              <label htmlFor="sort" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Sort By
              </label>
              <Select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {sortOptions.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Submit */}
            <div className="md:col-span-4 mt-2">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Find Backlinks
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="stats" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && backlinkData && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Summary Dashboard row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            
            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Est. Total Backlinks</span>
                <h3 className="text-2xl font-black text-foreground">{formatNumber(backlinkData.totalBacklinks)}</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Referring Domains</span>
                <h3 className="text-2xl font-black text-primary">{formatNumber(backlinkData.uniqueDomains)}</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">DoFollow Ratio</span>
                <h3 className="text-2xl font-black text-primary">{backlinkData.doFollowPct}%</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">NoFollow Ratio</span>
                <h3 className="text-2xl font-black text-muted-foreground">{backlinkData.noFollowPct}%</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60 col-span-2 lg:col-span-1">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Average Domain DA</span>
                <h3 className="text-2xl font-black text-accent">DA {backlinkData.avgDa}</h3>
              </CardContent>
            </Card>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Donut Chart of follow/nofollow ratios */}
            <Card className="bg-card/30 border-card-border/60 p-6">
              <h4 className="font-bold text-base text-foreground flex items-center gap-1.5">
                <Award className="h-4 w-4 text-accent" />
                Link Type Distribution Ratio
              </h4>
              <DonutChart data={donutChartData} colors={["#a3e635", "#27272a"]} />
            </Card>

            {/* Bar Chart of top referring domains */}
            <Card className="bg-card/30 border-card-border/60 p-6">
              <h4 className="font-bold text-base text-foreground flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-primary" />
                Referring Domain Authority (DA) Strength
              </h4>
              <BarChart data={referringDomainsChartData} layout="horizontal" color="#a3e635" />
            </Card>

          </div>

          {/* Pro notice banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-primary/10 border border-primary/20 rounded">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary/20 rounded text-primary">
                <Info className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-foreground">Showing top 15 backlink sources</h5>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Analyze and audit your complete backlink database (10k+ referring domains) by upgrading to DevFlow Pro.
                </p>
              </div>
            </div>
            <Button size="sm" className="w-full sm:w-auto">Upgrade to Pro</Button>
          </div>

          {/* Table list */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Backlinks Profile Analysis</h3>
            <ResultsTable
              columns={columns}
              data={processedItems}
              csvFilename={`backlinks_${domain.replace(/[^\w]/g, "_")}.csv`}
              searchKey="sourceDomain"
              searchPlaceholder="Filter domains..."
              pageSize={10}
            />
          </div>

        </div>
      )}

    </ToolLayout>
  );
}
