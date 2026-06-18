import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Referrers Checker | DevFlow SEO Tool",
  description: "Identify top referral traffic sources and domains backlinking to a site.",
  openGraph: {
    title: "Top Referrers Checker | DevFlow SEO Tool",
    description: "Identify top referral traffic sources and domains backlinking to a site.",
    url: "https://seo.devflow.co.in/tools/top-referrers",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/top-referrers",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
