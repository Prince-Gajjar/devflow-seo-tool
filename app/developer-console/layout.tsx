import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Console Workspace - DevFlow SEO Tool",
  description:
    "Generate free API access keys, configure POST webhook notifications for Slack/Discord, and view your local browser SEO audit session history.",
};

export default function DeveloperConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
