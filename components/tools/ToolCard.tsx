"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolMetadata, getToolIcon } from "@/lib/tools-config";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: ToolMetadata;
}

export function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = getToolIcon(tool.iconName);

  // Map category slugs to readable badges
  const categoryNames: Record<string, { label: string }> = {
    content: { label: "Content & Research" },
    technical: { label: "Technical SEO" },
    links: { label: "Link Analysis" },
    serp: { label: "SERP & Rankings" }
  };

  const badge = categoryNames[tool.category] || { label: tool.category };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative block rounded border border-card-border/50 bg-[#09090b] p-5 transition-colors duration-200 hover:border-primary/40 cursor-pointer overflow-hidden text-left"
    >
      <div className="flex flex-col h-full justify-between gap-6">
        <div className="space-y-4">
          {/* Top Line: Icon & Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="p-2 rounded bg-card-border/30 text-muted-foreground group-hover:text-primary transition-colors">
              <IconComponent className="h-4.5 w-4.5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {badge.label}
            </span>
          </div>

          {/* Tool Details */}
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light">
              {tool.description}
            </p>
          </div>
        </div>

        {/* Action Button Link */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-primary">
          <span>Run diagnostics</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
export default ToolCard;
