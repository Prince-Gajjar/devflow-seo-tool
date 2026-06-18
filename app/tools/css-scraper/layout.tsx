import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Selector Scraper | DevFlow SEO Tool",
  description: "Parse a webpage's HTML structure and extract content using custom CSS selectors.",
  openGraph: {
    title: "CSS Selector Scraper | DevFlow SEO Tool",
    description: "Parse a webpage's HTML structure and extract content using custom CSS selectors.",
    url: "https://seo.devflow.co.in/tools/css-scraper",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/css-scraper",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
