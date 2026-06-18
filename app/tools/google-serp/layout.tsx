import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google SERP Checker | DevFlow SEO Tool",
  description: "Analyze search rankings for keyword queries in simulated Google Search Results.",
  openGraph: {
    title: "Google SERP Checker | DevFlow SEO Tool",
    description: "Analyze search rankings for keyword queries in simulated Google Search Results.",
    url: "https://seo.devflow.co.in/tools/google-serp",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/google-serp",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
