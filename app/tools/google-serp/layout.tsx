import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google SERP Checker - DevFlow SEO Suite",
  description: "Simulate and analyze organic search engine rankings for target keyword queries in Google Search Results.",
};

export default function GoogleSerpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
