import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About DevFlow SEO Tool - Our Mission & Core Principles",
  description:
    "Learn about DevFlow SEO Tool, our mission to democratize search engine diagnostics, and our core principles of zero friction, real server-side scraping, and user privacy.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
