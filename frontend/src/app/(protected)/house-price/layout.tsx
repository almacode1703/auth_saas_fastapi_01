import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "House Price Predictor",
  description: "Predict Bengaluru house prices using Linear Regression machine learning on 10,000+ real property listings.",
};

export default function HousePriceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}