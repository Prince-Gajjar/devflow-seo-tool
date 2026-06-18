"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Send, Wrench } from "lucide-react";
import toast from "react-hot-toast";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    toast.success("Subscribed to updates successfully.");
    setEmail("");
  };

  return (
    <footer className="border-t border-card-border/40 bg-black text-foreground font-sans">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-card-border/30 pb-10">
          
          {/* Column 1: Info */}
          <div className="space-y-3 col-span-1 text-left">
            <Link href="/" className="flex items-center gap-2 font-mono text-sm tracking-widest uppercase font-bold text-foreground">
              <Wrench className="h-4.5 w-4.5 text-primary" />
              <span>DevFlow SEO</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              High-performance diagnostic utility console. Built for developer-oriented website audits.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">Console map</h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">Console Directory</Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Context Info */}
          <div className="space-y-3 text-left">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">Credits</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              DevFlow Technology.<br />
              Ahmedabad, Gujarat, India.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-light text-muted-foreground">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <a href="mailto:devflowtechnology@gmail.com" className="hover:text-foreground transition-colors">
                devflowtechnology@gmail.com
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3 text-left">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">Subsystem Logs</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Subscribe to recieve technical reports, checklists, and console releases.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#09090b] border border-card-border/60 focus:outline-none focus:ring-1 focus:ring-primary rounded px-3 py-2 text-xs text-foreground pr-8 font-light"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 p-1.5 text-primary hover:text-foreground rounded transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-muted-foreground/60">
          <p>© {new Date().getFullYear()} DevFlow SEO. All rights reserved.</p>
          <p className="mt-2 md:mt-0 uppercase tracking-widest">
            Prerendered via Next.js & Tailwind CSS v4.0
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
