import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WHOIS & DNS Inspector | DevFlow SEO Tool",
  description: "Retrieve domain WHOIS registrar info and check DNS server records (NS, MX, TXT, A).",
  openGraph: {
    title: "WHOIS & DNS Inspector | DevFlow SEO Tool",
    description: "Retrieve domain WHOIS registrar info and check DNS server records (NS, MX, TXT, A).",
    url: "https://seo.devflow.co.in/tools/whois-inspector",
  },
  alternates: {
    canonical: "https://seo.devflow.co.in/tools/whois-inspector",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
