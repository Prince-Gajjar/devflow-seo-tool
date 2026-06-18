import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyword Density Checker | DevFlow SEO Tool",
  description: "Analyze webpage content or raw text to measure keyword frequency, density, and readability.",
  openGraph: {
    title: "Keyword Density Checker | DevFlow SEO Tool",
    description: "Analyze webpage content or raw text to measure keyword frequency, density, and readability.",
    url: "https://seo.devflow.co.in/tools/keyword-density",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/keyword-density",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
