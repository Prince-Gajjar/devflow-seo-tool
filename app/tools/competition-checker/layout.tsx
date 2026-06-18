import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitor SEO Checker | DevFlow SEO Tool",
  description: "Audit a competitor's website for keywords, backlinks, page speed, and index coverage.",
  openGraph: {
    title: "Competitor SEO Checker | DevFlow SEO Tool",
    description: "Audit a competitor's website for keywords, backlinks, page speed, and index coverage.",
    url: "https://seo.devflow.co.in/tools/competition-checker",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/competition-checker",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
