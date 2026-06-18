import { NextResponse } from "next/server";
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
 
  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }
 
  try {
    let currentUrl = targetUrl.trim();
    if (!currentUrl.startsWith("http://") && !currentUrl.startsWith("https://")) {
      currentUrl = `https://${currentUrl}`;
    }
 
    const hops = [];
    let loopCount = 0;
    const maxHops = 10;
 
    while (loopCount < maxHops) {
      const startTime = Date.now();
      // Using fetch with redirect: "manual" to intercept redirect headers
      const res = await fetch(currentUrl, {
        method: "HEAD",
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; DevFlow-SEO-Tracer/1.0)",
        },
      });
      const duration = Date.now() - startTime;
 
      hops.push({
        url: currentUrl,
        status: res.status,
        latency: duration,
        type: res.status >= 300 && res.status < 400 ? "Redirect" : "Final Destination",
      });
 
      if (res.status >= 300 && res.status < 400) {
        const nextLoc = res.headers.get("location");
        if (!nextLoc) {
          break;
        }
 
        if (nextLoc.startsWith("/")) {
          const parsed = new URL(currentUrl);
          currentUrl = `${parsed.protocol}//${parsed.host}${nextLoc}`;
        } else {
          currentUrl = nextLoc;
        }
        loopCount++;
      } else {
        break;
      }
    }
 
    return NextResponse.json({ hops });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to resolve redirect paths" },
      { status: 500 }
    );
  }
}
