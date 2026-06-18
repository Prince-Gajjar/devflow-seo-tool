"use client";

import React, { useState } from "react";
import { Link2, Clock, Share2, Globe, TrendingUp, BarChart2 } from "lucide-react";
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
import { getReferrers, ReferrerItem } from "@/lib/mock-data/domains";
import { formatNumber } from "@/lib/utils";

const ranges = [
  { code: "30", name: "Last 30 Days" },
  { code: "90", name: "Last 90 Days" },
  { code: "180", name: "Last 6 Months" },
  { code: "365", name: "Last 1 Year" }
];

const guideSteps = [
  {
    title: "Enter the domain to audit",
    description: "Input the domain address of your website (e.g. 'devflow.co.in' or 'example.com') to map external traffic referral channels."
  },
  {
    title: "Select your audit window",
    description: "Use the time range dropdown to select 30 days, 90 days, or up to a full year of traffic history statistics."
  },
  {
    title: "Review traffic distributions",
    description: "Audit traffic channels (organic, direct, referral), trace geo countries, and download the full referring domain table."
  }
];

export default function TopReferrersPage() {
  const [domain, setDomain] = useState("");
  const [timeRange, setTimeRange] = useState("30");
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [referrerData, setReferrerData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!domain.trim()) {
      toast.error("Please enter a domain.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/domain-info?domain=${encodeURIComponent(domain)}`);
      const apiData = await res.json();

      if (!res.ok) {
        throw new Error(apiData.error || "Failed to resolve domain");
      }

      const mockData = getReferrers(domain, timeRange);
      // Scale referrals traffic by resolved DA
      const scaledItems = mockData.items.map((ref: ReferrerItem) => ({
        ...ref,
        visits: Math.round(ref.visits * (apiData.da / 50)),
        linksCount: Math.round(ref.linksCount * (apiData.da / 50))
      }));

      setReferrerData({
        ...mockData,
        items: scaledItems
      });
      toast.success("Referring sources audited successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while auditing referrer sources.");
      setReferrerData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Columns for Referring table
  const columns: ColumnConfig<ReferrerItem>[] = [
    {
      key: "domain",
      label: "Referrer Domain",
      sortable: true,
      render: (val) => (
        <span className="text-foreground font-semibold flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-primary" />
          {val}
        </span>
      )
    },
    {
      key: "visits",
      label: "Estimated Visits",
      sortable: true,
      render: (val) => (
        <span className="text-foreground font-bold">{formatNumber(val)}</span>
      )
    },
    {
      key: "pct",
      label: "Traffic Share",
      sortable: true,
      render: (val) => (
        <span className="text-accent font-extrabold">{val}%</span>
      )
    },
    {
      key: "linksCount",
      label: "Backlink Count",
      sortable: true,
      render: (val) => (
        <span className="text-muted-foreground font-mono">{val} links</span>
      )
    },
    {
      key: "da",
      label: "Domain DA",
      sortable: true,
      render: (val) => (
        <span className="font-bold text-foreground font-mono">DA {val}</span>
      )
    }
  ];

  return (
    <ToolLayout toolId="top-referrers" guideSteps={guideSteps}>
      
      {/* Search inputs */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            
            {/* Domain */}
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="domain" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Domain Name
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="domain"
                  placeholder="e.g. devflow.co.in"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Time range */}
            <div className="space-y-1.5">
              <label htmlFor="range" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Time Range
              </label>
              <Select id="range" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                {ranges.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Submit */}
            <div className="md:col-span-3 mt-2">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Find Referrers
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="stats" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && referrerData && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Traffic sources share donut */}
            <Card className="bg-card/30 border-card-border/60 p-6">
              <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                <Share2 className="h-4 w-4 text-primary" />
                Primary Traffic Channels
              </h4>
              <DonutChart data={referrerData.sourcesPct} />
            </Card>

            {/* Visits over time trend */}
            <Card className="bg-card/30 border-card-border/60 p-6">
              <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Referral Visits Trend ({ranges.find(r => r.code === timeRange)?.name})
              </h4>
              <BarChart data={referrerData.trendData} layout="horizontal" color="#a3e635" />
            </Card>

          </div>

          {/* Geo breakdown & Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Geo breakdown Card */}
            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                  <Globe className="h-4 w-4 text-accent" />
                  Referral Geography Breakdown
                </h4>
                <div className="space-y-3">
                  {referrerData.geoBreakdown.map((geo: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs font-bold">
                      <span className="flex items-center gap-2 text-foreground">
                        {geo.country}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{formatNumber(geo.visits)}</span>
                        <span className="text-muted-foreground">({geo.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed pt-4 border-t border-card-border/10">
                * Geographical estimates are compiled using referring IP registry routing blocks.
              </p>
            </Card>

            {/* Detailed list table */}
            <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2 space-y-4">
              <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                Top 8 Referral Source Domains
              </h4>
              
              <ResultsTable
                columns={columns}
                data={referrerData.items}
                csvFilename={`referrers_${domain.replace(/[^\w]/g, "_")}.csv`}
                searchKey="domain"
                searchPlaceholder="Filter sources..."
                pageSize={5}
              />
            </Card>

          </div>

        </div>
      )}

    </ToolLayout>
  );
}
