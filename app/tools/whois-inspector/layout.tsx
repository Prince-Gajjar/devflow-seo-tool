import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WHOIS & DNS Records Inspector - DevFlow SEO Suite",
  description: "Retrieve domain WHOIS registrar info and check DNS server records (NS, MX, TXT, A) in real-time.",
};

export default function WhoisInspectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
