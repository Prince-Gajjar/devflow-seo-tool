"use client";

import React, { useState } from "react";
import { Link2, Bot, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Code, ListChecks } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCrawlabilityTest, CrawlabilityMetric } from "@/lib/mock-data/domains";
import { cn, isValidUrl } from "@/lib/utils";

const botsList = [
  { code: "Googlebot", name: "Googlebot (Google)" },
  { code: "Bingbot", name: "Bingbot (Bing/Microsoft)" },
  { code: "DuckDuckBot", name: "DuckDuckBot (DuckDuckGo)" },
  { code: "GenericBot", name: "Generic Bot (User Agent Crawler)" }
];

const guideSteps = [
  {
    title: "Specify URL and Search Bot",
    description: "Enter your target webpage URL (e.g. 'https://devflow.co.in/docs') and select a crawler user-agent bot to run the audit as."
  },
  {
    title: "Run crawlers audit scan",
    description: "Click 'Test Crawlability' to test response codes, canonical headers, robots restrictions, and loading latency thresholds."
  },
  {
    title: "Implement checklist suggestions",
    description: "Review failed checklists or warnings (such as pagespeed latency blocks) and apply the listed recommendations to secure index coverage."
  }
];

export default function CrawlabilityPage() {
  const [url, setUrl] = useState("");
  const [bot, setBot] = useState("Googlebot");
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [data, setData] = useState<{
    score: number;
    checks: CrawlabilityMetric[];
    headers: string;
    robotsRules: string;
    recommendations: string[];
  } | null>(null);

  const handleTest = async (e: React.FormEvent) => {
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
      const res = await fetch(`/api/scrape?mode=crawlability&url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to scan crawlability metrics");
      }

      setData(data);
      toast.success("Crawlability audit completed successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during crawlability scan.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: "success" | "fail" | "warning") => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return "text-primary";
    if (score > 55) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <ToolLayout toolId="crawlability" guideSteps={guideSteps}>
      
      {/* Input Form */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleTest} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            
            {/* URL input */}
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Webpage URL to Test
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="https://example.com/target-page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Select bot */}
            <div className="space-y-1.5">
              <label htmlFor="bot" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
                User-Agent Bot
              </label>
              <Select id="bot" value={bot} onChange={(e) => setBot(e.target.value)}>
                {botsList.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Submit */}
            <div className="md:col-span-3 mt-2">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Test Crawlability
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="generic" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && data && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header Row: Score & Recommendation list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Score circle */}
            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col justify-center items-center text-center gap-4">
              <span className="text-xs font-bold uppercase text-muted-foreground">Crawler Access Score</span>
              
              <div className="relative flex items-center justify-center h-28 w-28">
                <svg className="h-full w-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="var(--border)" strokeWidth="8" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="transparent"
                    stroke={data.score > 80 ? "#a3e635" : data.score > 55 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - data.score / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={cn("text-3xl font-black", getScoreColor(data.score))}>{data.score}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">/ 100</span>
                </div>
              </div>

              <span className={cn("text-xs font-semibold uppercase tracking-wider", getScoreColor(data.score))}>
                {data.score > 80 ? "Fully Crawlable" : data.score > 55 ? "Partially Restricted" : "Index Blocked"}
              </span>
            </Card>

            {/* Recommendations checklist */}
            <Card className="bg-card/30 border-card-border/60 p-6 col-span-1 md:col-span-2 space-y-4">
              <h4 className="font-bold text-base text-foreground flex items-center gap-1.5 border-b border-card-border/20 pb-2">
                <ListChecks className="h-4 w-4 text-primary" />
                Actionable Fix Recommendations
              </h4>
              
              <ul className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {data.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 items-start bg-card-border/10 p-2.5 rounded border border-card-border/10 text-xs font-semibold text-foreground">
                    <span className="flex h-4.5 w-4.5 items-center justify-center rounded bg-primary/20 text-primary font-bold shrink-0">{i+1}</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

          </div>

          {/* Checklist grid list */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Crawling Checklist audits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.checks.map((chk, i) => (
                <div key={i} className="flex gap-3 items-start bg-card/10 border border-card-border/60 p-3.5 rounded">
                  {getStatusIcon(chk.status)}
                  <div className="space-y-0.5">
                    <h5 className="text-sm font-bold text-foreground">{chk.title}</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">{chk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw headers & Robots relevant rules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Raw HTTP Response Headers */}
            <Card className="bg-card/30 border-card-border/60">
              <CardHeader className="border-b border-card-border/30">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Code className="h-4 w-4 text-accent" />
                  Raw Server HTTP Response Headers
                </CardTitle>
                <CardDescription>Crawl headers scanned from the target server.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="p-4 rounded bg-black border border-card-border/40 text-[10px] font-mono text-primary overflow-x-auto max-h-56 leading-relaxed">
                  <code>{data.headers}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Robots.txt rules for this Bot */}
            <Card className="bg-card/30 border-card-border/60">
              <CardHeader className="border-b border-card-border/30">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  Relevant Robots.txt Directives
                </CardTitle>
                <CardDescription>Robots parameters applied to user-agent: {bot}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <pre className="p-4 rounded bg-black border border-card-border/40 text-xs font-mono text-amber-400 overflow-x-auto max-h-56 leading-relaxed">
                  <code>{data.robotsRules}</code>
                </pre>
              </CardContent>
            </Card>

          </div>

        </div>
      )}

    </ToolLayout>
  );
}
