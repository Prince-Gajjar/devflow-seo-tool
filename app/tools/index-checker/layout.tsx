import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Index Checker | DevFlow SEO Tool",
  description: "Perform bulk checks to see if URLs are indexed in Google and Bing search engines.",
  openGraph: {
    title: "Index Checker | DevFlow SEO Tool",
    description: "Perform bulk checks to see if URLs are indexed in Google and Bing search engines.",
    url: "https://seo.devflow.co.in/tools/index-checker",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/index-checker",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
