import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap Finder | DevFlow SEO Tool",
  description: "Locate and validate XML sitemaps and view robots.txt files for any website.",
  openGraph: {
    title: "Sitemap Finder | DevFlow SEO Tool",
    description: "Locate and validate XML sitemaps and view robots.txt files for any website.",
    url: "https://seo.devflow.co.in/tools/sitemap-finder",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/sitemap-finder",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
