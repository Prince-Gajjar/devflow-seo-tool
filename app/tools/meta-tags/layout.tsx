import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Tags Extractor & Auditor - DevFlow SEO Suite",
  description: "Extract, analyze, and preview HTML meta tags, Open Graph tags, and Twitter Cards from any webpage URL.",
};

export default function MetaTagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
