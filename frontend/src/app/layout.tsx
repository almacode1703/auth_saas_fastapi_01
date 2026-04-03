import type { Metadata } from "next";
import { Nunito, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "InstAShark | AI-Powered Platform",
    template: "%s | InstAShark",
  },
  description:
    "InstAShark brings together powerful AI tools — RAG chat, image generation, voice agents, analytics — all behind secure authentication. Start free today.",
  keywords: [
    "AI platform",
    "RAG chat",
    "image generation",
    "voice agent",
    "DALL-E",
    "LangChain",
    "AI SaaS",
    "InstAShark",
    "ChatGPT",
    "AI tools",
  ],
  openGraph: {
    title: "InstAShark | AI-Powered Platform",
    description:
      "Your AI Services, One Platform. RAG Chat, Image Generation, Voice Agents, and more.",
    type: "website",
    siteName: "InstAShark",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstAShark | AI-Powered Platform",
    description: "Your AI Services, One Platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${bebasNeue.variable} h-full antialiased dark `}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-nunito)]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}