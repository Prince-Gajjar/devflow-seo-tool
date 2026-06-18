"use client";

import React, { useState } from "react";
import { Search, Globe, Smartphone, ArrowRight, CheckCircle2, AlertCircle, Activity } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { generateSerpData, SerpData, SerpResultItem } from "@/lib/mock-data/serp";
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
    title: "Enter your target query",
    description: "Input the search keyword or query phrase (e.g. 'best seo tools') to fetch ranks for."
  },
  {
    title: "Optional domain highlight",
    description: "Type in your own domain name (e.g. 'devflow.co.in') to locate and highlight its rank position in the search results."
  },
  {
    title: "Audit search layout rankings",
    description: "Analyze how ads, featured snippets, and People Also Ask accordions capture organic click-through rates."
  }
];

export default function GoogleSerpPage() {
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
      toast.success("Google SERP rankings retrieved successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while checking Google SERPs.");
      setSerp(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Find if our highlighted domain ranked
  const highlightedRank = serp && highlightDomain.trim()
    ? serp.organicResults.find(item => {
        const cleanItemUrl = formatUrl(item.url);
        return cleanItemUrl.includes(formatUrl(highlightDomain));
      })
    : null;

  return (
    <ToolLayout toolId="google-serp" guideSteps={guideSteps}>
      
      {/* Input Form */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Keyword input */}
            <div className="space-y-1.5 md:col-span-1.5">
              <label htmlFor="keyword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Search Keyword
              </label>
              <Input
                id="keyword"
                placeholder="e.g. best keyword research tools"
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
                Check Google SERP
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
          
          {/* Highlight notification */}
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
                      ? `Found ranking organically at Position #${highlightedRank.position} on Page 1.`
                      : "Could not locate this domain on Google Page 1 (Top 10 results)."}
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

          {/* SIMULATED GOOGLE SERP PANEL */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold px-2">
              <span>Google.com Search Results Simulated Preview</span>
              <span className="flex items-center gap-1 text-[10px] uppercase text-accent font-bold">
                <Activity className="h-3.5 w-3.5" />
                Pixel-accurate Layout
              </span>
            </div>

            {/* Google Results Container */}
            {/* Styled like Google Dark Mode to blend beautifully with our default dark design */}
            <div className="bg-[#1b1b1b] border border-card-border/60 rounded p-6 md:p-8 font-sans space-y-6 max-w-3xl shadow-none text-left">
              
              {/* Google Header Logo and Search box simulation */}
              <div className="flex items-center gap-4 border-b border-card-border/40 pb-4 mb-2">
                <span className="text-lg font-black tracking-tighter text-white">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>
                <div className="flex-grow max-w-sm flex items-center bg-[#303134] rounded-full px-4 py-1.5 text-xs text-white border border-transparent">
                  <span className="font-semibold line-clamp-1">{serp.keyword}</span>
                </div>
              </div>

              {/* 1. ADS (Google Ads dark mode uses white border and bold text) */}
              {serp.ads.length > 0 && (
                <div className="space-y-4 border-b border-card-border/20 pb-4">
                  {serp.ads.map((ad, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-white text-black font-extrabold px-1 py-0.5 rounded text-[10px] tracking-wider uppercase leading-none">Sponsored</span>
                        <span className="text-gray-400 truncate max-w-xs">{ad.displayUrl}</span>
                      </div>
                      <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-[#8ab4f8] hover:underline text-lg font-semibold leading-tight block">
                        {ad.title}
                      </a>
                      <p className="text-xs text-[#bdc1c6] leading-relaxed max-w-2xl">
                        {ad.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. FEATURED SNIPPET */}
              {serp.featuredSnippet && (
                <div className="border border-card-border bg-[#303134]/30 rounded p-6 space-y-4 shadow-sm">
                  <div className="space-y-3">
                    <p className="text-lg text-[#e8eaed] leading-relaxed">
                      {serp.featuredSnippet.snippet}
                    </p>
                    {serp.featuredSnippet.list && (
                      <ol className="list-decimal list-inside space-y-2 text-sm text-[#bdc1c6] pl-2 leading-relaxed">
                        {serp.featuredSnippet.list.map((step, idx) => (
                          <li key={idx} className="marker:text-primary marker:font-bold">{step}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                  
                  {/* Link wrapper */}
                  <div className="border-t border-card-border/20 pt-4 flex flex-col gap-1 text-xs">
                    <span className="text-gray-400">{serp.featuredSnippet.displayUrl}</span>
                    <a href={serp.featuredSnippet.url} target="_blank" rel="noopener noreferrer" className="text-[#8ab4f8] hover:underline text-lg font-semibold leading-tight block">
                      {serp.featuredSnippet.title}
                    </a>
                  </div>
                </div>
              )}

              {/* 3. ORGANIC RESULTS */}
              <div className="space-y-6">
                {serp.organicResults.map((result) => {
                  const isHighlighted = highlightDomain.trim() && result.url.includes(formatUrl(highlightDomain));
                  
                  return (
                    <div 
                      key={result.position} 
                      className={cn(
                        "space-y-1.5 p-2 rounded transition-colors border border-transparent",
                        isHighlighted ? "border-primary/20 bg-primary/5" : ""
                      )}
                    >
                      <div className="flex items-center justify-between">
                        {/* URL path breadcrumb */}
                        <div className="flex items-center gap-2 text-xs">
                          {/* Circle mock favicon */}
                          <div className="h-4.5 w-4.5 rounded-full bg-card-border/60 flex items-center justify-center text-[8px] font-bold text-white uppercase select-none font-sans shrink-0">
                            {result.url.replace(/^(https?:\/\/)?(www\.)?/, "").substring(0, 1)}
                          </div>
                          <span className="text-gray-400 truncate max-w-xs">{result.displayUrl}</span>
                        </div>
                        {/* Highlighting tag inside Google layout */}
                        {isHighlighted && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                            Your Website (Rank #{result.position})
                          </span>
                        )}
                      </div>
                      
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#8ab4f8] hover:underline text-lg font-semibold leading-tight block"
                      >
                        {result.title}
                      </a>
                      
                      <p className="text-xs text-[#bdc1c6] leading-relaxed max-w-2xl">
                        {result.snippet}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* 4. PEOPLE ALSO ASK ACCORDION */}
              <div className="border-t border-card-border/30 pt-6 space-y-3">
                <h4 className="text-sm font-bold text-white">People also ask</h4>
                
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {serp.peopleAlsoAsk.map((item, idx) => (
                    <AccordionItem key={idx} value={`ask-${idx}`} className="border border-card-border bg-[#303134]/10 rounded overflow-hidden">
                      <AccordionTrigger className="hover:bg-card-border/10 p-3 text-xs font-semibold text-white">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="p-3 text-xs leading-relaxed text-[#bdc1c6] border-t border-card-border/10">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* 5. RELATED SEARCHES */}
              <div className="border-t border-card-border/30 pt-6 space-y-3">
                <h4 className="text-sm font-bold text-white">Related searches</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {serp.relatedSearches.map((query, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2.5 p-3 bg-[#303134]/40 hover:bg-[#303134]/80 rounded cursor-pointer text-xs font-semibold text-white transition-colors"
                      onClick={() => {
                        setKeyword(query);
                        // Trigger search automatically
                        setTimeout(() => document.forms[0]?.dispatchEvent(new Event("submit")), 10);
                      }}
                    >
                      <Search className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>{query}</span>
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
