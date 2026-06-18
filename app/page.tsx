"use client";
 
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Search, Cpu, CheckCircle2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS, CATEGORIES, ToolCategory } from "@/lib/tools-config";
import { ToolCard } from "@/components/tools/ToolCard";
import { cn } from "@/lib/utils";
 
export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
 
  const filteredTools = TOOLS.filter((tool) => {
    if (activeCategory === "all") return true;
    return tool.category === activeCategory;
  });
 
  // Dynamic terminal logs animation
  const consoleSteps = [
    {
      domain: "github.com",
      logs: [
        "resolving dns records... [ok]",
        "ssl status check: active (https)",
        "crawling robots.txt & sitemap.xml... [1 sitemap found]",
        "auditing meta tags index parameters... [completed]"
      ],
      score: 95
    },
    {
      domain: "nextjs.org",
      logs: [
        "resolving dns records... [ok]",
        "ssl status check: active (https)",
        "crawling robots.txt & sitemap.xml... [2 sitemaps found]",
        "auditing meta tags index parameters... [completed]"
      ],
      score: 98
    },
    {
      domain: "wikipedia.org",
      logs: [
        "resolving dns records... [ok]",
        "ssl status check: active (https)",
        "crawling robots.txt & sitemap.xml... [no sitemap in robots.txt]",
        "auditing meta tags index parameters... [completed]"
      ],
      score: 87
    },
    {
      domain: "devflow.co.in",
      logs: [
        "resolving dns records... [ok]",
        "ssl status check: active (https)",
        "crawling robots.txt & sitemap.xml... [1 sitemap found]",
        "auditing meta tags index parameters... [completed]"
      ],
      score: 92
    }
  ];
 
  const [stepIndex, setStepIndex] = useState(0);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [logIndex, setLogIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
 
  useEffect(() => {
    let logTimer: NodeJS.Timeout;
    let transitionTimer: NodeJS.Timeout;
 
    const currentStep = consoleSteps[stepIndex];
 
    if (logIndex < currentStep.logs.length) {
      setIsTyping(true);
      logTimer = setTimeout(() => {
        setCurrentLogs((prev) => [...prev, currentStep.logs[logIndex]]);
        setLogIndex((prev) => prev + 1);
        setIsTyping(false);
      }, 700);
    } else {
      transitionTimer = setTimeout(() => {
        setCurrentLogs([]);
        setLogIndex(0);
        setStepIndex((prev) => (prev + 1) % consoleSteps.length);
      }, 3500);
    }
 
    return () => {
      clearTimeout(logTimer);
      clearTimeout(transitionTimer);
    };
  }, [stepIndex, logIndex]);
 
  return (
    <div className="flex flex-col w-full gap-16 pb-20 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-black pt-20 pb-16 md:pt-28 md:pb-24 border-b border-card-border/40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(163,230,53,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(163,230,53,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        <div className="container mx-auto px-4 md:px-6 relative flex flex-col lg:flex-row items-center gap-16">
          {/* Left Text Column */}
          <div className="flex-1 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Developer SEO Toolkit
            </div>
            
            <h1 className="text-4xl font-light tracking-tight sm:text-5xl md:text-6xl text-foreground leading-[1.05]">
              DevFlow <span className="font-extrabold text-primary">SEO</span>
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed font-light">
              A minimalist, high-performance toolkit for search engine diagnostics. Analyze keyword structures, index crawlability, and referring link profiles in real-time.
            </p>
 
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/tools">
                <Button size="md" className="gap-2 cursor-pointer rounded font-mono text-xs uppercase tracking-wider">
                  Launch Console
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="md" variant="outline" className="cursor-pointer rounded font-mono text-xs uppercase tracking-wider">
                  Documentation
                </Button>
              </Link>
            </div>
          </div>
 
          {/* Right Interface Console Mock */}
          <div className="flex-1 w-full max-w-md lg:max-w-none flex items-center justify-center">
            <div className="relative w-full aspect-video rounded border border-card-border bg-[#09090b]/80 p-5 shadow-2xl overflow-hidden font-mono text-xs text-muted-foreground scanlines">
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-card-border/40 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-destructive/80" />
                  <div className="h-2 w-2 rounded-full bg-warning/80" />
                  <div className="h-2 w-2 rounded-full bg-primary/80" />
                </div>
                <div className="text-[10px] text-muted-foreground/60 select-none flex items-center gap-1.5">
                  <Terminal className="h-3 w-3 text-primary" />
                  Console://diagnostics
                </div>
                <div className="w-6" />
              </div>
 
              {/* Console Body */}
              <div className="space-y-3 font-mono">
                <div className="flex items-center gap-2 text-foreground">
                  <span className="text-primary font-bold">$</span>
                  <span>devflow --analyze https://{consoleSteps[stepIndex].domain}</span>
                  {logIndex === 0 && <span className="w-1.5 h-3.5 bg-primary animate-pulse" />}
                </div>
                
                <div className="text-[10px] text-muted-foreground/80 space-y-1.5 min-h-[75px]">
                  {currentLogs.map((log, i) => (
                    <div key={i} className={cn(
                      "transition-all duration-300",
                      i === currentLogs.length - 1 && "text-primary font-medium"
                    )}>
                      &gt; {log}
                    </div>
                  ))}
                  {!isTyping && logIndex < consoleSteps[stepIndex].logs.length && (
                    <div className="flex items-center gap-1">
                      <span>&gt;</span>
                      <span className="w-1 h-3 bg-muted-foreground/45 animate-pulse" />
                    </div>
                  )}
                </div>
 
                {/* Score bar */}
                <div className={cn(
                  "border border-card-border/60 rounded p-2.5 bg-card/40 flex items-center justify-between mt-2 transition-all duration-500",
                  logIndex === consoleSteps[stepIndex].logs.length ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
                )}>
                  <div className="space-y-0.5 text-left">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-foreground">SEO Health Index</div>
                    <div className="text-[10px] text-muted-foreground/60">Diagnostics check completed</div>
                  </div>
                  <div className="text-lg font-black text-primary">
                    {consoleSteps[stepIndex].score}/100
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* 2. STATS BAR */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded border border-card-border bg-[#09090b]">
          {[
            { label: "15+ Console Apps", desc: "Zero subscriptions or configurations" },
            { label: "Real-time Audits", desc: "Live backend queries & scrapers" },
            { label: "Open-source", desc: "No cookies or data trackers" },
            { label: "Developer Ready", desc: "Fast JSON responses" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col p-4 border-r last:border-r-0 border-card-border/40 last:border-none text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                {stat.label}
              </span>
              <span className="text-xs text-muted-foreground mt-1.5 font-light">{stat.desc}</span>
            </div>
          ))}
        </div>
      </section>
 
      {/* 3. TOOLS GRID SECTION */}
      <section id="tools" className="container mx-auto px-4 md:px-6 space-y-8">
        <div className="text-left space-y-2 border-l-2 border-primary pl-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            SEO Console Suites
          </h2>
          <p className="text-xs text-muted-foreground font-light max-w-xl">
            Select a modular tool from our diagnostic categories below to inspect indexing, meta structures, or page performance.
          </p>
        </div>
 
        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-start gap-2 border-b border-card-border/40 pb-4">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3.5 py-1.5 rounded text-xs font-mono tracking-wider uppercase transition-all cursor-pointer border",
              activeCategory === "all"
                ? "bg-primary text-primary-foreground border-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-card-border/10"
            )}
          >
            All Tools
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "px-3.5 py-1.5 rounded text-xs font-mono tracking-wider uppercase transition-all cursor-pointer border",
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-card-border/10"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
 
        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
 
      {/* 4. WORKFLOW SECTION */}
      <section className="border-t border-card-border/40 py-16 bg-[#040404]">
        <div className="container mx-auto px-4 md:px-6 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">System Workflow</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto font-light">
              Get comprehensive search index audits and crawls in three operations.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Initialize Query",
                desc: "Provide target URLs, keyword strings, or domain values into the modular input console.",
                icon: Search
              },
              {
                step: "02",
                title: "Server Crawl & Parse",
                desc: "DevFlow crawlers scrape page headers, canonicals, robots limits, and resolve active DNS latency.",
                icon: Cpu
              },
              {
                step: "03",
                title: "Analyze Logs",
                desc: "Review diagnostic checklists, copy calculated parameters, or export reports directly as CSV files.",
                icon: CheckCircle2
              }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative flex flex-col items-start text-left p-6 border border-card-border/40 bg-card rounded hover:border-primary/35 transition-all duration-300 space-y-3">
                  <span className="text-xs font-mono text-primary font-bold tracking-widest uppercase">
                    Step {step.step}
                  </span>
                  <div className="p-2 rounded bg-card-border/30 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{step.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FAQ / Q&A SECTION FOR AEO & GEO OPTIMIZATION */}
      <section className="border-t border-card-border/40 py-20 bg-black">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-12">
          <div className="text-left space-y-2 border-l-2 border-primary pl-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted-foreground font-light max-w-xl">
              Understand how the DevFlow engine, AEO integrations, and CLI diagnostics work under the hood.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "What is DevFlow SEO Tool?",
                a: "DevFlow SEO Tool is an open, high-performance, developer-first search engine diagnostics suite. It contains 18 modular tools (including redirect chain tracers, DNS record inspectors, and HTML scrapers) to audit indexing parameters, meta tags, and referring link profiles instantly."
              },
              {
                q: "How is DevFlow different from Semrush or Ahrefs?",
                a: "Unlike commercial platforms, DevFlow has zero subscription gates, requires no account logins, and operates 100% in-memory without cookies or search history databases. In addition to the UI, it provides a standalone NPM Command Line Interface (CLI) to trigger diagnostic checks directly from local terminals or automated CI/CD pipelines."
              },
              {
                q: "Does DevFlow store domain audit search histories?",
                a: "No. All audits are executed in-memory. DevFlow does not maintain databases of queried URLs or scraped metadata. Optional session tracking is processed strictly inside the user's browser `localStorage` and never leaves their machine."
              },
              {
                q: "How do I run the DevFlow CLI on my local system?",
                a: "You can run diagnostics directly from your command line using `npx devflow-seo-tool analyze <domain-name>` or verify DNS records using `npx devflow-seo-tool dns <domain-name>`. The CLI includes automatic host sensing to fall back between local development servers and the live API workspace."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="p-6 border border-card-border/40 bg-[#09090b] rounded hover:border-primary/20 transition-all duration-300 space-y-2 text-left"
              >
                <h3 className="text-sm font-semibold font-mono text-primary flex items-start gap-2">
                  <span className="text-primary/50">Q:</span> {faq.q}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
