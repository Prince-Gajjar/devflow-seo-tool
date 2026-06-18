import { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://seo.devflow.co.in";

  // Base static pages
  const staticPages = [
    { route: "", changeFreq: "daily" as const, priority: 1.0 },
    { route: "/tools", changeFreq: "daily" as const, priority: 0.9 },
    { route: "/about", changeFreq: "monthly" as const, priority: 0.5 },
    { route: "/privacy-policy", changeFreq: "monthly" as const, priority: 0.3 }
  ].map(({ route, changeFreq, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }));

  // Dynamic tools pages
  const toolsPages = TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...toolsPages];
}
