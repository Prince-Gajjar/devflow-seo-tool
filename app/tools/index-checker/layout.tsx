import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google & Bing Index Checker - DevFlow SEO Suite",
  description: "Perform bulk URL tests to verify index coverage status in Google and Bing crawl databases.",
};

export default function IndexCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
