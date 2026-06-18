import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitor SEO Checker & Auditor - DevFlow SEO Suite",
  description: "Audit a competitor's website for keywords, backlinks, page speed load times, and index coverage.",
};

export default function CompetitionCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
