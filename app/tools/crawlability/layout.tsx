import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crawlability Test | DevFlow SEO Tool",
  description: "Test if search engine spiders can access, crawl, and render a webpage.",
  openGraph: {
    title: "Crawlability Test | DevFlow SEO Tool",
    description: "Test if search engine spiders can access, crawl, and render a webpage.",
    url: "https://seo.devflow.co.in/tools/crawlability",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/crawlability",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
