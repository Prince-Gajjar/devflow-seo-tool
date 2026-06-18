import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Webpage Link Analyzer & Crawler - DevFlow SEO Suite",
  description: "Scan a webpage to extract internal, external, dofollow, and nofollow links, reporting HTTP status codes.",
};

export default function LinkAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
