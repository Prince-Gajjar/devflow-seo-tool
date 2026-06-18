import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Search Queries Finder - DevFlow SEO Suite",
  description: "Reverse-engineer search strategies by finding high-traffic search queries and keywords by topic or competitor domain.",
};

export default function TopSearchQueriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
