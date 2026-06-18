import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyword Research Tool | DevFlow SEO Tool",
  description: "Generate keyword suggestions with search volume, CPC, difficulty, and trends.",
  openGraph: {
    title: "Keyword Research Tool | DevFlow SEO Tool",
    description: "Generate keyword suggestions with search volume, CPC, difficulty, and trends.",
    url: "https://seo.devflow.co.in/tools/keyword-research",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/keyword-research",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
