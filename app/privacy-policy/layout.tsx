import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - DevFlow SEO Tool",
  description:
    "Review the privacy policy for DevFlow SEO Tool. We practice 100% data privacy: zero tracking cookies, zero crawl database histories, and zero logs tracking.",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
