import { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://devflow-seo-tool.vercel.app";

  // Base static pages
  const staticPages = ["", "/tools", "/about", "/privacy-policy"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : route === "/tools" ? 0.9 : 0.7,
    })
  );

  // Dynamic tools pages
  const toolsPages = TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...toolsPages];
}
