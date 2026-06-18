"use client";
 
import React, { useState } from "react";
import { Link2, Globe, Server, FileText, Calendar, ShieldCheck, Activity } from "lucide-react";
import toast from "react-hot-toast";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LoadingSkeleton } from "@/components/tools/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
 
const guideSteps = [
  {
    title: "Enter domain name",
    description: "Provide the domain you want to audit (e.g. 'github.com' or 'google.com'). Subdomains are also supported."
  },
  {
    title: "Query registrar registry",
    description: "Click 'Inspect Domain' to fetch WHOIS records from RDAP servers and perform server-side DNS queries."
  },
  {
    title: "Analyze record mappings",
    description: "Check tab configurations for A mapping routes, MX mail routings, TXT records (SPF/DKIM), and authoritative nameservers."
  }
];
 
interface RecordData {
  domain: string;
  dns: {
    A: string[];
    MX: { exchange: string; priority: number }[];
    TXT: string[];
    NS: string[];
  };
  whois: {
    registrar: string;
    created: string;
    expires: string;
  };
}
 
export default function WhoisInspectorPage() {
  const [domain, setDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [data, setData] = useState<RecordData | null>(null);
 
  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!domain.trim()) {
      toast.error("Please enter a domain name.");
      return;
    }
 
    setIsLoading(true);
    setHasSearched(true);
    setData(null);
 
    try {
      const res = await fetch(`/api/whois-dns?domain=${encodeURIComponent(domain)}`);
      const apiData = await res.json();
 
      if (!res.ok) {
        throw new Error(apiData.error || "Failed to inspect domain");
      }
 
      setData(apiData);
      toast.success("Domain WHOIS and DNS records retrieved!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred while inspecting domain.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <ToolLayout toolId="whois-inspector" guideSteps={guideSteps}>
      
      {/* Input */}
      <Card className="border-card-border/60 bg-card/40 shadow-md">
        <CardContent className="p-6 text-left">
          <form onSubmit={handleInspect} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow space-y-1.5 w-full">
              <label htmlFor="domain" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Enter Domain / Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="domain"
                  placeholder="e.g. github.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="pl-9 font-mono text-sm"
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto font-mono" isLoading={isLoading}>
              Inspect Domain
            </Button>
          </form>
        </CardContent>
      </Card>
 
      {/* Loading */}
      {isLoading && <LoadingSkeleton type="stats" />}
 
      {/* Results Workspace */}
      {!isLoading && hasSearched && data && (
        <div className="space-y-8 animate-fadeIn text-left">
          
          {/* WHOIS Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="bg-[#09090b]/40 border-card-border/60 p-6 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">Registrar Organization</span>
                <h3 className="text-xl font-bold text-foreground truncate" title={data.whois.registrar}>
                  {data.whois.registrar}
                </h3>
              </div>
              <Server className="h-6 w-6 text-muted-foreground/35" />
            </Card>
 
            <Card className="bg-[#09090b]/40 border-card-border/60 p-6 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">Registration Date</span>
                <h3 className="text-xl font-bold text-foreground">{data.whois.created}</h3>
              </div>
              <Calendar className="h-6 w-6 text-muted-foreground/35" />
            </Card>
 
            <Card className="bg-[#09090b]/40 border-card-border/60 p-6 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">Expiration Date</span>
                <h3 className="text-xl font-bold text-foreground">{data.whois.expires}</h3>
              </div>
              <Activity className="h-6 w-6 text-muted-foreground/35" />
            </Card>
 
          </div>
 
          {/* DNS Records Tab Sheets */}
          <Card className="bg-[#09090b]/40 border-card-border/60 p-6 space-y-4">
            <h3 className="text-base font-semibold text-foreground border-b border-card-border/20 pb-3">
              DNS Server Record Lookup
            </h3>
 
            <Tabs defaultValue="a">
              <div className="flex justify-start mb-4">
                <TabsList className="bg-black/60 border border-card-border/60">
                  <TabsTrigger value="a">A Records</TabsTrigger>
                  <TabsTrigger value="ns">Nameservers (NS)</TabsTrigger>
                  <TabsTrigger value="mx">Mail (MX)</TabsTrigger>
                  <TabsTrigger value="txt">TXT Records</TabsTrigger>
                </TabsList>
              </div>
 
              {/* A Records */}
              <TabsContent value="a" className="space-y-2">
                <p className="text-xs text-muted-foreground font-light mb-4">
                  A records map the domain name to the IPv4 address of the hosting server.
                </p>
                {data.dns.A.length > 0 ? (
                  <div className="space-y-2">
                    {data.dns.A.map((ip, i) => (
                      <div key={i} className="p-3 bg-black/40 border border-card-border/40 rounded font-mono text-xs text-primary">
                        {ip}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic p-3 bg-black/20 rounded">No A records resolved.</div>
                )}
              </TabsContent>
 
              {/* NS Records */}
              <TabsContent value="ns" className="space-y-2">
                <p className="text-xs text-muted-foreground font-light mb-4">
                  Authoritative nameservers specify which servers host the DNS records for the domain.
                </p>
                {data.dns.NS.length > 0 ? (
                  <div className="space-y-2">
                    {data.dns.NS.map((ns, i) => (
                      <div key={i} className="p-3 bg-black/40 border border-card-border/40 rounded font-mono text-xs text-primary">
                        {ns}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic p-3 bg-black/20 rounded">No NS records resolved.</div>
                )}
              </TabsContent>
 
              {/* MX Records */}
              <TabsContent value="mx" className="space-y-2">
                <p className="text-xs text-muted-foreground font-light mb-4">
                  Mail Exchange records route incoming emails to the designated mail servers.
                </p>
                {data.dns.MX.length > 0 ? (
                  <div className="space-y-2">
                    {data.dns.MX.map((mx, i) => (
                      <div key={i} className="flex justify-between p-3 bg-black/40 border border-card-border/40 rounded font-mono text-xs">
                        <span className="text-primary">{mx.exchange}</span>
                        <span className="text-muted-foreground">Priority: {mx.priority}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic p-3 bg-black/20 rounded">No MX records resolved.</div>
                )}
              </TabsContent>
 
              {/* TXT Records */}
              <TabsContent value="txt" className="space-y-2">
                <p className="text-xs text-muted-foreground font-light mb-4">
                  Text records are used for domain ownership validation, email security parameters (SPF, DKIM, DMARC).
                </p>
                {data.dns.TXT.length > 0 ? (
                  <div className="space-y-2">
                    {data.dns.TXT.map((txt, i) => (
                      <div key={i} className="p-3 bg-black/40 border border-card-border/40 rounded font-mono text-xs text-foreground/80 break-words">
                        {txt}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground italic p-3 bg-black/20 rounded">No TXT records resolved.</div>
                )}
              </TabsContent>
 
            </Tabs>
          </Card>
 
        </div>
      )}
 
    </ToolLayout>
  );
}
