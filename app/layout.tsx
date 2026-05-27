import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://ai-spend-audit.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AI Spend Audit — Find Out If You're Overpaying on AI Tools",
    template: "%s | AI Spend Audit",
  },
  description:
    "Free tool for startup founders and engineering managers. Enter your AI subscriptions and get an instant audit showing exactly where you're overspending.",
  openGraph: {
    title: "AI Spend Audit — Find Out If You're Overpaying on AI Tools",
    description:
      "Free audit tool for startups. Enter your AI tool spend and get instant savings recommendations.",
    url: baseUrl,
    siteName: "AI Spend Audit by Credex",
    images: [
      {
        url: `${baseUrl}/og-home.png`,
        width: 1200,
        height: 630,
        alt: "AI Spend Audit",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Spend Audit — Find Out If You're Overpaying on AI Tools",
    description:
      "Free audit tool. Find out if your team is overpaying on ChatGPT, Claude, Cursor, Copilot and more.",
    images: [`${baseUrl}/og-home.png`],
    creator: "@credexrocks",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white antialiased">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
