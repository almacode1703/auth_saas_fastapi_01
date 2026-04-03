import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose your InstAShark plan. Start free, upgrade when you need more. Pay with credit card or Solana.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}