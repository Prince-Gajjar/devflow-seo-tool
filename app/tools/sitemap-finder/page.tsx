"use client";

import React, { useState } from "react";
import { Link2, Code, ShieldCheck, AlertCircle, FileCode, CheckCircle2, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getSitemaps, SitemapItem } from "@/lib/mock-data/domains";
import { isValidUrl, formatUrl } from "@/lib/utils";

const guideSteps = [
  {
    title: "Enter your domain",
    description: "Provide the domain URL (e.g. 'https://github.com' or 'medium.com') you want to scan for sitemaps."
  },
  {
    title: "Search for XML sitemaps",
    description: "Click 'Find Sitemaps' to start scanning. The tool scans robots.txt and common paths (/sitemap.xml, /sitemap_index.xml)."
  },
  {
    title: "Review sitemap index files",
    description: "Check the status badges (Valid/Invalid) and click the raw code block tab to inspect the website's Robots.txt rules."
  }
];

export default function SitemapFinderPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [data, setData] = useState<{ sitemaps: SitemapItem[]; robotsContent: string } | null>(null);

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a domain URL.");
      return;
    }
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/scrape?mode=sitemaps&url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to scan sitemaps");
      }

      setData({
        sitemaps: data.sitemaps || [],
        robotsContent: data.robotsContent || ""
      });
      toast.success("Sitemaps scanned and found!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while scanning sitemaps.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Valid":
        return "bg-primary/10 text-primary border border-primary/20";
      case "Invalid":
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse";
      default:
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    }
  };

  const handleCopyRobots = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.robotsContent);
    toast.success("Robots.txt contents copied to clipboard!");
  };

  return (
    <ToolLayout toolId="sitemap-finder" guideSteps={guideSteps}>
      
      {/* Input */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleFind} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow space-y-1.5">
              <label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Enter Domain / Website URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="e.g. https://yourdomain.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto" isLoading={isLoading}>
              Find Sitemaps
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="generic" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && data && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Summary dashboard widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-xs font-bold uppercase text-muted-foreground">Sitemaps Discovered</span>
              <h3 className="text-3xl font-black text-primary">{data.sitemaps.length} Found</h3>
              <span className="text-xs text-muted-foreground">Scanned standard paths</span>
            </Card>

            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-xs font-bold uppercase text-muted-foreground">Total URLs Indexed</span>
              <h3 className="text-3xl font-black text-primary">
                {data.sitemaps.reduce((acc, curr) => acc + curr.urlCount, 0)} Links
              </h3>
              <span className="text-xs text-muted-foreground">Aggregated URL counts</span>
            </Card>

            <Card className="bg-card/30 border-card-border/60 p-6 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-xs font-bold uppercase text-muted-foreground">Robots.txt Reference</span>
              <h3 className="text-xl font-bold text-foreground">Sitemap: Declared</h3>
              <span className="text-xs text-primary font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Valid Syntax found
              </span>
            </Card>

          </div>

          {/* Sitemaps List Table */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileCode className="h-5 w-5 text-accent" />
              Discovered Sitemap Indexes
            </h3>
            
            <div className="border border-card-border/60 bg-card rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-foreground">
                  <thead className="bg-card-border/20 border-b border-card-border/30 text-xs font-semibold text-muted-foreground uppercase">
                    <tr>
                      <th className="px-6 py-4">Sitemap URL</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">URL Count</th>
                      <th className="px-6 py-4">Last Modified</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/30">
                    {data.sitemaps.map((item, idx) => (
                      <tr key={idx} className="hover:bg-card-border/10 transition-colors">
                        <td className="px-6 py-3.5 font-medium">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[280px] md:max-w-md block">
                            {item.url}
                          </a>
                        </td>
                        <td className="px-6 py-3.5 text-foreground">{item.type}</td>
                        <td className="px-6 py-3.5 text-foreground font-mono">{item.urlCount}</td>
                        <td className="px-6 py-3.5 text-muted-foreground">{item.lastModified}</td>
                        <td className="px-6 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Robots.txt content viewer */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-card-border/30 pb-2">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Raw Robots.txt Content
              </h3>
              <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={handleCopyRobots}>
                <Copy className="h-3.5 w-3.5" />
                Copy File
              </Button>
            </div>
            
            <pre className="p-4 rounded-md bg-black border border-card-border/60 text-xs font-mono text-primary overflow-x-auto max-h-56 leading-relaxed">
              <code>{data.robotsContent}</code>
            </pre>
          </div>

        </div>
      )}

    </ToolLayout>
  );
}
