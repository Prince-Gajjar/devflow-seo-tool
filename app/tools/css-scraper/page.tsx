"use client";
 
import React, { useState } from "react";
import { Link2, Code, Terminal, AlertCircle, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
 
const guideSteps = [
  {
    title: "Enter site URL",
    description: "Provide the address of the target page you want to scrape (e.g. 'https://github.com/trending')."
  },
  {
    title: "Specify custom CSS selector",
    description: "Type the selector rule (e.g. '.Box-row h2 a' or 'h1', 'img') you wish to match."
  },
  {
    title: "Inspect DOM query output",
    description: "Click 'Query Selectors' to parse the document and inspect matched nodes, text content, and properties."
  }
];
 
interface ScrapedItem {
  text: string;
  tag: string;
  attributes: Record<string, string>;
}
 
export default function CssScraperPage() {
  const [url, setUrl] = useState("");
  const [selector, setSelector] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<{ url?: string; selector?: string; count: number; matches: ScrapedItem[] } | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
 
  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!url.trim()) {
      toast.error("Please enter a website URL.");
      return;
    }
    if (!selector.trim()) {
      toast.error("Please enter a CSS selector.");
      return;
    }
 
    setIsLoading(true);
    setHasSearched(true);
    setResults(null);
 
    try {
      const res = await fetch(
        `/api/css-scraper?url=${encodeURIComponent(url)}&selector=${encodeURIComponent(selector)}`
      );
      const data = await res.json();
 
      if (!res.ok) {
        throw new Error(data.error || "Failed to parse CSS selectors");
      }
 
      setResults(data);
      toast.success(`Scraped ${data.count} matching nodes!`);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while running CSS scraper.");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    toast.success("Content text copied!");
  };
 
  return (
    <ToolLayout toolId="css-scraper" guideSteps={guideSteps}>
      
      {/* Inputs form */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6 text-left">
          <form onSubmit={handleQuery} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            
            <div className="md:col-span-2 space-y-1.5 w-full">
              <label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Target URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  placeholder="e.g. https://github.com/trending"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-9 font-mono text-sm"
                />
              </div>
            </div>
 
            <div className="md:col-span-2 space-y-1.5 w-full">
              <label htmlFor="selector" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                CSS Selector
              </label>
              <div className="relative">
                <Code className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="selector"
                  placeholder="e.g. h2.h3 a, .Box-row"
                  value={selector}
                  onChange={(e) => setSelector(e.target.value)}
                  className="pl-9 font-mono text-sm"
                />
              </div>
            </div>
 
            <Button type="submit" className="w-full font-mono" isLoading={isLoading}>
              Query Selectors
            </Button>
 
          </form>
        </CardContent>
      </Card>
 
      {/* Loading */}
      {isLoading && <LoadingSkeleton type="table" />}
 
      {/* Results Workspace */}
      {!isLoading && hasSearched && results && (
        <div className="space-y-6 animate-fadeIn text-left">
          
          {/* Summary */}
          <div className="flex justify-between items-center border-b border-card-border/30 pb-2">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-primary" />
              Scraped Selector Outputs
            </h3>
            <span className="text-xs font-mono font-bold text-primary px-2.5 py-0.5 rounded border border-primary/20 bg-primary/5">
              {results.count} Nodes Matched
            </span>
          </div>
 
          {/* Matches List */}
          {results.count > 0 ? (
            <div className="space-y-4">
              {results.matches.map((item, idx) => (
                <Card key={idx} className="bg-[#09090b]/40 border-card-border/60 p-4 space-y-3 font-mono text-xs">
                  
                  {/* Title node banner */}
                  <div className="flex items-center justify-between gap-2 border-b border-card-border/10 pb-2 text-[10px] text-muted-foreground">
                    <span className="font-bold text-primary uppercase">Element &lt;{item.tag}&gt;</span>
                    <span>Node #{idx + 1}</span>
                  </div>
 
                  {/* Attributes list */}
                  {Object.keys(item.attributes).length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {Object.keys(item.attributes).map((key) => (
                        <span key={key} className="bg-muted px-2 py-0.5 rounded text-[10px] text-muted-foreground border border-card-border/40 truncate max-w-[200px]" title={`${key}="${item.attributes[key]}"`}>
                          <strong className="text-foreground/80">{key}</strong>: "{item.attributes[key]}"
                        </span>
                      ))}
                    </div>
                  )}
 
                  {/* Text Content */}
                  {item.text ? (
                    <div className="bg-black/60 border border-card-border/80 rounded p-3 text-xs leading-relaxed text-foreground/95 pr-10 relative group">
                      <span className="block whitespace-pre-wrap break-all">{item.text}</span>
                      <button
                        onClick={() => handleCopyText(item.text, idx)}
                        className="absolute right-2.5 top-2.5 p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy text content"
                      >
                        {copiedIdx === idx ? <Check className="h-4.5 w-4.5 text-primary animate-fadeIn" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-muted-foreground italic font-light pl-1">No text node content.</div>
                  )}
 
                </Card>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-card-border/50 bg-[#09090b]/10 rounded p-12 text-center space-y-2 font-mono">
              <AlertCircle className="h-8 w-8 text-muted-foreground/35 mx-auto" />
              <h4 className="text-sm font-semibold text-foreground">No matching elements found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto font-light leading-relaxed">
                We fetched the HTML successfully but found 0 elements matching selector rule "{results.selector}". Verify spelling or inspect the site's markup.
              </p>
            </div>
          )}
 
        </div>
      )}
 
    </ToolLayout>
  );
}
