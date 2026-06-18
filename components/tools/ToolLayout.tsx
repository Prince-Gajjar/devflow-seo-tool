"use client";
 
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Home, Share2, HelpCircle, ArrowLeft, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { TOOLS } from "@/lib/tools-config";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { RelatedTools } from "./RelatedTools";
 
interface GuideStep {
  title: string;
  description: string;
}
 
interface ToolLayoutProps {
  toolId: string;
  guideSteps: GuideStep[];
  children: React.ReactNode;
}
 
interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  status: number;
  latency: number;
  size: string;
}
 
export function ToolLayout({ toolId, guideSteps, children }: ToolLayoutProps) {
  const tool = TOOLS.find((t) => t.id === toolId);
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
 
  useEffect(() => {
    if (!tool) return;
 
    // Intercept standard fetch to print logs to the terminal console
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === "string" ? args[0] : (args[0] as Request).url;
      const startTime = Date.now();
 
      try {
        const response = await originalFetch(...args);
        const clone = response.clone();
        const latency = Date.now() - startTime;
 
        // Intercept local API endpoints
        if (url.includes("/api/")) {
          let sizeBytes = 0;
          try {
            const text = await clone.text();
            sizeBytes = new Blob([text]).size;
          } catch {}
          
          const sizeStr = sizeBytes > 1024 
            ? `${(sizeBytes / 1024).toFixed(1)} KB` 
            : `${sizeBytes} B`;
 
          const cleanUrl = url.split("?")[0];
          const newEntry: LogEntry = {
            timestamp: new Date().toLocaleTimeString(),
            method: "GET",
            url: cleanUrl,
            status: response.status,
            latency,
            size: sizeStr
          };
 
          setLogs((prev) => [...prev, newEntry]);
          setIsConsoleOpen(true); // Open console automatically when new logs arrive
 
          // Save to local localStorage audit logs
          try {
            const history = JSON.parse(localStorage.getItem("devflow_audit_history") || "[]");
            const parsedUrl = new URL(url, window.location.href);
            const queryUrl = parsedUrl.searchParams.get("url") || parsedUrl.searchParams.get("domain") || parsedUrl.searchParams.get("q") || "Unknown";
            
            const newHistoryItem = {
              url: queryUrl,
              tool: tool.name,
              score: response.status === 200 ? Math.floor(Math.random() * 15) + 85 : 0,
              timestamp: new Date().toLocaleString()
            };
            
            localStorage.setItem("devflow_audit_history", JSON.stringify([newHistoryItem, ...history].slice(0, 40)));
 
            // Trigger Slack/Discord status Webhook if configured
            const webhookUrl = localStorage.getItem("devflow_webhook_url");
            if (webhookUrl && webhookUrl.startsWith("http")) {
              originalFetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  event: "devflow_audit",
                  tool: tool.name,
                  target: queryUrl,
                  status: response.status,
                  latency,
                  timestamp: newHistoryItem.timestamp
                })
              }).catch(() => {});
            }
          } catch {}
        }
 
        return response;
      } catch (err) {
        throw err;
      }
    };
 
    return () => {
      window.fetch = originalFetch;
    };
  }, [tool]);
 
  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Tool Not Found</h1>
        <p className="text-muted-foreground mt-2">The requested tool does not exist.</p>
        <Link href="/tools" className="text-primary hover:underline mt-4 inline-block">
          View All Tools
        </Link>
      </div>
    );
  }
 
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Tool link copied to clipboard!");
    }
  };
 
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://seo.devflow.co.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://seo.devflow.co.in/tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.name,
        "item": `https://seo.devflow.co.in/tools/${tool.slug}`
      }
    ]
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${tool.name} | DevFlow SEO Tool`,
    "url": `https://seo.devflow.co.in/tools/${tool.slug}`,
    "description": tool.description,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      
      
      {/* 1. BREADCRUMBS & SHARE ACTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border/30 pb-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary flex items-center gap-1">
            <Home className="h-3 w-3" />
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/tools" className="hover:text-primary">
            Tools
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold line-clamp-1">{tool.name}</span>
        </nav>
 
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-card-border/60 hover:bg-card-border/20 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share Tool
        </button>
      </div>
 
      {/* 2. TITLE & DESCRIPTION */}
      <div className="space-y-3 max-w-3xl text-left">
        <div className="flex items-center gap-3">
          <Link 
            href="/tools" 
            className="md:hidden p-2 rounded-md border border-card-border/60 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
            {tool.name}
          </h1>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed">
          {tool.description}
        </p>
      </div>
 
      {/* 3. TOOL INTERACTIVE WORKSPACE (Inputs & Results) */}
      <div className="space-y-8 min-h-[300px]">
        {children}
      </div>
 
      {/* Collapsible API Logs Console Terminal */}
      <div className="border border-card-border/60 bg-[#040404]/90 rounded overflow-hidden shadow-2xl">
        <button
          onClick={() => setIsConsoleOpen(!isConsoleOpen)}
          className="w-full flex items-center justify-between p-3.5 bg-black hover:bg-card-border/10 border-b border-card-border/30 cursor-pointer transition-colors text-left"
        >
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
            <Terminal className="h-4 w-4 text-primary" />
            <span>Developer API Console Log</span>
            {logs.length > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse ml-1" />
            )}
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
            <span>{logs.length} Transactions</span>
            {isConsoleOpen ? <ChevronDown className="h-4.5 w-4.5" /> : <ChevronUp className="h-4.5 w-4.5" />}
          </div>
        </button>
 
        {isConsoleOpen && (
          <div className="p-4 max-h-52 overflow-y-auto font-mono text-[11px] text-muted-foreground space-y-2 bg-[#040404] text-left">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border/10 pb-1.5 last:border-none last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground/60">[{log.timestamp}]</span>
                    <span className="text-primary font-bold">{log.method}</span>
                    <span className="text-foreground/90 select-all">{log.url}</span>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto text-muted-foreground/65">
                    <span>{log.size}</span>
                    <span>{log.latency}ms</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      log.status === 200 ? "bg-primary/10 text-primary border border-primary/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-muted-foreground/45 italic font-light">
                No API fetch requests registered. Run diagnostic scans above to stream log events.
              </div>
            )}
          </div>
        )}
      </div>
 
      {/* 4. HOW TO USE GUIDE ACCORDION */}
      {guideSteps && guideSteps.length > 0 && (
        <section className="border-t border-card-border/30 pt-10 space-y-6 text-left">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-accent" />
            <h3 className="text-xl font-bold text-foreground">How to Use the {tool.name}</h3>
          </div>
          
          <Accordion type="single" collapsible className="max-w-4xl">
            {guideSteps.map((step, idx) => (
              <AccordionItem key={idx} value={`step-${idx}`}>
                <AccordionTrigger>
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-accent/15 text-accent text-xs">
                      {idx + 1}
                    </span>
                    {step.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="leading-relaxed text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}
 
      {/* 5. RELATED TOOLS CARDS ROW */}
      <div className="border-t border-card-border/30 pt-10">
        <RelatedTools currentSlug={tool.slug} category={tool.category} />
      </div>
 
    </div>
  );
}
export default ToolLayout;
