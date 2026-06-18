import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Crawlability Test - DevFlow SEO Suite",
  description: "Verify if search engine spiders can access, crawl, and render your web pages with bot simulations.",
};

export default function CrawlabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
