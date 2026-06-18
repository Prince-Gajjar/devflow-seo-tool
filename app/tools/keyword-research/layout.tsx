import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Keyword Research Tool - DevFlow SEO Suite",
  description: "Generate real-time keyword suggestions with search volume, CPC, difficulty, and trends for content planning.",
};

export default function KeywordResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
