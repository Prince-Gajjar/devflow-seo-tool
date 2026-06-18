import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bing SERP Checker - DevFlow SEO Suite",
  description: "Analyze organic search engine rankings for target keywords in simulated Bing Search Results.",
};

export default function BingSerpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
