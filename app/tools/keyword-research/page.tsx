"use client";

import React, { useState } from "react";
import { Search, Globe, Languages, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ResultsTable, ColumnConfig } from "@/components/tools/ResultsTable";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { KeywordSuggestion } from "@/lib/mock-data/keywords";
import { formatNumber } from "@/lib/utils";

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
    title: "Enter a seed keyword",
    description: "Type in a broad topic or product term related to your niche (e.g. 'coding tutorials' or 'coffee maker'). Avoid punctuation for best results."
  },
  {
    title: "Select targeting preferences",
    description: "Choose your target country and language from the dropdown menus to load relevant search volume and CPC valuations for that demographic."
  },
  {
    title: "Review and analyze suggestions",
    description: "Review suggestions, CPC metrics, and 7-day trend sparklines. You can search within the output suggestions table or export them to a CSV spreadsheet."
  }
];

export default function KeywordResearchPage() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("IN");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<KeywordSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast.error("Please enter a seed keyword to analyze.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(keyword)}&gl=${country}&hl=${language}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to load keywords");
      }
      
      setResults(data.suggestions || []);
      toast.success("Keyword suggestions retrieved successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while fetching suggestions.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRow = (kw: string, index: number) => {
    navigator.clipboard.writeText(kw);
    setCopiedIndex(index);
    toast.success(`Copied "${kw}"!`);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Define table column structure
  const columns: ColumnConfig<KeywordSuggestion>[] = [
    {
      key: "keyword",
      label: "Suggested Keyword",
      sortable: true,
      render: (val, row) => (
        <span className="text-foreground font-semibold">{val}</span>
      )
    },
    {
      key: "volume",
      label: "Monthly Volume",
      sortable: true,
      render: (val) => (
        <span className="text-primary font-bold">{formatNumber(val)}</span>
      )
    },
    {
      key: "cpc",
      label: "CPC ($)",
      sortable: true,
      render: (val) => (
        <span className="text-primary font-bold">${val.toFixed(2)}</span>
      )
    },
    {
      key: "competition",
      label: "Competition",
      sortable: true,
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-bold ${
            val === "Low"
              ? "bg-primary/10 text-primary"
              : val === "Medium"
              ? "bg-amber-500/10 text-amber-500"
              : "bg-rose-500/10 text-rose-500"
          }`}
        >
          {val}
        </span>
      )
    },
    {
      key: "trend",
      label: "7-Day Trend",
      render: (val) => (
        <div className="py-1">
          <SparklineChart data={val} width={90} height={20} />
        </div>
      )
    },
    {
      key: "actions",
      label: "Action",
      render: (_, row) => {
        const index = results.findIndex((item) => item.keyword === row.keyword);
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={() => handleCopyRow(row.keyword, index)}
          >
            {copiedIndex === index ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        );
      }
    }
  ];

  // Calculate summary metrics based on the search
  const totalVolume = results.reduce((acc, curr) => acc + curr.volume, 0);
  const avgCpc = results.length > 0 
    ? results.reduce((acc, curr) => acc + curr.cpc, 0) / results.length 
    : 0;

  return (
    <ToolLayout toolId="keyword-research" guideSteps={guideSteps}>
      
      {/* Search form */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Seed keyword */}
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="seed" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Enter Seed Keyword
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="seed"
                  placeholder="e.g. digital marketing, web hosting"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-primary" />
                Country
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
              <label htmlFor="lang" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
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

            {/* Search Submit */}
            <div className="md:col-span-4 mt-2">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Research Keywords
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {isLoading && <LoadingSkeleton type="table" />}

      {/* Results Section */}
      {!isLoading && hasSearched && results.length > 0 && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Summary Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Target Seed</span>
                <h3 className="text-xl font-bold text-foreground line-clamp-1">{keyword}</h3>
              </CardContent>
            </Card>
            
            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Est. Total Monthly Volume</span>
                <h3 className="text-2xl font-black text-primary">{formatNumber(totalVolume)}</h3>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-card-border/60">
              <CardContent className="p-6 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-muted-foreground">Average CPC</span>
                <h3 className="text-2xl font-black text-primary">${avgCpc.toFixed(2)}</h3>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Suggestion Table */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Keyword Suggestions</h3>
            <ResultsTable
              columns={columns}
              data={results}
              csvFilename={`keyword_research_${keyword.toLowerCase().replace(/\s+/g, "_")}.csv`}
              searchKey="keyword"
              searchPlaceholder="Filter suggestions..."
              pageSize={15}
            />
          </div>

        </div>
      )}

    </ToolLayout>
  );
}
