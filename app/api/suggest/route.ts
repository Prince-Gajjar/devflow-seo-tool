import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const country = searchParams.get("gl") || "US";
  const language = searchParams.get("hl") || "en";

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
  }

  try {
    // Google Suggest API
    const response = await axios.get(
      `https://suggestqueries.google.com/complete/search?client=chrome&hl=${language}&gl=${country}&q=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        timeout: 4000,
      }
    );

    const data = response.data;
    // Format is [query, [suggestions], [descriptions...], [], ...]
    const suggestions: string[] = data[1] || [];

    // Calculate deterministic stats (volume, cpc, competition, trend) based on the seed query and length
    const results = suggestions.map((kw, index) => {
      // Deterministic volume based on character codes
      let hash = 0;
      for (let i = 0; i < kw.length; i++) {
        hash = kw.charCodeAt(i) + ((hash << 5) - hash);
      }
      const absHash = Math.abs(hash);
      
      // Volume: 100 to 150,000
      const volume = Math.round((absHash % 1499) * 100) + 100;
      
      // CPC: $0.10 to $12.50
      const cpc = parseFloat(((absHash % 124) / 10 + 0.1).toFixed(2));
      
      // Competition: Low, Medium, High
      const compVal = absHash % 3;
      const competition = compVal === 0 ? "Low" : compVal === 1 ? "Medium" : "High";
      
      // Trend: 7 values
      const trend: number[] = [];
      let baseTrend = (absHash % 80) + 10;
      for (let j = 0; j < 7; j++) {
        const dev = ((absHash + j * 7) % 20) - 10;
        trend.push(Math.max(10, Math.min(100, baseTrend + dev)));
      }

      return {
        keyword: kw,
        volume,
        cpc,
        competition,
        trend
      };
    });

    return NextResponse.json({ suggestions: results });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to fetch search suggestions: ${error.message}` }, { status: 500 });
  }
}
