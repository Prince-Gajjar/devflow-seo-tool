#!/usr/bin/env node
 
const https = require("https");
const http = require("http");
 
// ANSI Escape Codes for Terminal Colors
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const red = "\x1b[31m";
const bold = "\x1b[1m";
const reset = "\x1b[0m";
 
const args = process.argv.slice(2);
const command = args[0];
const target = args[1];
 
// Automatic environment detection (prefers local dev server if active)
function checkHost() {
  return new Promise((resolve) => {
    let resolved = false;
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        req.destroy();
        resolve("https://seo.devflow.co.in");
      }
    }, 2000);
 
    const req = http.get("http://127.0.0.1:3000/api/domain-info?domain=google.com", (res) => {
      clearTimeout(timeoutId);
      if (!resolved) {
        resolved = true;
        if (res.statusCode === 200) {
          resolve("http://127.0.0.1:3000");
        } else {
          resolve("https://seo.devflow.co.in");
        }
      }
    });
 
    req.on("error", (err) => {
      clearTimeout(timeoutId);
      if (!resolved) {
        resolved = true;
        resolve("https://seo.devflow.co.in");
      }
    });
  });
}
 
function printHelp() {
  console.log(`
${bold}${green}DevFlow SEO Companion CLI${reset}
Usage:
  npx devflow-seo analyze <domain-or-url>
  npx devflow-seo dns <domain>
 
Examples:
  npx devflow-seo analyze github.com
  npx devflow-seo dns google.com
  `);
}
 
if (!command || !target || (command !== "analyze" && command !== "dns")) {
  printHelp();
  process.exit(0);
}
 
// Helper to perform HTTP GET requests in Node.js
function getJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Failed to parse API response."));
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}
 
async function run() {
  const BASE_URL = await checkHost();
  console.log(`\n${bold}${green}➔ Initializing DevFlow SEO Diagnostics...${reset}`);
  
  if (command === "analyze") {
    console.log(`Auditing target URL: ${bold}${target}${reset}\n`);
    
    try {
      // 1. Fetch domain-info
      console.log(`[1/3] Resolving server DNS records...`);
      const dnsData = await getJson(`${BASE_URL}/api/domain-info?domain=${encodeURIComponent(target)}`);
      
      // 2. Fetch meta scrape
      console.log(`[2/3] Auditing HTML header tags...`);
      const metaData = await getJson(`${BASE_URL}/api/scrape?mode=meta&url=${encodeURIComponent(target)}`);
      
      // 3. Fetch redirect trace
      console.log(`[3/3] Tracing canonical redirection paths...\n`);
      const traceData = await getJson(`${BASE_URL}/api/redirect-trace?url=${encodeURIComponent(target)}`);
 
      // Print Beautiful Consolidated Terminal Report
      console.log(`${bold}${green}=========================================${reset}`);
      console.log(`${bold}${green}      DEVFLOW SEO DIAGNOSTICS REPORT     ${reset}`);
      console.log(`${bold}${green}=========================================${reset}\n`);
      
      console.log(`${bold}Domain Details:${reset}`);
      console.log(`  Hostname:      ${dnsData.domain || target}`);
      console.log(`  IP Resolved:   ${dnsData.ip || "Offline/Unresolved"}`);
      console.log(`  SSL Status:    ${dnsData.ssl ? `${green}Active (HTTPS)${reset}` : `${red}Inactive (HTTP)${reset}`}`);
      console.log(`  Spam Score:    ${dnsData.spamScore > 10 ? `${red}${dnsData.spamScore}%${reset}` : `${green}${dnsData.spamScore}%${reset}`}`);
      console.log(`  Domain DA:     ${bold}${green}DA ${dnsData.da}${reset}\n`);
 
      console.log(`${bold}HTML Meta Tags:${reset}`);
      if (metaData.error) {
        console.log(`  ${red}Failed to parse HTML header tags.${reset}`);
      } else {
        console.log(`  Title:         ${metaData.title ? `"${metaData.title}"` : `${red}Missing <title> tag${reset}`}`);
        console.log(`  Description:   ${metaData.description ? `"${metaData.description.substring(0, 80)}..."` : `${red}Missing <meta name="description"> tag${reset}`}`);
        console.log(`  Canonical:     ${metaData.canonical ? `"${metaData.canonical}"` : `${yellow}Missing rel="canonical"${reset}`}`);
      }
      console.log("");
 
      console.log(`${bold}Redirection Hops:${reset}`);
      if (traceData.hops && traceData.hops.length > 0) {
        traceData.hops.forEach((hop, i) => {
          const color = hop.status === 200 ? green : yellow;
          console.log(`  Hop ${i + 1}: [${color}${hop.status}${reset}] ${hop.url} (${hop.latency}ms)`);
        });
      } else {
        console.log(`  No redirect logs trace returned.`);
      }
      console.log(`\n${bold}${green}=========================================${reset}\n`);
 
    } catch (err) {
      console.error(`\n${red}Error: Failed to fetch diagnostics data.${reset}`);
      console.error(err.message);
    }
  } else if (command === "dns") {
    console.log(`Querying DNS records for: ${bold}${target}${reset}\n`);
    try {
      const data = await getJson(`${BASE_URL}/api/whois-dns?domain=${encodeURIComponent(target)}`);
      
      console.log(`${bold}${green}=========================================${reset}`);
      console.log(`${bold}${green}          DNS & WHOIS RECORD LOG         ${reset}`);
      console.log(`${bold}${green}=========================================${reset}\n`);
      
      console.log(`${bold}WHOIS Info:${reset}`);
      console.log(`  Registrar:  ${data.whois?.registrar || "N/A"}`);
      console.log(`  Registered: ${data.whois?.created || "N/A"}`);
      console.log(`  Expires:    ${data.whois?.expires || "N/A"}\n`);
      
      console.log(`${bold}DNS A Records:${reset}`);
      if (data.dns?.A && data.dns.A.length > 0) {
        data.dns.A.forEach(ip => console.log(`  ➔ ${ip}`));
      } else {
        console.log(`  No A records found.`);
      }
      console.log("");
 
      console.log(`${bold}DNS Nameservers (NS):${reset}`);
      if (data.dns?.NS && data.dns.NS.length > 0) {
        data.dns.NS.forEach(ns => console.log(`  ➔ ${ns}`));
      } else {
        console.log(`  No NS records found.`);
      }
      console.log(`\n${bold}${green}=========================================${reset}\n`);
    } catch (err) {
      console.error(`\n${red}Error: Failed to fetch DNS data.${reset}`);
      console.error(err.message);
    }
  }
}
 
run();
