import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redirect Chain Tracer (301/302) - DevFlow SEO Suite",
  description: "Trace redirect hops (301, 302, 307, 308) to verify final canonical URL destinations and latency timings.",
};

export default function RedirectTracerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
