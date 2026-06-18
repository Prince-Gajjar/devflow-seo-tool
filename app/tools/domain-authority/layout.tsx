import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Authority Checker | DevFlow SEO Tool",
  description: "Calculate authority scores, spam scores, and referring domains for multiple domains.",
  openGraph: {
    title: "Domain Authority Checker | DevFlow SEO Tool",
    description: "Calculate authority scores, spam scores, and referring domains for multiple domains.",
    url: "https://seo.devflow.co.in/tools/domain-authority",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/domain-authority",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
