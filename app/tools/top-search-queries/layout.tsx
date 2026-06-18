import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Search Queries | DevFlow SEO Tool",
  description: "Find high-traffic search queries and keywords by topic or competitor domain.",
  openGraph: {
    title: "Top Search Queries | DevFlow SEO Tool",
    description: "Find high-traffic search queries and keywords by topic or competitor domain.",
    url: "https://seo.devflow.co.in/tools/top-search-queries",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/top-search-queries",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
