import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your InstAShark account settings, appearance, and preferences.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}