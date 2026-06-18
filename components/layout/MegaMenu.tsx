"use client";

import Link from "next/link";
import { TOOLS, CATEGORIES, getToolIcon } from "@/lib/tools-config";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  onClose?: () => void;
  className?: string;
}

export function MegaMenu({ onClose, className }: MegaMenuProps) {
  return (
    <div
      className={cn(
        "glass-panel border border-card-border rounded p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl text-left shadow-none",
        className
      )}
    >
      {CATEGORIES.map((cat) => {
        const catTools = TOOLS.filter((tool) => tool.category === cat.key);

        return (
          <div key={cat.key} className="space-y-3">
            <h4 className="text-sm font-semibold text-accent tracking-wider uppercase border-b border-card-border/50 pb-2">
              {cat.name}
            </h4>
            <ul className="space-y-2">
              {catTools.map((tool) => {
                const IconComponent = getToolIcon(tool.iconName);
                
                return (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="group flex items-start gap-3 p-2 rounded hover:bg-card-border/30 transition-colors"
                      onClick={onClose}
                    >
                      <div className="p-1.5 rounded bg-card-border/40 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {tool.name}
                        </span>
                        <span className="block text-xs text-muted-foreground line-clamp-1 group-hover:text-muted-foreground/80">
                          {tool.description}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
export default MegaMenu;
