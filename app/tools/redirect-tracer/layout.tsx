import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redirect Chain Tracer | DevFlow SEO Tool",
  description: "Trace redirect paths (301/302) to verify final canonical URL statuses.",
  openGraph: {
    title: "Redirect Chain Tracer | DevFlow SEO Tool",
    description: "Trace redirect paths (301/302) to verify final canonical URL statuses.",
    url: "https://seo.devflow.co.in/tools/redirect-tracer",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/redirect-tracer",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
