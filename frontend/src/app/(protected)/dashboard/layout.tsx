import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your InstAShark dashboard. Access all AI services from one place.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}