import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Selector Scraper Playground - DevFlow SEO Suite",
  description: "Parse a webpage's HTML structure and extract custom content using targeting CSS selector queries.",
};

export default function CssScraperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
