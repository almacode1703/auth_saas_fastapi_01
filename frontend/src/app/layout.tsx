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
  title: "Auth SaaS",
  description: "Authentication system with Next.js and FastAPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${bebasNeue.variable} h-full antialiased dark`}
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