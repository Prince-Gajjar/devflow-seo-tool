import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Tags Extractor | DevFlow SEO Tool",
  description: "Extract, analyze, and preview meta tags, Open Graph tags, and Twitter Cards from any URL.",
  openGraph: {
    title: "Meta Tags Extractor | DevFlow SEO Tool",
    description: "Extract, analyze, and preview meta tags, Open Graph tags, and Twitter Cards from any URL.",
    url: "https://seo.devflow.co.in/tools/meta-tags",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/meta-tags",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
