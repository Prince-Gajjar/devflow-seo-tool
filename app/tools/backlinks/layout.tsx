import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backlink Checker | DevFlow SEO Tool",
  description: "Discover external backlinks pointing to your domain, showing anchor text and link types.",
  openGraph: {
    title: "Backlink Checker | DevFlow SEO Tool",
    description: "Discover external backlinks pointing to your domain, showing anchor text and link types.",
    url: "https://seo.devflow.co.in/tools/backlinks",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/backlinks",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
