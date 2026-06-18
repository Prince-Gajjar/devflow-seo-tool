import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Tools Directory - DevFlow SEO Tool",
  description:
    "Browse and launch our 18 free developer-first search engine diagnostics tools. Trace redirect chains, analyze keyword density, inspect WHOIS DNS records, and test index crawlability.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
