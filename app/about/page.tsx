"use client";

import React from "react";
import { Sparkles, Shield, Cpu, Zap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 space-y-16 max-w-4xl text-left">
      
      {/* 1. MISSION STATEMENT */}
      <section className="space-y-4 border-b border-card-border/40 pb-10">
        <div className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" />
          Mission Overview
        </div>
        <h1 className="text-3xl font-light tracking-tight text-foreground md:text-4xl">
          About DevFlow SEO Tool
        </h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">
          DevFlow is dedicated to making search diagnostics performant and accessible. We build tools that require zero configuration, zero logins, and zero data tracking. This platform serves developers and marketers who need fast, clean, and reliable SEO reports directly in their browser.
        </p>
      </section>

      {/* 2. CORE VALUES */}
      <section className="space-y-6">
        <h2 className="text-xs font-mono uppercase tracking-wider text-primary font-bold">Core Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="bg-[#09090b] border-card-border/50 p-5 space-y-3 rounded">
            <div className="p-2 bg-card-border/40 text-primary rounded w-fit">
              <Zap className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Zero Friction</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              No subscription gates or account logins. Enter any domain and run analytics instantly.
            </p>
          </Card>

          <Card className="bg-[#09090b] border-card-border/50 p-5 space-y-3 rounded">
            <div className="p-2 bg-card-border/40 text-primary rounded w-fit">
              <Cpu className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Real Scrapers</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              We crawl live webpages and resolve DNS parameters on the server to ensure diagnostic checks represent real states.
            </p>
          </Card>

          <Card className="bg-[#09090b] border-card-border/50 p-5 space-y-3 rounded">
            <div className="p-2 bg-card-border/40 text-primary rounded w-fit">
              <Shield className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Data Privacy</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              No cookies, search logs, or database indexing. Scans are processed on the server without storage footprints.
            </p>
          </Card>

        </div>
      </section>

      {/* 3. BUSINESS INFO CREDITS */}
      <section className="border-t border-card-border/40 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">DevFlow Technology</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              We are a digital product studio based in Ahmedabad, Gujarat, India. Our focus is on building clean, modular web utilities that optimize digital workflows.
            </p>
          </div>
          <div className="border border-card-border/40 bg-[#09090b] rounded p-5 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">Location context</span>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Operating out of Ahmedabad, Gujarat, we support the webmaster community by publishing developer consoles and open-source packages.
            </p>
          </div>
        </div>
      </section>

      {/* 4. TEAM SECTION */}
      <section className="border-t border-card-border/40 pt-10 space-y-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-primary font-bold flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          Contributors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: "Prince Gajjar", role: "Lead Architect" },
            { name: "DevFlow Technology", role: "Development Studio" },
            { name: "Community Contributors", role: "Open Source" }
          ].map((member, i) => (
            <Card key={i} className="bg-[#09090b] border-card-border/50 p-5 rounded space-y-2">
              <div className="space-y-0.5">
                <h5 className="font-semibold text-sm text-foreground">{member.name}</h5>
                <span className="text-xs text-muted-foreground font-light">{member.role}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
