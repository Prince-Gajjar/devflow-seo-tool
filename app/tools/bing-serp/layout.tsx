import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bing SERP Checker | DevFlow SEO Tool",
  description: "Analyze search rankings for keyword queries in simulated Bing Search Results.",
  openGraph: {
    title: "Bing SERP Checker | DevFlow SEO Tool",
    description: "Analyze search rankings for keyword queries in simulated Bing Search Results.",
    url: "https://seo.devflow.co.in/tools/bing-serp",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/bing-serp",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
