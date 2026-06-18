import { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML Sitemap Finder & Validator - DevFlow SEO Suite",
  description: "Locate and validate XML sitemaps and view server robots.txt files for search engine crawler compliance.",
};

export default function SitemapFinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
