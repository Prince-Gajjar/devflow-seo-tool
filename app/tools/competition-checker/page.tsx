"use client";

import React, { useState } from "react";
import { Globe, Users, Zap, Shield, Search, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCompetitorData, CompetitorData } from "@/lib/mock-data/domains";
import { cn, formatNumber, formatUrl } from "@/lib/utils";

const guideSteps = [
  {
    title: "Enter a competitor domain",
    description: "Input the domain address of a competitor website in your niche (e.g. 'competitor.com')."
  },
  {
    title: "Run comparative competitor analysis",
    description: "Click 'Analyze Competitor' to trigger our scanning bot. We will index page keywords, traffic, backlinks, and page speeds."
  },
  {
    title: "Review tabulated audits",
    description: "Navigate between the Overview, Content, Backlinks, and Technical tabs to gain insights on competitor publishing speeds and rankings."
  }
];

export default function CompetitionCheckerPage() {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [compData, setCompData] = useState<CompetitorData | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!domain.trim()) {
      toast.error("Please enter a competitor domain.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/domain-info?domain=${encodeURIComponent(domain)}&mode=competitor`);
      const apiData = await res.json();

      if (!res.ok) {
        throw new Error(apiData.error || "Failed to resolve domain");
      }

      setCompData(apiData);
      toast.success("Competitor SEO profile compiled successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while analyzing competitor domain.");
      setCompData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToolLayout toolId="competition-checker" guideSteps={guideSteps}>
      
      {/* Search Input */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow space-y-1.5">
              <label htmlFor="domain" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Competitor Domain Name
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="domain"
                  placeholder="e.g. competitor.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto" isLoading={isLoading}>
              Analyze Competitor
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="generic" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && compData && (
        <div className="space-y-8 animate-fadeIn">
          
          <Tabs defaultValue="overview" className="w-full">
            
            {/* Tabs List */}
            <div className="flex justify-start border-b border-card-border/40 pb-2">
              <TabsList className="bg-card-border/30 border border-card-border/10">
                <TabsTrigger value="overview" className="gap-1.5">
                  <Globe className="h-4 w-4 text-primary" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="content" className="gap-1.5">
                  <Zap className="h-4 w-4 text-primary" />
                  Content Profile
                </TabsTrigger>
                <TabsTrigger value="backlinks" className="gap-1.5">
                  <Shield className="h-4 w-4 text-primary" />
                  Backlinks profile
                </TabsTrigger>
                <TabsTrigger value="technical" className="gap-1.5">
                  <Users className="h-4 w-4 text-primary" />
                  Technical Audits
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: OVERVIEW */}
            <TabsContent value="overview" className="space-y-6">
              
              {/* Stats card grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                
                <Card className="bg-card/30 border-card-border/60 p-6 text-center space-y-1.5">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Domain DA</span>
                  <h3 className="text-3xl font-black text-primary">DA {compData.da}</h3>
                  <span className="text-xs text-muted-foreground">PA Score: {compData.pa}</span>
                </Card>

                <Card className="bg-card/30 border-card-border/60 p-6 text-center space-y-1.5">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Domain Age</span>
                  <h3 className="text-3xl font-black text-foreground">{compData.age} Years</h3>
                  <span className="text-xs text-muted-foreground">Est. Registration age</span>
                </Card>

                <Card className="bg-card/30 border-card-border/60 p-6 text-center space-y-1.5">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Indexed Pages</span>
                  <h3 className="text-3xl font-black text-foreground">{formatNumber(compData.indexedPages)}</h3>
                  <span className="text-xs text-muted-foreground">Google Index Pages</span>
                </Card>

                <Card className="bg-card/30 border-card-border/60 p-6 text-center space-y-1.5">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Est. Monthly Visits</span>
                  <h3 className="text-lg font-black text-primary leading-8">{compData.trafficEstimate}</h3>
                  <span className="text-xs text-muted-foreground">Approx. visits range</span>
                </Card>

              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ranking Keywords List */}
                 <Card className="bg-card/30 border-card-border/60 p-6 space-y-4">
                  <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                    <Search className="h-4 w-4 text-primary" />
                    Top Ranking Organic Keywords
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {compData.topKeywords.map((kw, i) => (
                      <div key={i} className="flex justify-between items-center bg-card-border/10 p-2 rounded text-xs font-semibold">
                        <span className="text-foreground">{kw.keyword}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">Vol: {formatNumber(kw.volume)}</span>
                          <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">Rank #{kw.position}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Country distribution */}
                <Card className="bg-card/30 border-card-border/60 p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                      <Globe className="h-4 w-4 text-primary" />
                      Geographic Audience Distribution
                    </h4>
                    <div className="space-y-3">
                      {compData.countries.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-bold">
                          <span className="flex items-center gap-2 text-foreground">
                            {c.country}
                          </span>
                          <div className="flex items-center gap-3 w-1/2 justify-end">
                            <div className="w-24 bg-border/40 h-2 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${c.pct}%` }} />
                            </div>
                            <span className="text-muted-foreground w-8 text-right">{c.pct}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pt-4 border-t border-card-border/10">
                    * Country weights are estimated based on referring domains and local search indexes.
                  </p>
                </Card>

              </div>

            </TabsContent>

            {/* TAB 2: CONTENT PROFILE */}
            <TabsContent value="content" className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                
                {/* Content quick stats */}
                <div className="space-y-6">
                  
                  <Card className="bg-card/30 border-card-border/60 p-6 text-center space-y-1.5">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Average Post Length</span>
                    <h3 className="text-2xl font-black text-foreground">{compData.avgContentLength} Words</h3>
                    <span className="text-xs text-muted-foreground">In-depth editorial status</span>
                  </Card>

                  <Card className="bg-card/30 border-card-border/60 p-6 text-center space-y-1.5">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Publishing Frequency</span>
                    <h3 className="text-2xl font-black text-primary">{compData.publishingFrequency}</h3>
                    <span className="text-xs text-muted-foreground">Estimated publication pace</span>
                  </Card>

                </div>

                {/* Recent posts list */}
                <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2 space-y-4">
                  <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Top Performing Content Pages
                  </h4>
                  
                  <div className="space-y-3">
                    {compData.recentPosts.map((post, i) => (
                      <div key={i} className="flex justify-between items-start bg-card-border/10 p-3 rounded text-xs gap-3">
                        <div className="space-y-1">
                          <h6 className="font-bold text-foreground line-clamp-1">{post.title}</h6>
                          <span className="text-muted-foreground font-mono block truncate max-w-[200px] sm:max-w-xs">{post.url}</span>
                        </div>
                        <span className="bg-primary/15 text-primary px-2 py-0.5 rounded font-bold shrink-0">
                          ~{post.traffic} visits / mo
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

              </div>

            </TabsContent>

            {/* TAB 3: BACKLINKS */}
            <TabsContent value="backlinks" className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                
                {/* Total estimate backlinks */}
                <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-center items-center text-center gap-2">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Estimated Backlinks</span>
                  <h3 className="text-3xl font-black text-primary">{formatNumber(compData.totalBacklinks)}</h3>
                  <span className="text-xs text-muted-foreground">Incoming hyperlink connections</span>
                </Card>

                {/* Top Referring Domains */}
                <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2 space-y-4">
                  <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Top Competitor Referring Domains
                  </h4>
                  
                  <div className="space-y-3">
                    {compData.topReferrers.map((ref, i) => (
                      <div key={i} className="flex justify-between items-center bg-card-border/10 p-2.5 rounded text-xs font-semibold">
                        <span className="text-foreground flex items-center gap-2">
                          <span className="font-bold text-muted-foreground">#{i + 1}</span>
                          {ref}
                        </span>
                        <span className="text-primary hover:underline cursor-pointer">Explore links →</span>
                      </div>
                    ))}
                  </div>
                </Card>

              </div>

            </TabsContent>

            {/* TAB 4: TECHNICAL */}
            <TabsContent value="technical" className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                
                {/* Speed score visual */}
                <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-center items-center text-center gap-4">
                  <span className="text-xs font-bold uppercase text-muted-foreground">Simulated Page Speed Score</span>
                  
                  <div className="relative flex items-center justify-center h-28 w-28">
                    <svg className="h-full w-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" fill="transparent" stroke="var(--border)" strokeWidth="8" />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="transparent"
                        stroke={compData.pageSpeed > 80 ? "#a3e635" : compData.pageSpeed > 50 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - compData.pageSpeed / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black text-foreground">{compData.pageSpeed}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">Performance</span>
                    </div>
                  </div>

                  <span className={cn(
                    "text-xs font-bold",
                    compData.pageSpeed > 80 ? "text-primary" : compData.pageSpeed > 50 ? "text-amber-500" : "text-rose-500"
                  )}>
                    {compData.pageSpeed > 80 ? "Fast Loading speed" : "Needs optimizations"}
                  </span>
                </Card>

                {/* Audit checklist technical parameters */}
                <Card className="bg-card/30 border-card-border/60 p-6 space-y-4">
                  <h4 className="font-bold text-base text-foreground border-b border-card-border/20 pb-2">Technical SEO Configurations</h4>
                  
                  <div className="space-y-4">
                    {[
                      { label: "Mobile Optimization", value: compData.mobileFriendly, desc: "Is viewport and mobile layout active?" },
                      { label: "Secure Connection (HTTPS)", value: compData.https, desc: "Is security SSL padlock active on server?" },
                      { label: "Sitemap Configured", value: compData.sitemapFound, desc: "Was index sitemap found in robots.txt?" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-card-border/10 p-3 rounded border border-card-border/10">
                        <div>
                          <h6 className="text-xs font-bold text-foreground">{item.label}</h6>
                          <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                        </div>
                        {item.value ? (
                          <span className="flex items-center gap-1 text-xs text-primary font-bold">
                            <CheckCircle className="h-4 w-4" /> Yes
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-rose-500 font-bold">
                            <XCircle className="h-4 w-4" /> No
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

              </div>

            </TabsContent>

          </Tabs>

        </div>
      )}

    </ToolLayout>
  );
}
