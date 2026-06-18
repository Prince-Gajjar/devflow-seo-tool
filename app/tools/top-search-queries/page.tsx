"use client";

import React, { useState } from "react";
import { Search, Globe, Languages, TrendingUp, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { ResultsTable, ColumnConfig } from "@/components/tools/ResultsTable";
import { BarChart } from "@/components/charts/BarChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { getSearchQueries, SearchQueryItem } from "@/lib/mock-data/domains";
import { cn, formatNumber } from "@/lib/utils";

const countries = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" }
];

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" }
];

const guideSteps = [
  {
    title: "Select search query mode",
    description: "Choose 'By Domain' to find keywords a specific website ranks for, or 'By Topic' to generate trending search terms around a keyword."
  },
  {
    title: "Configure targeting criteria",
    description: "Adjust target countries and languages to load local search metrics, clicks, and impressions relevant to your niche."
  },
  {
    title: "Inspect intent classifications",
    description: "Audit click-through rates (CTR) and positions, and check intent badges (Informational, Transactional, Navigational, Commercial)."
  }
];

export default function TopSearchQueriesPage() {
  const [activeTab, setActiveTab] = useState("domain");
  const [inputText, setInputText] = useState("");
  const [country, setCountry] = useState("IN");
  const [language, setLanguage] = useState("en");

  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [queriesList, setQueriesList] = useState<SearchQueryItem[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) {
      toast.error(activeTab === "domain" ? "Please enter a domain." : "Please enter a topic.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      if (activeTab === "domain") {
        const res = await fetch(`/api/domain-info?domain=${encodeURIComponent(inputText)}`);
        const apiData = await res.json();

        if (!res.ok) {
          throw new Error(apiData.error || "Failed to resolve domain");
        }

        const mockData = getSearchQueries(inputText, "domain");
        const scaledQueries = mockData.map((q) => {
          const factor = apiData.da / 50;
          const clicks = Math.round(q.clicks * factor);
          const impressions = Math.round(q.impressions * factor);
          return {
            ...q,
            clicks,
            impressions,
            ctr: impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0
          };
        });

        setQueriesList(scaledQueries);
        toast.success("Domain search queries loaded successfully!");
      } else {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(inputText)}&gl=${country}&hl=${language}`);
        const apiData = await res.json();

        if (!res.ok) {
          throw new Error(apiData.error || "Failed to load suggestions");
        }

        const suggestions = apiData.suggestions || [];
        const mappedQueries: SearchQueryItem[] = suggestions.map((s: any, idx: number) => {
          const position = idx + 1.2 + (Math.random() * 0.5);
          const ctr = parseFloat(Math.max(1.5, 30.5 - position * 2.8).toFixed(2));
          const clicks = Math.round(s.volume * 0.12);
          const impressions = Math.round((clicks / (ctr / 100)) || s.volume);

          const text = s.keyword.toLowerCase();
          let intent: "Informational" | "Commercial" | "Transactional" | "Navigational" = "Informational";
          if (text.includes("buy") || text.includes("price") || text.includes("cheap") || text.includes("order")) {
            intent = "Transactional";
          } else if (text.includes("best") || text.includes("review") || text.includes("vs") || text.includes("compare")) {
            intent = "Commercial";
          } else if (text.includes("login") || text.includes("sign in") || text.includes("official")) {
            intent = "Navigational";
          }

          return {
            query: s.keyword,
            clicks,
            impressions,
            ctr,
            position: parseFloat(position.toFixed(1)),
            intent
          };
        });

        setQueriesList(mappedQueries);
        toast.success("Topic queries compiled successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while retrieving search queries.");
      setQueriesList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Compile top 5 queries by clicks for comparison chart
  const topQueriesChartData = queriesList.slice(0, 5).map((q) => ({
    name: q.query.length > 15 ? q.query.substring(0, 12) + "..." : q.query,
    value: q.clicks
  }));

  const getIntentBadge = (intent: string) => {
    switch (intent) {
      case "Informational":
        return "bg-card-border/30 text-muted-foreground border border-card-border/50";
      case "Commercial":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Transactional":
        return "bg-primary/10 text-primary border border-primary/20";
      case "Navigational":
        return "bg-card-border/30 text-muted-foreground border border-card-border/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Columns Configuration
  const columns: ColumnConfig<SearchQueryItem>[] = [
    {
      key: "query",
      label: "Search Query",
      sortable: true,
      render: (val) => <span className="text-foreground font-semibold">{val}</span>
    },
    {
      key: "intent",
      label: "User Intent",
      sortable: true,
      render: (val) => (
        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", getIntentBadge(val))}>
          {val}
        </span>
      )
    },
    {
      key: "impressions",
      label: "Impressions",
      sortable: true,
      render: (val) => <span className="text-foreground font-semibold">{formatNumber(val)}</span>
    },
    {
      key: "clicks",
      label: "Clicks",
      sortable: true,
      render: (val) => <span className="text-primary font-bold">{formatNumber(val)}</span>
    },
    {
      key: "ctr",
      label: "CTR %",
      sortable: true,
      render: (val) => <span className="text-primary font-bold">{val}%</span>
    },
    {
      key: "position",
      label: "Avg. Position",
      sortable: true,
      render: (val) => (
        <span className={cn(
          "font-bold font-mono px-1.5 py-0.5 rounded text-xs",
          val <= 3.0 ? "text-primary bg-primary/5 border border-primary/10" : val <= 10.0 ? "text-amber-500 bg-amber-500/5 border border-amber-500/10" : "text-muted-foreground bg-border/40"
        )}>
          {val.toFixed(1)}
        </span>
      )
    }
  ];

  return (
    <ToolLayout toolId="top-search-queries" guideSteps={guideSteps}>
      
      <Tabs defaultValue="domain" value={activeTab} onValueChange={(val) => {
        setActiveTab(val);
        setInputText("");
        setHasSearched(false);
        setQueriesList([]);
      }}>
        
        {/* Tab switch */}
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="domain" className="gap-1.5">
              <Globe className="h-4 w-4" />
              By Domain
            </TabsTrigger>
            <TabsTrigger value="topic" className="gap-1.5">
              <Search className="h-4 w-4" />
              By Topic
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Input Card */}
        <Card className="border-card-border/60 bg-card/40 shadow-md">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              
              {/* Tab specific input */}
              <div className="md:col-span-2 space-y-1.5">
                <TabsContent value="domain" className="m-0 space-y-1.5">
                  <label htmlFor="domainInput" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Enter Domain Name
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="domainInput"
                      placeholder="e.g. devflow.co.in"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="topic" className="m-0 space-y-1.5">
                  <label htmlFor="topicInput" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Enter Topic / Keyword
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="topicInput"
                      placeholder="e.g. machine learning tools"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </TabsContent>
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  Target Country
                </label>
                <Select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <label htmlFor="lang" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Languages className="h-3.5 w-3.5 text-primary" />
                  Language
                </label>
                <Select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Submit */}
              <div className="md:col-span-4 mt-2">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Get Queries
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </Tabs>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="table" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && queriesList.length > 0 && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Chart Comparing Top 5 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2">
              <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Clicks Comparison of Top 5 Queries
              </h4>
              <BarChart data={topQueriesChartData} layout="horizontal" color="#a3e635" />
            </Card>

            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-between h-full gap-4">
              <div className="space-y-2">
                <h4 className="font-bold text-base text-foreground flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-accent" />
                  Intent Breakdown
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Understanding search intent helps you tailor content. 
                  <strong> Commercial</strong> keywords lead to purchases, while <strong>Informational</strong> drive top-of-funnel traffic.
                </p>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground border-t border-card-border/20 pt-3">
                <div className="flex justify-between">
                  <span>Informational:</span>
                  <strong className="text-foreground">~40%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Commercial/Transactional:</span>
                  <strong className="text-foreground">~45%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Navigational:</span>
                  <strong className="text-foreground">~15%</strong>
                </div>
              </div>
            </Card>

          </div>

          {/* Detailed table view */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Trending Search Queries Directory</h3>
            <ResultsTable
              columns={columns}
              data={queriesList}
              csvFilename={`search_queries_${inputText.trim().toLowerCase().replace(/[^\w]/g, "_")}.csv`}
              searchKey="query"
              searchPlaceholder="Filter queries..."
              pageSize={15}
            />
          </div>

        </div>
      )}

    </ToolLayout>
  );
}
