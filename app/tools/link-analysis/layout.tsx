import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Analyzer | DevFlow SEO Tool",
  description: "Scan a webpage to extract internal, external, and nofollow links, showing HTTP status codes.",
  openGraph: {
    title: "Link Analyzer | DevFlow SEO Tool",
    description: "Scan a webpage to extract internal, external, and nofollow links, showing HTTP status codes.",
    url: "https://seo.devflow.co.in/tools/link-analysis",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/link-analysis",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
