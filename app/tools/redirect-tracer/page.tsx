"use client";
 
import React, { useState } from "react";
import { Link2, ArrowDown, ShieldCheck, AlertCircle, Info, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
 
interface RedirectHop {
  url: string;
  status: number;
  latency: number;
  type: string;
}
 
const guideSteps = [
  {
    title: "Enter the source URL",
    description: "Input any website URL (e.g. 'http://nextjs.org' or 'http://google.com') that you expect redirects on."
  },
  {
    title: "Verify redirect chain steps",
    description: "Click 'Trace Redirects' to execute queries. The server intercepts Location headers to map the chain."
  },
  {
    title: "Analyze canonical and HTTP codes",
    description: "Review HTTP codes (301 Permanent, 302 Temporary, 200 OK) and latency for each hop to optimize page indexing speed."
  }
];
 
export default function RedirectTracerPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hops, setHops] = useState<RedirectHop[]>([]);
 
  const handleTrace = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!url.trim()) {
      toast.error("Please enter a URL to trace.");
      return;
    }
 
    setIsLoading(true);
    setHasSearched(true);
    setHops([]);
 
    try {
      const res = await fetch(`/api/redirect-trace?url=${encodeURIComponent(url)}`);
      const data = await res.json();
 
      if (!res.ok) {
        throw new Error(data.error || "Failed to trace redirects");
      }
 
      setHops(data.hops || []);
      toast.success("Redirect chain traced successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while tracing redirects.");
      setHops([]);
    } finally {
      setIsLoading(false);
    }
  };
 
  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return "bg-primary/10 text-primary border border-primary/20";
    }
    if (status >= 300 && status < 400) {
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    }
    return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
  };
 
  return (
    <ToolLayout toolId="redirect-tracer" guideSteps={guideSteps}>
      
      {/* Input */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleTrace} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow space-y-1.5 w-full text-left">
              <label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Enter URL to Trace
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="e.g. http://nextjs.org"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9 font-mono text-sm"
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto font-mono" isLoading={isLoading}>
              Trace Redirects
            </Button>
          </form>
        </CardContent>
      </Card>
 
      {/* Loading */}
      {isLoading && <LoadingSkeleton type="generic" />}
 
      {/* Results Workspace */}
      {!isLoading && hasSearched && hops.length > 0 && (
        <div className="space-y-8 animate-fadeIn text-left">
          
          {/* Visual Chain Representation */}
          <Card className="bg-[#09090b]/40 border-card-border/60 p-6 space-y-6">
            <h3 className="text-base font-semibold text-foreground border-b border-card-border/20 pb-3 flex items-center gap-2">
              <RefreshCw className="h-4.5 w-4.5 text-primary" />
              Redirect Chain Map ({hops.length} {hops.length === 1 ? "Hop" : "Hops"})
            </h3>
 
            <div className="relative pl-6 md:pl-10 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-card-border/60 before:z-0">
              {hops.map((hop, index) => (
                <div key={index} className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-black/40 border border-card-border/40 rounded p-4">
                  {/* Dot indicator */}
                  <div className={`absolute -left-[22px] md:-left-[38px] top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-black ${
                    hop.status >= 200 && hop.status < 300 ? "bg-primary" : "bg-amber-500"
                  }`} />
 
                  {/* Hop URL and details */}
                  <div className="space-y-1 text-left flex-grow">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                      Hop {index + 1}: {hop.type}
                    </span>
                    <a href={hop.url} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-foreground hover:text-primary transition-colors block truncate max-w-[280px] md:max-w-xl">
                      {hop.url}
                    </a>
                  </div>
 
                  {/* Metrics Row */}
                  <div className="flex items-center gap-4 self-end md:self-auto text-xs">
                    <span className="font-mono text-muted-foreground font-light">{hop.latency}ms</span>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${getStatusBadge(hop.status)}`}>
                      HTTP {hop.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
 
          {/* Detailed Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Card className="bg-[#09090b]/40 border-card-border/60 p-6 space-y-3">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                SEO Health Diagnostics
              </h4>
              <ul className="text-xs space-y-2 text-muted-foreground leading-relaxed">
                <li className="flex justify-between border-b border-card-border/20 pb-1.5">
                  <span>Redirect type:</span>
                  <strong className="text-foreground">
                    {hops[0].status === 301 ? "301 Permanent (Preferred)" : hops[0].status === 302 ? "302 Temporary (Impedes Index)" : "None"}
                  </strong>
                </li>
                <li className="flex justify-between border-b border-card-border/20 pb-1.5">
                  <span>Chain latency:</span>
                  <strong className="text-foreground">
                    {hops.reduce((acc, c) => acc + c.latency, 0)} ms
                  </strong>
                </li>
                <li className="flex justify-between">
                  <span>Status code check:</span>
                  <strong className={hops[hops.length - 1].status === 200 ? "text-primary" : "text-rose-500"}>
                    {hops[hops.length - 1].status === 200 ? "200 OK (Clean Target)" : `Error ${hops[hops.length - 1].status}`}
                  </strong>
                </li>
              </ul>
            </Card>
 
            <Card className="bg-[#09090b]/40 border-card-border/60 p-6 space-y-3">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-accent" />
                Redirect Rules Advice
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">
                Chains with more than 3 redirect hops suffer from crawl budget waste and cause Google crawlers to drop indexing priority. Avoid chaining redirection paths (e.g. A ➔ B ➔ C); redirect A ➔ C directly.
              </p>
            </Card>
 
          </div>
 
        </div>
      )}
 
    </ToolLayout>
  );
}
