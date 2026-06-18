"use client";

import React, { useState, useMemo } from "react";
import { Search, Sparkles, Filter } from "lucide-react";
import { TOOLS, CATEGORIES, ToolCategory } from "@/lib/tools-config";
import { ToolCard } from "@/components/tools/ToolCard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ToolsListingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">("all");

  // Real-time search and category filtering
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 space-y-12">
      
      {/* Page Heading */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3 w-3 text-accent" />
          No Subscriptions Required
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          SEO Tools Directory
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Access all 18 professional search engine diagnostics tools. Search, filter, and choose a tool to start analyzing your website authority, keywords, or sitemaps.
        </p>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col lg:flex-row items-center gap-6 border-b border-card-border/30 pb-8">
        
        {/* Real-time Search Input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-input border border-card-border focus:outline-none focus:ring-1 focus:ring-primary rounded px-4 py-3 text-sm text-foreground pl-10 transition-colors"
          />
        </div>

        {/* Category Pills Switcher */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:ml-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">
            <Filter className="h-3.5 w-3.5" />
            Filter:
          </div>
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3.5 py-1.5 rounded text-xs font-bold transition-all cursor-pointer border border-card-border/60",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground hover:bg-card-border/20 hover:text-foreground"
            )}
          >
            All Tools
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={cn(
                "px-3.5 py-1.5 rounded text-xs font-bold transition-all cursor-pointer border border-card-border/60",
                selectedCategory === cat.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground hover:bg-card-border/20 hover:text-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Tools Grid List */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-card-border bg-card/10 rounded p-16 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded bg-muted/40 text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No SEO tools found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            We couldn't find any tools matching "{searchQuery}". Try adjusting your keywords or clearing the filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-sm text-primary hover:underline font-semibold cursor-pointer"
          >
            Clear Filters & Search
          </button>
        </div>
      )}

    </div>
  );
}
