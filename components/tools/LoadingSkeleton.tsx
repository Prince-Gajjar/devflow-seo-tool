"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  type?: "table" | "cards" | "stats" | "serp" | "generic";
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({ type = "generic", rows = 5, className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-6 w-full animate-pulse", className)}>
      
      {/* 1. TABLE SKELETON */}
      {type === "table" && (
        <div className="border border-card-border/60 bg-card rounded-xl overflow-hidden">
          {/* Header Row */}
          <div className="bg-card-border/20 px-6 py-4 flex gap-4 border-b border-card-border/40">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-muted-foreground/30 rounded w-1/4" />
            ))}
          </div>
          {/* Rows */}
          <div className="divide-y divide-card-border/30 px-6">
            {Array.from({ length: rows }).map((_, r) => (
              <div key={r} className="py-4 flex gap-4">
                <div className="h-4 bg-muted-foreground/20 rounded w-1/3" />
                <div className="h-4 bg-muted-foreground/20 rounded w-1/6" />
                <div className="h-4 bg-muted-foreground/20 rounded w-1/6" />
                <div className="h-4 bg-muted-foreground/20 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CARDS GRID SKELETON */}
      {type === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-card-border/60 bg-card rounded-xl p-6 space-y-4">
              <div className="h-6 bg-muted-foreground/30 rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-full" />
                <div className="h-4 bg-muted-foreground/20 rounded w-5/6" />
                <div className="h-4 bg-muted-foreground/20 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. STATS SUMMARY SKELETON */}
      {type === "stats" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-card-border/60 bg-card rounded-xl p-6 flex flex-col items-center justify-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-muted-foreground/20" />
              <div className="h-6 bg-muted-foreground/35 rounded w-16" />
              <div className="h-3 bg-muted-foreground/20 rounded w-20" />
            </div>
          ))}
        </div>
      )}

      {/* 4. GOOGLE SERP SKELETON */}
      {type === "serp" && (
        <div className="space-y-6 max-w-2xl">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-muted-foreground/20" />
                <div className="h-3 bg-muted-foreground/20 rounded w-24" />
              </div>
              <div className="h-5 bg-muted-foreground/35 rounded w-3/4" />
              <div className="space-y-1.5">
                <div className="h-3.5 bg-muted-foreground/20 rounded w-full" />
                <div className="h-3.5 bg-muted-foreground/20 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. GENERIC SKELETON */}
      {type === "generic" && (
        <div className="border border-card-border/60 bg-card rounded-xl p-6 space-y-6">
          <div className="h-6 bg-muted-foreground/35 rounded w-1/3" />
          <div className="space-y-3">
            <div className="h-4 bg-muted-foreground/20 rounded w-full" />
            <div className="h-4 bg-muted-foreground/20 rounded w-11/12" />
            <div className="h-4 bg-muted-foreground/20 rounded w-10/12" />
          </div>
          <div className="flex gap-4">
            <div className="h-10 bg-muted-foreground/30 rounded w-32" />
            <div className="h-10 bg-muted-foreground/20 rounded w-28" />
          </div>
        </div>
      )}

    </div>
  );
}
export default LoadingSkeleton;
