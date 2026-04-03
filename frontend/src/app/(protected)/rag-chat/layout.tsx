import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RAG Chat",
  description: "Upload PDFs and chat with your documents using AI-powered retrieval augmented generation.",
};

export default function RagChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}