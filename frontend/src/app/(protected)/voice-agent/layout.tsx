import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Voice Agent",
  description: "Talk to your AI assistant with voice or text. Choose between Raj and Ayushi voice agents on InstAShark.",
};

export default function VoiceAgentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}