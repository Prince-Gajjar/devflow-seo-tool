import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
  const selector = searchParams.get("selector");
 
  if (!targetUrl || !selector) {
    return NextResponse.json(
      { error: "URL and selector query parameters are required" },
      { status: 400 }
    );
  }
 
  try {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }
 
    // Fetch HTML
    const response = await axios.get(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DevFlow-CSS-Selector-Scraper/1.0)",
      },
      timeout: 6000,
    });
 
    const html = response.data;
    const $ = cheerio.load(html);
    const matches: { text: string; tag: string; attributes: Record<string, string> }[] = [];
 
    $(selector).each((_, el) => {
      const element = $(el);
      const attributes: Record<string, string> = {};
      
      // Extract key attributes
      const attrsList = (el as any).attribs;
      if (attrsList) {
        Object.keys(attrsList).forEach((attr) => {
          attributes[attr] = attrsList[attr];
        });
      }
 
      matches.push({
        text: element.text().trim().substring(0, 500), // Limit text content length per item
        tag: (el as any).name || "",
        attributes,
      });
    });
 
    return NextResponse.json({
      url: cleanUrl,
      selector,
      count: matches.length,
      matches,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch webpage or parse CSS selectors" },
      { status: 500 }
    );
  }
}
