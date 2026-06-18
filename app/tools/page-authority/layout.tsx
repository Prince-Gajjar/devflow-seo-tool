import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Authority Checker | DevFlow SEO Tool",
  description: "Verify page-level authority scores, title tags, and meta tag status for URLs.",
  openGraph: {
    title: "Page Authority Checker | DevFlow SEO Tool",
    description: "Verify page-level authority scores, title tags, and meta tag status for URLs.",
    url: "https://seo.devflow.co.in/tools/page-authority",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/page-authority",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
