import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Image Generator",
  description: "Generate stunning images from text prompts using DALL-E 3 on InstAShark.",
};

export default function ImageGenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}