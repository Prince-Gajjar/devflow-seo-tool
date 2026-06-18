import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Authority Checker - DevFlow SEO Suite",
  description: "Calculate domain authority scores (DA), spam score percentages, and total referring domains.",
};

export default function DomainAuthorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
