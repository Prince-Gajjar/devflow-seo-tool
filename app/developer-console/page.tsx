"use client";
 
import React, { useState, useEffect } from "react";
import { Terminal, Key, ShieldAlert, Check, Copy, Sliders, Play, Plus, Clock, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
 
interface HistoryItem {
  url: string;
  tool: string;
  score: number;
  timestamp: string;
}
 
export default function DeveloperConsole() {
  const [token, setToken] = useState("");
  const [webhook, setWebhook] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
 
  useEffect(() => {
    // Load local storage values
    const storedToken = localStorage.getItem("devflow_api_token") || "";
    const storedWebhook = localStorage.getItem("devflow_webhook_url") || "";
    setToken(storedToken);
    setWebhook(storedWebhook);
 
    try {
      const storedHistory = JSON.parse(localStorage.getItem("devflow_audit_history") || "[]");
      setHistory(storedHistory);
    } catch {
      setHistory([]);
    }
  }, []);
 
  const handleGenerateToken = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let generated = "df_live_";
    for (let i = 0; i < 28; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    localStorage.setItem("devflow_api_token", generated);
    setToken(generated);
    toast.success("New developer API token generated!");
  };
 
  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("devflow_webhook_url", webhook);
    toast.success("Webhook endpoint configuration saved!");
  };
 
  const handleClearHistory = () => {
    localStorage.removeItem("devflow_audit_history");
    setHistory([]);
    toast.success("Audit history cleared!");
  };
 
  const copyToClipboard = (text: string, type: "token" | "cli") => {
    navigator.clipboard.writeText(text);
    if (type === "token") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("API key copied to clipboard!");
    } else {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
      toast.success("CLI command copied!");
    }
  };
 
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 space-y-12 max-w-5xl text-left animate-fadeIn">
      
      {/* Page Heading */}
      <div className="space-y-4 border-b border-card-border/40 pb-8">
        <div className="inline-flex items-center gap-2 rounded border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-primary">
          <Terminal className="h-3 w-3" />
          DevFlow Subsystems
        </div>
        <h1 className="text-3xl font-light tracking-tight text-foreground md:text-4xl">
          Developer Diagnostic Console
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed font-light max-w-2xl">
          Generate API keys to run curls directly against the DevFlow backend crawler routes, configure Discord/Slack status webhooks, and audit local logs.
        </p>
      </div>
 
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: API & Webhooks (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* API Key Panel */}
          <Card className="bg-card/40 border-card-border/60 p-6 rounded space-y-4">
            <div className="flex items-center gap-2 border-b border-card-border/20 pb-3">
              <Key className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-base text-foreground">API Token Management</h3>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Use this key to authorize automation scripts querying meta tags, link configurations, or SEO audit states directly from code.
            </p>
            
            {token ? (
              <div className="flex items-center gap-2 bg-black border border-card-border/80 rounded p-2 text-xs font-mono text-primary pr-3">
                <span className="truncate flex-grow pl-1">{token}</span>
                <button
                  onClick={() => copyToClipboard(token, "token")}
                  className="p-1 hover:text-foreground transition-colors cursor-pointer"
                  title="Copy token"
                >
                  {copied ? <Check className="h-4 w-4 text-foreground animate-fadeIn" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-black/40 border border-card-border/50 border-dashed rounded p-3 text-xs text-muted-foreground italic justify-center">
                No active token generated. Click below to create your live key.
              </div>
            )}
            
            <Button size="sm" variant="outline" className="w-full md:w-auto font-mono" onClick={handleGenerateToken}>
              {token ? "Regenerate Token" : "Generate Free API Key"}
            </Button>
          </Card>
 
          {/* Webhooks Config */}
          <Card className="bg-card/40 border-card-border/60 p-6 rounded space-y-4">
            <div className="flex items-center gap-2 border-b border-card-border/20 pb-3">
              <Sliders className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-base text-foreground">Custom Webhooks</h3>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Provide a Discord, Slack, or custom API payload URL. DevFlow will automatically POST audit logs to this endpoint whenever you execute audits.
            </p>
            
            <form onSubmit={handleSaveWebhook} className="flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-grow space-y-1.5 w-full">
                <label htmlFor="webhook" className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                  Webhook POST Endpoint URL
                </label>
                <Input
                  id="webhook"
                  placeholder="e.g. https://discord.com/api/webhooks/..."
                  value={webhook}
                  onChange={(e) => setWebhook(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
              <Button type="submit" size="sm" className="w-full md:w-auto font-mono">
                Save Target
              </Button>
            </form>
          </Card>
 
        </div>
 
        {/* Right Column: CLI Wrapper Info (1 col) */}
        <div className="space-y-8 h-full">
          
          <Card className="bg-card/40 border-card-border/60 p-6 rounded flex flex-col justify-between h-full space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-card-border/20 pb-3">
                <Play className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-base text-foreground">SEO Companion CLI</h3>
              </div>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Run diagnostics directly from your command line terminal interface. Ideal for checking site layouts during build steps or testing local servers.
              </p>
              
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
                  Installation CLI CMD
                </span>
                <div className="flex items-center justify-between bg-black border border-card-border/80 rounded p-2 text-xs font-mono text-foreground pr-3">
                  <span className="truncate flex-grow pl-1 text-[11px]">npx devflow-seo analyze</span>
                  <button
                    onClick={() => copyToClipboard("npx devflow-seo analyze", "cli")}
                    className="p-1 hover:text-primary transition-colors cursor-pointer text-muted-foreground"
                    title="Copy command"
                  >
                    {copiedCli ? <Check className="h-4 w-4 text-primary animate-fadeIn" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
 
            <div className="pt-4 border-t border-card-border/20 text-[10px] text-muted-foreground/60 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-mono">
                <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                <span>Zero configurations required.</span>
              </div>
            </div>
          </Card>
 
        </div>
 
      </div>
 
      {/* 3. Local Audit Logs Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-card-border/30 pb-2">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-primary" />
            Local Console Audit Logs
          </h3>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" className="h-8 font-mono text-rose-500 hover:text-rose-400 hover:bg-rose-500/5" onClick={handleClearHistory}>
              Purge Records
            </Button>
          )}
        </div>
 
        {history.length > 0 ? (
          <div className="border border-card-border/60 bg-[#09090b]/40 rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-foreground">
                <thead className="bg-card-border/20 border-b border-card-border/30 text-[10px] font-semibold text-muted-foreground uppercase font-mono">
                  <tr>
                    <th className="px-6 py-3.5">Timestamp</th>
                    <th className="px-6 py-3.5">Target Domain / URL</th>
                    <th className="px-6 py-3.5">Diagnostic Tool</th>
                    <th className="px-6 py-3.5 text-right">Audit Health Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border/30 font-mono">
                  {history.map((item, idx) => (
                    <tr key={idx} className="hover:bg-card-border/10 transition-colors">
                      <td className="px-6 py-3 text-muted-foreground font-light">{item.timestamp}</td>
                      <td className="px-6 py-3 font-semibold text-foreground truncate max-w-[280px]">
                        {item.url}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{item.tool}</td>
                      <td className="px-6 py-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.score >= 90 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : item.score >= 70 
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                        }`}>
                          {item.score}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-card-border/50 bg-[#09090b]/10 rounded p-12 text-center space-y-2">
            <Terminal className="h-8 w-8 text-muted-foreground/35 mx-auto" />
            <h4 className="text-sm font-semibold text-foreground">No local audit logs registered</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto font-light leading-relaxed">
              Diagnostic tests run from meta check, domain validator, or sitemaps tools will register records here.
            </p>
          </div>
        )}
      </section>
 
    </div>
  );
}
