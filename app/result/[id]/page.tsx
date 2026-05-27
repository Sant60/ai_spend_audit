import type { Metadata } from "next";
import ResultView from "@/components/results/ResultView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://ai-spend-audit.vercel.app";
  const url = `${baseUrl}/result/${id}`;
  const title = "My AI Spend Audit — See How Much I Could Save";
  const description =
    "I ran a free AI spend audit and found out exactly where my team is overpaying on AI tools. Find out what yours looks like.";
  const image = `${baseUrl}/og-result.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "AI Spend Audit by Credex",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "AI Spend Audit Results",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@credexrocks",
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;

  return <ResultView auditId={id} />;
}
