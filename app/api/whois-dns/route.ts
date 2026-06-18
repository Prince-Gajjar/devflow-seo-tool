import { NextResponse } from "next/server";
import dns from "dns/promises";
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");
 
  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }
 
  // Clean domain name (remove http, paths, etc.)
  let cleanDomain = domain.trim().toLowerCase();
  try {
    if (cleanDomain.startsWith("http://") || cleanDomain.startsWith("https://")) {
      const parsed = new URL(cleanDomain);
      cleanDomain = parsed.hostname;
    } else {
      // Try parsing as URL by pre-pending https://
      const parsed = new URL(`https://${cleanDomain}`);
      cleanDomain = parsed.hostname;
    }
  } catch {
    // Fallback if parsing fails
    cleanDomain = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
  }
 
  try {
    // 1. Fetch DNS Records using Node Promises DNS
    const dnsRecords: Record<string, any> = {};
 
    try {
      dnsRecords.A = await dns.resolve4(cleanDomain);
    } catch {
      dnsRecords.A = [];
    }
 
    try {
      dnsRecords.MX = await dns.resolveMx(cleanDomain);
    } catch {
      dnsRecords.MX = [];
    }
 
    try {
      const txt = await dns.resolveTxt(cleanDomain);
      dnsRecords.TXT = txt.map((t) => t.join(" "));
    } catch {
      dnsRecords.TXT = [];
    }
 
    try {
      dnsRecords.NS = await dns.resolveNs(cleanDomain);
    } catch {
      dnsRecords.NS = [];
    }
 
    // 2. Fetch WHOIS details via RDAP HTTP protocol
    let whoisData = {
      registrar: "N/A",
      created: "N/A",
      expires: "N/A",
    };
 
    try {
      const rdapRes = await fetch(`https://rdap.org/domain/${cleanDomain}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(4000), // Timeout after 4 seconds
      });
 
      if (rdapRes.ok) {
        const data = await rdapRes.json();
        
        // Extract registrar name
        if (data.entities && data.entities.length > 0) {
          const registrarEntity = data.entities.find((e: any) =>
            e.roles && e.roles.includes("registrar")
          );
          if (registrarEntity && registrarEntity.vcardArray && registrarEntity.vcardArray[1]) {
            const fnItem = registrarEntity.vcardArray[1].find((i: any) => i[0] === "fn");
            if (fnItem) whoisData.registrar = fnItem[3];
          }
        }
 
        // Extract events (created, expired dates)
        if (data.events && data.events.length > 0) {
          const creationEvent = data.events.find((e: any) => e.eventAction === "registration");
          const expirationEvent = data.events.find((e: any) => e.eventAction === "expiration");
 
          if (creationEvent) whoisData.created = new Date(creationEvent.eventDate).toLocaleDateString();
          if (expirationEvent) whoisData.expires = new Date(expirationEvent.eventDate).toLocaleDateString();
        }
      }
    } catch {
      // Gracefully handle RDAP fetch timeout or errors
    }
 
    return NextResponse.json({
      domain: cleanDomain,
      dns: dnsRecords,
      whois: whoisData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to query domain data" },
      { status: 500 }
    );
  }
}
