import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyword Density Checker - DevFlow SEO Suite",
  description: "Analyze webpage content or raw text to measure keyword frequency, density distributions, and readability metrics.",
};

export default function KeywordDensityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
