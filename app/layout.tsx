import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevFlow SEO Tool - Professional SEO Tools for Developers & Marketers",
  description:
    "Analyze, optimize, and dominate search rankings with DevFlow's professional-grade SEO toolkit. 100% free and no registration required.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col bg-background text-foreground antialiased transition-colors duration-300 relative overflow-x-hidden`}
      >
        <div className="grid-overlay" />
        <div className="ambient-glow" />
        <Navbar />
        <main className="flex-grow flex flex-col relative z-10">{children}</main>
        <Footer />
        
        {/* React Hot Toast Configured with Sleek Custom Theme */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#09090b",
              color: "#fafafa",
              border: "1px solid #1c1c1f",
              borderRadius: "4px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#a3e635",
                secondary: "#000000",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}

