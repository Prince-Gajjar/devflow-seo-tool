import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Referrer Domains Checker - DevFlow SEO Suite",
  description: "Identify top organic referral traffic sources and domains backlinking to your site.",
};

export default function TopReferrersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
