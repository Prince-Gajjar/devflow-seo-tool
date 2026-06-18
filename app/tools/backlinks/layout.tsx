import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Backlink Checker - DevFlow SEO Suite",
  description: "Discover incoming external backlinks pointing to your domain, anchor text relevance, and link types.",
};

export default function BacklinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
