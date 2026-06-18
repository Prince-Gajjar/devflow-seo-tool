"use client";

import React from "react";
import { TOOLS, ToolCategory } from "@/lib/tools-config";
import { ToolCard } from "./ToolCard";

interface RelatedToolsProps {
  currentSlug: string;
  category: ToolCategory;
}

export function RelatedTools({ currentSlug, category }: RelatedToolsProps) {
  // Get other tools in the same category
  let related = TOOLS.filter((t) => t.category === category && t.slug !== currentSlug);

  // If we don't have enough in the same category, fill up with other categories
  if (related.length < 3) {
    const extra = TOOLS.filter((t) => t.category !== category && t.slug !== currentSlug);
    related = [...related, ...extra].slice(0, 3);
  } else {
    related = related.slice(0, 3);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold text-foreground">Related SEO Tools</h3>
        <p className="text-sm text-muted-foreground">Other tools in our suite you might find useful.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
export default RelatedTools;
