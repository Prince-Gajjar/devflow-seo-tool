import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Authority Checker - DevFlow SEO Suite",
  description: "Verify page-level authority scores (PA), title tags, and meta tag alignments for deep URLs.",
};

export default function PageAuthorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
