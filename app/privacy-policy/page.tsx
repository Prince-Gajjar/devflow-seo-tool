"use client";

import React from "react";
import { ShieldCheck, Calendar, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl space-y-12">
      
      {/* Header */}
      <div className="space-y-4 border-b border-card-border/30 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <ShieldCheck className="h-9 w-9 text-primary" />
          Privacy Policy
        </h1>
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Last Updated: June 2026
          </span>
          <span className="flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" />
            Compliant
          </span>
        </div>
      </div>

      {/* Main content body */}
      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Introduction</h2>
          <p>
            Welcome to <strong>DevFlow SEO Tool</strong> ("we", "our", "us"). We respect your privacy and are committed to protecting any information analyzed through our web application. Since we do not require user accounts or registrations, our data collection is extremely minimal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">2. Data We Do NOT Collect</h2>
          <p>
            When using the keyword research tool, density checker, link analyzer, index checker, or search SERP checkers:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>We do NOT store your search keywords or URL inputs on any backend database.</li>
            <li>We do NOT save copied paste text analyzed in our density checker.</li>
            <li>All analysis runs dynamically on client-side JS memory and is dismissed when closing the browser window.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">3. Information We Collect Automatically</h2>
          <p>
            Like most websites, we may collect non-identifying information that web browsers and servers make available, such as:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Browser type, language preferences, and referring website links.</li>
            <li>Approximate location data (for country dropdown targeting preferences).</li>
            <li>Performance logs to ensure fast page load speeds.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">4. Cookies Policy</h2>
          <p>
            We use a single cookie/localStorage token to store your theme configuration (dark vs light mode toggle preference) so that your layout preferences persist between page navigations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">5. Third-Party Links & API Simulators</h2>
          <p>
            Our web application contains links pointing to external third-party sites (e.g. GitHub repositories or Moz databases). We are not responsible for the privacy practices of those external parties. We also simulate crawl audits using seed-based hash generators which do not submit queries to actual live Google/Bing networks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">6. Contact Information</h2>
          <p>
            If you have questions about this Privacy Policy, please contact our parent company:
          </p>
          <Card className="bg-card/40 border-card-border/60 mt-3">
            <CardContent className="p-6 space-y-1 text-xs">
              <p className="font-bold text-sm text-foreground">DevFlow Technology</p>
              <p>Ahmedabad, Gujarat, India</p>
              <p>Email: <a href="mailto:devflowtechnology@gmail.com" className="text-primary hover:underline">devflowtechnology@gmail.com</a></p>
            </CardContent>
          </Card>
        </section>

      </div>

    </div>
  );
}
