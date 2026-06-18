"use client";

import React, { useState } from "react";
import { Search, Compass, Smartphone, CheckCircle2, AlertCircle, Activity } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { generateSerpData, SerpData } from "@/lib/mock-data/serp";
import { cn, formatUrl } from "@/lib/utils";

const countries = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" }
];

const devices = [
  { code: "desktop", name: "Desktop Computer" },
  { code: "mobile", name: "Mobile Smartphone" }
];

const guideSteps = [
  {
    title: "Enter search keyword",
    description: "Provide the keyword query you want to verify on Bing Search (e.g. 'coding agency')."
  },
  {
    title: "Highlight target domain",
    description: "Specify your own domain name (e.g. 'devflow.co.in') to track its search ranking position on Page 1."
  },
  {
    title: "Inspect Bing search results",
    description: "Compare rankings against Bing SERP layout standards, check People Also Ask, and review search terms."
  }
];

export default function BingSerpPage() {
  const [keyword, setKeyword] = useState("");
  const [highlightDomain, setHighlightDomain] = useState("");
  const [country, setCountry] = useState("IN");
  const [device, setDevice] = useState("desktop");

  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [serp, setSerp] = useState<SerpData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyword.trim()) {
      toast.error("Please enter a target keyword.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/serp?q=${encodeURIComponent(keyword)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch SERP rankings");
      }

      setSerp(data);
      toast.success("Bing SERP rankings retrieved successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while checking Bing SERPs.");
      setSerp(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if our highlighted domain ranked
  const highlightedRank = serp && highlightDomain.trim()
    ? serp.organicResults.find(item => {
        const cleanItemUrl = formatUrl(item.url);
        return cleanItemUrl.includes(formatUrl(highlightDomain));
      })
    : null;

  return (
    <ToolLayout toolId="bing-serp" guideSteps={guideSteps}>
      
      {/* Input */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Keyword */}
            <div className="space-y-1.5 md:col-span-1.5">
              <label htmlFor="keyword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Search Keyword
              </label>
              <Input
                id="keyword"
                placeholder="e.g. cloud hosting reviews"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* Highlight Domain */}
            <div className="space-y-1.5 md:col-span-1.5">
              <label htmlFor="domain" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Highlight Domain (Optional)
              </label>
              <Input
                id="domain"
                placeholder="e.g. devflow.co.in"
                value={highlightDomain}
                onChange={(e) => setHighlightDomain(e.target.value)}
              />
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-primary" />
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

            {/* Device */}
            <div className="space-y-1.5">
              <label htmlFor="device" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Smartphone className="h-3.5 w-3.5 text-primary" />
                Device
              </label>
              <Select id="device" value={device} onChange={(e) => setDevice(e.target.value)}>
                {devices.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Submit */}
            <div className="md:col-span-4 mt-2">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Check Bing SERP
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && <LoadingSkeleton type="serp" />}

      {/* Results Workspace */}
      {!isLoading && hasSearched && serp && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Highlight Notification */}
          {highlightDomain.trim() && (
            <div className={cn(
              "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded",
              highlightedRank 
                ? "bg-primary/10 border-primary/20 text-primary" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-500"
            )}>
              <div className="flex items-center gap-2.5">
                {highlightedRank ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 shrink-0" />
                )}
                <div>
                  <h5 className="text-sm font-bold text-foreground">
                    Domain Highlight Audit: <strong className="font-extrabold">"{formatUrl(highlightDomain)}"</strong>
                  </h5>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {highlightedRank 
                      ? `Found ranking organically at Position #${highlightedRank.position} on Bing Page 1.`
                      : "Could not locate this domain on Bing Page 1 (Top 10 results)."}
                  </p>
                </div>
              </div>
              
              {highlightedRank && (
                <span className="px-3 py-1 rounded bg-primary text-primary-foreground font-black text-xs uppercase">
                  Rank #{highlightedRank.position}
                </span>
              )}
            </div>
          )}

          {/* SIMULATED BING SERP PANEL */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold px-2">
              <span>Bing.com Search Results Simulated Preview</span>
              <span className="flex items-center gap-1 text-[10px] uppercase text-accent font-bold">
                <Activity className="h-3.5 w-3.5" />
                Bing UI Style
              </span>
            </div>

            {/* Microsoft Bing Results container (Explicitly white background as requested) */}
            <div className="bg-white border border-[#e0e0e0] rounded p-6 md:p-8 font-sans space-y-6 max-w-3xl shadow-none text-left text-black">
              
              {/* Bing Logo Header bar */}
              <div className="flex flex-col gap-3 border-b border-[#e0e0e0] pb-4 mb-2">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold tracking-tight text-[#008272] flex items-center gap-1 select-none">
                    <span className="font-black">b</span>ing
                  </span>
                  <div className="flex-grow max-w-sm flex items-center bg-[#f5f5f5] rounded-lg px-4 py-1.5 text-xs text-black border border-[#e0e0e0]">
                    <span className="font-semibold line-clamp-1">{serp.keyword}</span>
                  </div>
                </div>
                {/* Bing Tabs Row: Web, Images, Videos */}
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 pl-1">
                  <span className="text-black border-b-2 border-[#008272] pb-1 cursor-pointer">All</span>
                  <span className="hover:text-[#008272] cursor-pointer">Images</span>
                  <span className="hover:text-[#008272] cursor-pointer">Videos</span>
                  <span className="hover:text-[#008272] cursor-pointer">Maps</span>
                  <span className="hover:text-[#008272] cursor-pointer">News</span>
                </div>
              </div>

              {/* 1. Bing Sponsored Ads */}
              {serp.ads.length > 0 && (
                <div className="space-y-4 border-b border-[#f3f3f3] pb-4">
                  {serp.ads.map((ad, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-gray-100 text-gray-700 border border-gray-300 font-extrabold px-1 py-0.2 rounded text-[9px] uppercase leading-none">Ad</span>
                        <span className="text-emerald-700 truncate max-w-xs">{ad.displayUrl}</span>
                      </div>
                      <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-[#008272] hover:underline text-lg font-medium leading-tight block">
                        {ad.title}
                      </a>
                      <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                        {ad.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. Bing Featured Snippet */}
              {serp.featuredSnippet && (
                <div className="border border-[#e0e0e0] bg-[#fafafa] rounded p-5 space-y-4 shadow-sm">
                  <div className="space-y-2">
                    <p className="text-base text-gray-800 leading-relaxed">
                      {serp.featuredSnippet.snippet}
                    </p>
                    {serp.featuredSnippet.list && (
                      <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-600 pl-1 leading-relaxed">
                        {serp.featuredSnippet.list.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="border-t border-[#e0e0e0] pt-3 flex flex-col gap-0.5 text-xs">
                    <span className="text-emerald-700">{serp.featuredSnippet.displayUrl}</span>
                    <a href={serp.featuredSnippet.url} target="_blank" rel="noopener noreferrer" className="text-[#008272] hover:underline text-base font-semibold leading-tight block">
                      {serp.featuredSnippet.title}
                    </a>
                  </div>
                </div>
              )}

              {/* 3. Bing Organic Results */}
              <div className="space-y-5">
                {serp.organicResults.map((result) => {
                  const isHighlighted = highlightDomain.trim() && result.url.includes(formatUrl(highlightDomain));
                  
                  return (
                    <div 
                      key={result.position} 
                      className={cn(
                        "space-y-1 p-2 rounded transition-colors",
                        isHighlighted ? "bg-lime-50 border border-lime-200" : ""
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-700 text-xs truncate max-w-md block">{result.displayUrl}</span>
                        {isHighlighted && (
                          <span className="text-[9px] font-black uppercase text-lime-700 px-1.5 py-0.5 rounded bg-lime-100 border border-lime-300">
                            Bing Position #{result.position}
                          </span>
                        )}
                      </div>
                      
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#008272] hover:underline text-lg font-medium leading-tight block"
                      >
                        {result.title}
                      </a>
                      
                      <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                        {result.snippet}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* 4. Bing Related Searches */}
              <div className="border-t border-[#e0e0e0] pt-6 space-y-3">
                <h4 className="text-sm font-bold text-gray-800">Related searches</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {serp.relatedSearches.map((query, idx) => (
                    <div 
                      key={idx} 
                      className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded text-center cursor-pointer text-gray-700 font-semibold truncate transition-colors"
                      onClick={() => {
                        setKeyword(query);
                        setTimeout(() => document.forms[0]?.dispatchEvent(new Event("submit")), 10);
                      }}
                    >
                      {query}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </ToolLayout>
  );
}
